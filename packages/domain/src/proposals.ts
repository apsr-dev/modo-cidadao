import {
  type DataValue,
  DomainError,
  demoPeople,
  type Page,
  type Provenance,
  reported,
} from './index'

export interface ProposalAuthor {
  id: string
  name: string
  type: DataValue
  sourceUrl: string | null
  deputyExternalId: string | null
  personId: string | null
  signatureOrder: number | null
  proponent: boolean | null
}
export interface ProposalEvent {
  sequence: number
  occurredAt: string
  organ: DataValue
  description: DataValue
  situation: DataValue
  dispatch: DataValue
  documentUrl: string | null
}
export interface ProposalSummary {
  id: string
  type: string
  number: number
  year: number
  title: string
  descriptionType: DataValue
  presentedAt: DataValue
  situation: DataValue
  organ: DataValue
  fullTextUrl: string | null
  authors: ProposalAuthor[]
  demo: boolean
  provenance: Provenance
}
export interface Proposal extends ProposalSummary {
  events: ProposalEvent[]
  authorsCollectedAt: string
  eventsCollectedAt: string
}
export interface ProposalFilters {
  type?: string
  number?: number
  year?: number
  authorId?: string
  page: number
  pageSize: number
}
export interface ProposalsRepository {
  list(filters: ProposalFilters): Promise<Page<ProposalSummary>>
  get(id: string): Promise<Proposal | null>
}
export const proposals = (repository: ProposalsRepository) => ({
  list: (filters: ProposalFilters) => repository.list(filters),
  async get(id: string) {
    const p = await repository.get(id)
    if (!p) throw new DomainError('NOT_FOUND')
    return p
  },
})
export const proposalLabel = (p: Pick<ProposalSummary, 'type' | 'number' | 'year'>) =>
  `${p.type} ${p.number}/${p.year}`
export function authorRole(author: Pick<ProposalAuthor, 'proponent'>) {
  return author.proponent === true
    ? 'Autor(a) proponente'
    : author.proponent === false
      ? 'Coautor(a) / signatário(a) de apoio'
      : 'Autoria — papel não informado'
}
const demoDate = '2026-10-07T00:00:00.000Z'
export const createDemoProposals = (): Proposal[] =>
  Array.from({ length: 8 }, (_, index) => {
    const author = demoPeople[index % 3]
    if (!author) throw new Error('DEMO_AUTHOR_MISSING')
    return {
      id: `00000000-0000-4000-9000-${String(index + 1).padStart(12, '0')}`,
      type: 'PL',
      number: index + 1,
      year: 2026,
      title: `Proposta fictícia ${index + 1}: espaços comunitários de leitura e convivência.`,
      descriptionType: reported('Projeto fictício para demonstração'),
      presentedAt: reported('2026-10-01T10:00'),
      situation: reported('Situação fictícia: em análise'),
      organ: reported('Órgão fictício'),
      fullTextUrl: null,
      demo: true,
      authors: [
        {
          id: `demo-author-${index}`,
          name: author.name,
          type: reported('Personagem fictício'),
          sourceUrl: null,
          deputyExternalId: null,
          personId: author.id,
          signatureOrder: 1,
          proponent: true,
        },
      ],
      events: [
        {
          sequence: 1,
          occurredAt: '2026-10-01T10:00',
          organ: reported('Órgão fictício'),
          description: reported('Apresentação fictícia'),
          situation: reported('Em análise fictícia'),
          dispatch: reported('Evento inventado exclusivamente para demonstrar a interface.'),
          documentUrl: null,
        },
      ],
      authorsCollectedAt: demoDate,
      eventsCollectedAt: demoDate,
      provenance: {
        source: 'demo',
        externalId: `demo-proposal-${index + 1}`,
        officialUrl: null,
        resourceUrl: null,
        fetchedAt: demoDate,
        normalizerVersion: 'demo-proposals-1',
      },
    }
  })
export function memoryProposals(rows: Proposal[] = createDemoProposals()): ProposalsRepository {
  return {
    async get(id) {
      return rows.find((p) => p.id === id) ?? null
    },
    async list(filters) {
      const filtered = rows
        .filter(
          (p) =>
            (!filters.type || p.type === filters.type) &&
            (!filters.number || p.number === filters.number) &&
            (!filters.year || p.year === filters.year) &&
            (!filters.authorId || p.authors.some((a) => a.personId === filters.authorId)),
        )
        .sort((a, b) => b.year - a.year || b.number - a.number || a.id.localeCompare(b.id))
      return {
        items: filtered
          .slice((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize)
          .map(
            ({
              events: _events,
              authorsCollectedAt: _authorsAt,
              eventsCollectedAt: _eventsAt,
              ...summary
            }) => summary,
          ),
        total: filtered.length,
        page: filters.page,
        pageSize: filters.pageSize,
        pages: Math.ceil(filtered.length / filters.pageSize),
      }
    },
  }
}
