import { filtersSchema } from '@civica/contracts'
import { demoPeople, following, memoryRepresentatives, reported } from '@civica/domain'
import { camaraClient, minimizeRaw, normalizeDeputy, stablePersonId } from '@civica/source-camara'
import { describe, expect, it, vi } from 'vitest'
import { syncCamara } from '../../apps/worker/src/sync'
import fixture from '../fixtures/camara-204379.json'

const date = '2026-10-07T13:32:08.298Z'
describe('contratos e domínio', () => {
  it('limita paginação, preserva filtros e rejeita UF inválida', () => {
    expect(filtersSchema.parse({ name: '  Aurora  ', page: '2', uf: 'SP' })).toEqual({
      name: 'Aurora',
      page: 2,
      pageSize: 24,
      uf: 'SP',
    })
    for (const data of [
      { page: 0 },
      { page: 1.5 },
      { pageSize: 1000 },
      { uf: 'XX' },
      { name: 'a'.repeat(101) },
    ])
      expect(filtersSchema.safeParse(data).success).toBe(false)
  })
  it('busca sem acentos e pagina sem repetir pessoas', async () => {
    const repository = memoryRepresentatives()
    const first = await repository.list({ name: '', page: 1, pageSize: 6 })
    const second = await repository.list({ name: '', page: 2, pageSize: 6 })
    expect(new Set([...first.items, ...second.items].map((p) => p.id)).size).toBe(12)
    expect(
      (await repository.list({ name: 'olivia', uf: 'SC', page: 1, pageSize: 6 })).items[0]?.name,
    ).toBe('Olívia dos Caminhos')
    expect((await repository.list({ name: 'ausente', page: 1, pageSize: 6 })).total).toBe(0)
  })
  it('distingue zero de ausência e mantém demonstração sem contato inventado', () => {
    expect(reported('0')).toEqual({ state: 'available', value: '0' })
    expect(reported(null)).toEqual({ state: 'not_informed', value: null })
    expect(
      demoPeople.every(
        (p) => p.demo && p.email.state === 'not_applicable' && p.provenance.officialUrl === null,
      ),
    ).toBe(true)
  })
  it('recusa seguir sem identidade e recusa alvo inexistente', async () => {
    const repo = { list: vi.fn(), add: vi.fn(), remove: vi.fn() }
    await expect(
      following(null, repo, memoryRepresentatives()).follow(demoPeople[0]?.id ?? ''),
    ).rejects.toThrow('UNAUTHORIZED')
    await expect(
      following('verified-user', repo, memoryRepresentatives()).follow('missing'),
    ).rejects.toThrow('NOT_FOUND')
    expect(repo.add).not.toHaveBeenCalled()
  })
})
describe('adapter Câmara', () => {
  it('normaliza fixture oficial sem inventar contato nem unir pelo nome', () => {
    const person = normalizeDeputy(fixture, date)
    expect(person.provenance.externalId).toBe('204379')
    expect(person.email).toEqual({ state: 'not_informed', value: null })
    expect(person.uf).toBe('AP')
    expect(person.id).toBe(stablePersonId('204379'))
    expect(person.id).not.toBe(stablePersonId('220714'))
    expect(() => normalizeDeputy({ dados: { id: 1 } }, date)).toThrow()
  })
  it('remove CPF antes de persistir, conserva hash de origem e declara a minimização', () => {
    const raw = minimizeRaw(
      JSON.stringify({ dados: { ...fixture.dados, cpf: '00000000000' } }),
      'deputado',
    )
    expect(raw.text).not.toContain('cpf')
    expect(raw.text).not.toContain('00000000000')
    expect(raw.redactedFields).toEqual(['dados.cpf'])
    expect(raw.hash).not.toBe(raw.sourceHash)
    expect(JSON.parse(raw.text)).toEqual(fixture)
  })
  it('repete 429 limitado e respeita cancelamento', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 429, headers: { 'Retry-After': '0' } }))
      .mockResolvedValue(new Response(JSON.stringify(fixture)))
    await camaraClient(fetcher).detail(204379, new AbortController().signal)
    expect(fetcher).toHaveBeenCalledTimes(2)
    await expect(camaraClient(fetcher).detail(204379, AbortSignal.abort())).rejects.toThrow()
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})
describe('worker limitado', () => {
  const raw = (payload: unknown, resource: 'deputado' | 'deputados-lista', id: string) => ({
    url: 'https://dadosabertos.camara.leg.br/api/v2/deputados',
    externalId: id,
    resource,
    fetchedAt: date,
    ...minimizeRaw(JSON.stringify(payload), resource),
  })
  it('persiste RAW antes de normalizar e não avança checkpoint parcial', async () => {
    const order: string[] = []
    const storage = {
      saveRaw: vi.fn(async () => {
        order.push('raw')
        return 'snapshot'
      }),
      upsertRepresentative: vi.fn(async () => {
        order.push('normalized')
      }),
      startRun: vi.fn(async () => 'run'),
      updateRun: vi.fn(async (_id: string, _value: Record<string, unknown>) => {}),
    }
    const source = {
      list: vi.fn(async () =>
        raw(
          {
            dados: [{ id: 204379 }, { id: 220714 }],
            links: [
              { rel: 'next', href: 'https://dadosabertos.camara.leg.br/api/v2/deputados?pagina=2' },
            ],
          },
          'deputados-lista',
          '1',
        ),
      ),
      detail: vi.fn(async () => raw(fixture, 'deputado', '204379')),
    }
    const result = await syncCamara(
      storage,
      { maxPages: 2, pageSize: 2, limit: 1, signal: new AbortController().signal },
      source,
    )
    expect(result.processed).toBe(1)
    expect(order).toEqual(['raw', 'raw', 'normalized'])
    expect(storage.updateRun.mock.calls.some(([, value]) => 'checkpoint' in (value ?? {}))).toBe(
      false,
    )
  })
  it('marca execução cancelada e não busca a fonte', async () => {
    const storage = {
      saveRaw: vi.fn(),
      upsertRepresentative: vi.fn(),
      startRun: vi.fn(async () => 'run'),
      updateRun: vi.fn(async (_id: string, _value: Record<string, unknown>) => {}),
    }
    const source = { list: vi.fn(), detail: vi.fn() }
    await expect(
      syncCamara(
        storage,
        { maxPages: 1, pageSize: 1, limit: 1, signal: AbortSignal.abort() },
        source,
      ),
    ).rejects.toThrow()
    expect(storage.updateRun).toHaveBeenCalledWith(
      'run',
      expect.objectContaining({ status: 'cancelled' }),
    )
    expect(source.list).not.toHaveBeenCalled()
  })
})
