import { memoryRepresentatives } from '@civica/domain'
import { stablePersonId } from '@civica/source-camara'
import { LIST_URL, normalizeSenators, senadoClient, stableSenatorId } from '@civica/source-senado'
import { describe, expect, it, vi } from 'vitest'
import { syncSenado } from '../../apps/worker/src/senado'
import fixture from '../fixtures/senado-current.json'

const date = '2026-10-21T12:00:00.000Z'
const records = fixture.ListaParlamentarEmExercicio.Parlamentares.Parlamentar
const payload = (rows: unknown) => ({
  ListaParlamentarEmExercicio: {
    ...fixture.ListaParlamentarEmExercicio,
    Parlamentares: { Parlamentar: rows },
  },
})
const raw = (data: unknown = fixture) => ({
  source: 'senado' as const,
  resource: 'senadores-atuais',
  externalId: 'atual',
  url: LIST_URL,
  text: JSON.stringify(data),
  hash: 'hash',
  sourceHash: 'hash',
  redactedFields: [],
  fetchedAt: date,
})
const storage = () => ({
  saveRaw: vi.fn(async () => 'snapshot'),
  upsertRepresentative: vi.fn(async () => {}),
  startRun: vi.fn(async () => 'run'),
  updateRun: vi.fn(async (_id: string, _values: Record<string, unknown>) => {}),
})
describe('adapter Senado', () => {
  it('preserva identidade, participação, legislaturas e períodos oficiais', () => {
    const [titular, suplente] = normalizeSenators(fixture, date)
    expect(titular).toMatchObject({
      id: stableSenatorId('5672'),
      institution: 'senado',
      uf: 'AC',
      senateMandate: { externalId: '596', participation: { value: 'Titular' } },
    })
    expect(suplente).toMatchObject({
      id: stableSenatorId('6358'),
      senateMandate: {
        participation: { value: '1º Suplente' },
        exercises: [
          { externalId: '3111', start: '2026-10-06', end: null },
          { externalId: '3057', endReasonCode: 'LCS' },
          { externalId: '3038', endReasonCode: 'RET' },
        ],
      },
    })
    expect(suplente?.senateMandate?.legislatures.map((l) => l.number)).toEqual(['57', '58'])
    expect(titular?.provenance).toMatchObject({
      source: 'senado',
      resourceUrl: LIST_URL,
      fetchedAt: date,
      normalizerVersion: 'senado-senadores-1',
    })
    expect(titular?.photo.value).toBe(records[0]?.IdentificacaoParlamentar.UrlFotoParlamentar)
    expect(titular?.id).not.toBe(stablePersonId('5672'))
  })
  it('lê elementos únicos em objeto, campos ausentes e valores desconhecidos sem inventar', () => {
    const record = structuredClone(records[0])
    if (!record) throw new Error('FIXTURE_MISSING')
    const data = {
      ...record,
      IdentificacaoParlamentar: {
        ...record.IdentificacaoParlamentar,
        EmailParlamentar: 'invalid',
        UrlFotoParlamentar: 'https://evil.test/photo.jpg',
        Telefones: undefined,
        SiglaPartidoParlamentar: undefined,
      },
      Mandato: {
        ...record.Mandato,
        DescricaoParticipacao: 'Código futuro',
        Exercicios: { Exercicio: record.Mandato.Exercicios.Exercicio[0] },
      },
    }
    expect(normalizeSenators(payload(data), date)[0]).toMatchObject({
      email: { state: 'not_informed' },
      phone: { state: 'not_informed' },
      photo: { state: 'not_informed' },
      party: { state: 'not_informed' },
      senateMandate: { participation: { value: 'Código futuro' } },
    })
  })
  it('não une homônimos e rejeita duplicatas, versão inesperada ou URL alheia', () => {
    const rows = structuredClone(records)
    if (!rows[0] || !rows[1]) throw new Error('FIXTURE_MISSING')
    rows[1].IdentificacaoParlamentar.NomeParlamentar =
      rows[0].IdentificacaoParlamentar.NomeParlamentar
    expect(new Set(normalizeSenators(payload(rows), date).map((p) => p.id)).size).toBe(2)
    expect(() => normalizeSenators(payload([rows[0], rows[0]]), date)).toThrow(
      'SENADO_DUPLICATE_ID',
    )
    expect(() =>
      normalizeSenators(
        {
          ListaParlamentarEmExercicio: {
            ...fixture.ListaParlamentarEmExercicio,
            Metadados: { VersaoServico: '5' },
          },
        },
        date,
      ),
    ).toThrow()
    rows[0].IdentificacaoParlamentar.UrlPaginaParlamentar = 'https://evil.test/'
    expect(() => normalizeSenators(payload(rows), date)).toThrow('SENADO_INVALID_OFFICIAL_URL')
  })
  it('compartilha busca, paginação e perfil com representantes da Câmara', async () => {
    const senators = normalizeSenators(fixture, date)
    const repository = memoryRepresentatives(senators)
    const page = await repository.list({ name: 'ana', uf: 'MA', page: 1, pageSize: 1 })
    expect(page.total).toBe(1)
    expect(await repository.get(page.items[0]?.id ?? '')).toEqual(senators[1])
  })
  it('solicita JSON v4 sem paginação, preserva bytes/hash e limita retries', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response('', { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValue(
        new Response(JSON.stringify(fixture), { headers: { 'Content-Type': 'application/json' } }),
      )
    const result = await senadoClient(fetcher).list(new AbortController().signal)
    expect(fetcher).toHaveBeenCalledTimes(2)
    expect(fetcher).toHaveBeenLastCalledWith(
      LIST_URL,
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
    expect(result.text).toBe(JSON.stringify(fixture))
    expect(result.hash).toBe(result.sourceHash)
    expect(result.source).toBe('senado')
    const fail = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('', { status: 503, headers: { 'retry-after': '0' } }))
    await expect(senadoClient(fail).list(new AbortController().signal)).rejects.toThrow(
      'SENADO_HTTP_503',
    )
    expect(fail).toHaveBeenCalledTimes(3)
  })
  it('rejeita HTTP/XML inesperados e respeita cancelamento', async () => {
    const xml = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('<xml/>', { headers: { 'content-type': 'application/xml' } }))
    await expect(senadoClient(xml).list(new AbortController().signal)).rejects.toThrow(
      'SENADO_EXPECTED_JSON',
    )
    await expect(senadoClient(xml).list(AbortSignal.abort())).rejects.toThrow()
    expect(xml).toHaveBeenCalledTimes(1)
  })
})
describe('worker Senado', () => {
  it('persiste RAW antes de publicar, limita lote sem checkpoint completo nem remoção', async () => {
    const db = storage()
    const result = await syncSenado(
      db,
      { limit: 1, signal: new AbortController().signal },
      { list: vi.fn(async () => raw()) },
    )
    expect(result).toMatchObject({ processed: 1, available: 2, coverage: 'partial' })
    expect(db.startRun).toHaveBeenCalledWith('senadores-atuais', 'senado')
    expect(db.saveRaw.mock.invocationCallOrder[0]).toBeLessThan(
      db.upsertRepresentative.mock.invocationCallOrder[0] ?? 0,
    )
    expect(db.updateRun.mock.calls.some(([, value]) => 'checkpoint' in value)).toBe(false)
  })
  it('avança checkpoint somente após toda a lista persistida', async () => {
    const db = storage()
    const result = await syncSenado(
      db,
      { limit: 100, signal: new AbortController().signal },
      { list: vi.fn(async () => raw()) },
    )
    expect(result).toMatchObject({ processed: 2, coverage: 'observed-list' })
    expect(db.updateRun).toHaveBeenCalledWith('run', { checkpoint: 1 })
  })
  it('payload inválido mantém evidência e não sobrescreve nenhum registro válido', async () => {
    const db = storage()
    await expect(
      syncSenado(
        db,
        { limit: 100, signal: new AbortController().signal },
        { list: vi.fn(async () => raw(payload([records[0], {}]))) },
      ),
    ).rejects.toThrow()
    expect(db.saveRaw).toHaveBeenCalledTimes(1)
    expect(db.upsertRepresentative).not.toHaveBeenCalled()
    expect(db.updateRun).toHaveBeenCalledWith('run', expect.objectContaining({ status: 'failed' }))
  })
  it('falha de persistência não confirma checkpoint e cancelamento não consulta fonte', async () => {
    const db = storage()
    db.upsertRepresentative.mockRejectedValueOnce(new Error('DB_FAILED'))
    const list = vi.fn(async () => raw())
    await expect(
      syncSenado(db, { limit: 100, signal: new AbortController().signal }, { list }),
    ).rejects.toThrow('DB_FAILED')
    expect(db.updateRun.mock.calls.some(([, value]) => 'checkpoint' in value)).toBe(false)
    const cancelled = storage()
    list.mockClear()
    await expect(
      syncSenado(cancelled, { limit: 100, signal: AbortSignal.abort() }, { list }),
    ).rejects.toThrow()
    expect(list).not.toHaveBeenCalled()
    expect(cancelled.updateRun).toHaveBeenCalledWith(
      'run',
      expect.objectContaining({ status: 'cancelled' }),
    )
  })
})
