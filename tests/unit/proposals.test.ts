import { proposalFiltersSchema } from '@civica/contracts'
import { authorRole, createDemoProposals, memoryProposals } from '@civica/domain'
import {
  camaraClient,
  minimizeRaw,
  normalizeProposal,
  type RawResponse,
  stablePersonId,
  stableProposalId,
} from '@civica/source-camara'
import { describe, expect, it, vi } from 'vitest'
import { syncProposals } from '../../apps/worker/src/proposals'
import { syncCamara } from '../../apps/worker/src/sync'
import detail from '../fixtures/camara-proposal-2642134.json'
import authors from '../fixtures/camara-proposal-2642134-authors.json'
import events from '../fixtures/camara-proposal-2642134-events.json'
import proposalList from '../fixtures/camara-proposals-list.json'

const at = '2026-10-07T15:20:00.000Z'
function raw(payload: unknown, resource: RawResponse['resource']): RawResponse {
  return {
    resource,
    externalId: '2642134',
    url: 'https://dadosabertos.camara.leg.br/api/v2/proposicoes/2642134',
    fetchedAt: at,
    ...minimizeRaw(JSON.stringify(payload), resource),
  }
}
const proposalFixture = () =>
  normalizeProposal(
    raw(detail, 'proposicao'),
    raw(authors, 'proposicao-autores'),
    raw(events, 'proposicao-tramitacoes'),
  )
describe('propostas: contratos e normalização', () => {
  it('rejeita data inexistente e ordena offsets explícitos sem alterar a representação original', () => {
    const base = events.dados[0]
    if (!base) throw new Error('MISSING_EVENT')
    const dated = {
      ...events,
      dados: [
        { ...base, sequencia: 1, dataHora: '2026-08-06T14:00-03:00' },
        { ...base, sequencia: 2, dataHora: '2026-08-06T15:00+02:00' },
      ],
    }
    const normalized = normalizeProposal(
      raw(detail, 'proposicao'),
      raw(authors, 'proposicao-autores'),
      raw(dated, 'proposicao-tramitacoes'),
    )
    expect(normalized.proposal.events.map((e) => e.sequence)).toEqual([2, 1])
    expect(normalized.proposal.events[0]?.occurredAt).toBe('2026-08-06T15:00+02:00')
    expect(() =>
      normalizeProposal(
        raw(detail, 'proposicao'),
        raw(authors, 'proposicao-autores'),
        raw(
          { ...events, dados: [{ ...base, dataHora: '2026-02-31T13:17' }] },
          'proposicao-tramitacoes',
        ),
      ),
    ).toThrow()
  })
  it('normaliza filtros vazios e tipo, rejeita números, ano e identidade inválidos', () => {
    expect(proposalFiltersSchema.parse({ type: ' pl ', number: '4916', year: '2026' })).toEqual({
      type: 'PL',
      number: 4916,
      year: 2026,
      page: 1,
      pageSize: 6,
    })
    expect(proposalFiltersSchema.parse({ type: '', number: '', year: '' })).toEqual({
      page: 1,
      pageSize: 6,
    })
    for (const input of [
      { number: 0 },
      { number: 1.5 },
      { year: 1800 },
      { type: '<script>' },
      { authorId: '204379' },
      { pageSize: 51 },
    ])
      expect(proposalFiltersSchema.safeParse(input).success).toBe(false)
  })
  it('preserva ementa, horário sem fuso, documento e proponente sem inferência por nome', () => {
    const { proposal: p } = proposalFixture()
    expect(p.id).toBe(stableProposalId('2642134'))
    expect(p.id).not.toBe(stablePersonId('2642134'))
    expect(p.presentedAt.value).toBe('2026-08-06T13:17')
    expect(p.events[0]?.occurredAt).toBe('2026-08-06T13:17')
    expect(p.authors[0]?.deputyExternalId).toBe('204379')
    expect(p.authors[0]?.personId).toBeNull()
    expect(p.authors[0]?.proponent).toBe(true)
    expect(p.fullTextUrl).toContain('codteor=3169038')
    expect(p.title).toBe(detail.dados.ementa)
    expect(authorRole({ proponent: false })).toContain('Coautor')
    expect(authorRole({ proponent: null })).toContain('não informado')
  })
  it('rejeita recurso incompleto ou identidade divergente e bloqueia links não oficiais', () => {
    expect(() =>
      normalizeProposal(
        raw(detail, 'proposicao'),
        raw(
          {
            ...authors,
            links: [
              {
                rel: 'next',
                href: 'https://dadosabertos.camara.leg.br/api/v2/proposicoes/2642134/autores?pagina=2',
              },
            ],
          },
          'proposicao-autores',
        ),
        raw(events, 'proposicao-tramitacoes'),
      ),
    ).toThrow('INCOMPLETE_PROPOSAL_RESOURCE')
    expect(() =>
      normalizeProposal(
        { ...raw(detail, 'proposicao'), externalId: '1' },
        raw(authors, 'proposicao-autores'),
        raw(events, 'proposicao-tramitacoes'),
      ),
    ).toThrow('SOURCE_ID_MISMATCH')
    const bad = { dados: { ...detail.dados, urlInteiroTeor: 'javascript:alert(1)' } }
    expect(
      normalizeProposal(
        raw(bad, 'proposicao'),
        raw(authors, 'proposicao-autores'),
        raw(events, 'proposicao-tramitacoes'),
      ).proposal.fullTextUrl,
    ).toBeNull()
  })
  it('mantém a revisão estável na recoleta e a altera ao retificar um evento', () => {
    const first = proposalFixture()
    expect(
      normalizeProposal(
        { ...raw(detail, 'proposicao'), fetchedAt: '2026-10-08T00:00:00Z' },
        raw(authors, 'proposicao-autores'),
        raw(events, 'proposicao-tramitacoes'),
      ).revisionHash,
    ).toBe(first.revisionHash)
    const corrected = {
      ...events,
      dados: events.dados.map((e) => ({ ...e, despacho: 'Retificação de fixture para teste' })),
    }
    expect(
      normalizeProposal(
        raw(detail, 'proposicao'),
        raw(authors, 'proposicao-autores'),
        raw(corrected, 'proposicao-tramitacoes'),
      ).revisionHash,
    ).not.toBe(first.revisionHash)
  })
  it('busca, pagina e relaciona apenas propostas fictícias à demo', async () => {
    const repo = memoryProposals()
    const rows = createDemoProposals()
    const first = await repo.list({ page: 1, pageSize: 6 })
    const second = await repo.list({ page: 2, pageSize: 6 })
    expect(new Set([...first.items, ...second.items].map((p) => p.id)).size).toBe(8)
    expect(
      (await repo.list({ number: 1, year: 2026, type: 'PL', page: 1, pageSize: 6 })).total,
    ).toBe(1)
    const id = rows[0]?.authors[0]?.personId ?? ''
    expect((await repo.list({ authorId: id, page: 1, pageSize: 6 })).total).toBe(3)
    expect(
      rows.every((p) => p.demo && p.fullTextUrl === null && p.provenance.officialUrl === null),
    ).toBe(true)
  })
  it('monta consulta limitada por ano/tipo/autor sem intervalo anual rejeitado pela API', async () => {
    const fetcher = vi.fn(
      async (_url: string, _init: RequestInit) => new Response('{"dados":[],"links":[]}'),
    )
    await camaraClient(fetcher).proposals(
      2,
      3,
      { year: 2026, type: 'PL', deputy: 204379 },
      new AbortController().signal,
    )
    const url = new URL(fetcher.mock.calls[0]?.[0] ?? '')
    expect(url.searchParams.get('idDeputadoAutor')).toBe('204379')
    expect(url.searchParams.get('pagina')).toBe('2')
    expect(url.searchParams.has('dataInicio')).toBe(false)
  })
})
describe('worker de propostas e lotes', () => {
  it('persiste três evidências antes da proposta e não avança checkpoint parcial', async () => {
    const order: string[] = []
    const storage = {
      saveRaw: vi.fn(async (r: { resource: string }) => {
        order.push(r.resource)
        return 'snapshot'
      }),
      upsertProposal: vi.fn(async () => {
        order.push('normalized')
      }),
      startRun: vi.fn(async () => 'run'),
      updateRun: vi.fn(async (_id: string, _value: Record<string, unknown>) => {}),
    }
    const source = {
      proposals: vi.fn(async () => raw(proposalList, 'proposicoes-lista')),
      proposal: vi.fn(async () => raw(detail, 'proposicao')),
      authors: vi.fn(async () => raw(authors, 'proposicao-autores')),
      events: vi.fn(async () => raw(events, 'proposicao-tramitacoes')),
    }
    expect(
      (
        await syncProposals(
          storage,
          { year: 2026, maxPages: 1, pageSize: 2, limit: 1, signal: new AbortController().signal },
          source,
        )
      ).processed,
    ).toBe(1)
    expect(order).toEqual([
      'proposicoes-lista',
      'proposicao',
      'proposicao-autores',
      'proposicao-tramitacoes',
      'normalized',
    ])
    expect(storage.updateRun.mock.calls.some((call) => 'checkpoint' in (call[1] ?? {}))).toBe(false)
  })
  it('falha em recurso inválido sem substituir o catálogo e marca cancelamento', async () => {
    const storage = {
      saveRaw: vi.fn(async () => 'snapshot'),
      upsertProposal: vi.fn(),
      startRun: vi.fn(async () => 'run'),
      updateRun: vi.fn(async (_id: string, _value: Record<string, unknown>) => {}),
    }
    const source = {
      proposals: vi.fn(async () => raw({ dados: [{ id: 2642134 }] }, 'proposicoes-lista')),
      proposal: vi.fn(async () => raw(detail, 'proposicao')),
      authors: vi.fn(async () => raw({ dados: 'invalid' }, 'proposicao-autores')),
      events: vi.fn(async () => raw(events, 'proposicao-tramitacoes')),
    }
    await expect(
      syncProposals(
        storage,
        { year: 2026, maxPages: 1, pageSize: 1, limit: 1, signal: new AbortController().signal },
        source,
      ),
    ).rejects.toThrow()
    expect(storage.upsertProposal).not.toHaveBeenCalled()
    expect(storage.updateRun).toHaveBeenCalledWith(
      'run',
      expect.objectContaining({ status: 'failed' }),
    )
    await expect(
      syncProposals(
        storage,
        { year: 2026, maxPages: 1, pageSize: 1, limit: 1, signal: AbortSignal.abort() },
        source,
      ),
    ).rejects.toThrow()
    expect(storage.updateRun).toHaveBeenCalledWith(
      'run',
      expect.objectContaining({ status: 'cancelled' }),
    )
  })
  it('inicia o lote de deputados na página solicitada', async () => {
    const source = {
      list: vi.fn(async () => raw({ dados: [], links: [] }, 'deputados-lista')),
      detail: vi.fn(),
    }
    const storage = {
      saveRaw: vi.fn(),
      upsertRepresentative: vi.fn(),
      startRun: vi.fn(async () => 'run'),
      updateRun: vi.fn(async (_id: string, _value: Record<string, unknown>) => {}),
    }
    await syncCamara(
      storage,
      { startPage: 6, maxPages: 5, pageSize: 20, limit: 100, signal: new AbortController().signal },
      source,
    )
    expect(source.list).toHaveBeenCalledWith(6, 20, expect.any(AbortSignal))
  })
})
