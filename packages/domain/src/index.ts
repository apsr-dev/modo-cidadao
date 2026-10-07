export type DataValue =
  | { state: 'available'; value: string }
  | { state: 'not_informed' | 'not_collected' | 'not_applicable'; value: null }

export interface Provenance {
  source: 'camara' | 'demo'
  externalId: string
  officialUrl: string | null
  resourceUrl: string | null
  fetchedAt: string
  normalizerVersion: string
}
export interface Representative {
  id: string
  name: string
  civilName: DataValue
  uf: string
  legislature: string
  institution: 'camara'
  party: DataValue
  status: DataValue
  email: DataValue
  phone: DataValue
  demo: boolean
  provenance: Provenance
}
export interface RepresentativeFilters {
  name: string
  uf?: string
  page: number
  pageSize: number
}
export interface Page<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pages: number
}
export interface RepresentativesRepository {
  list(filters: RepresentativeFilters): Promise<Page<Representative>>
  get(id: string): Promise<Representative | null>
}
export class DomainError extends Error {
  constructor(public readonly code: 'NOT_FOUND' | 'UNAUTHORIZED' | 'UNAVAILABLE' | 'FORBIDDEN') {
    super(code)
  }
}
export function representatives(repository: RepresentativesRepository) {
  return {
    list: (filters: RepresentativeFilters) => repository.list(filters),
    async get(id: string) {
      const person = await repository.get(id)
      if (!person) throw new DomainError('NOT_FOUND')
      return person
    },
  }
}
export interface FollowsRepository {
  list(): Promise<string[]>
  add(personId: string): Promise<void>
  remove(personId: string): Promise<void>
}
export function following(
  userId: string | null,
  repo: FollowsRepository,
  people: RepresentativesRepository,
) {
  const authorize = () => {
    if (!userId) throw new DomainError('UNAUTHORIZED')
  }
  return {
    async list() {
      authorize()
      return repo.list()
    },
    async follow(personId: string) {
      authorize()
      if (!(await people.get(personId))) throw new DomainError('NOT_FOUND')
      await repo.add(personId)
    },
    async unfollow(personId: string) {
      authorize()
      await repo.remove(personId)
    },
  }
}
export const notCollected = (): DataValue => ({ state: 'not_collected', value: null })
export function reported(value: string | null | undefined): DataValue {
  return value?.trim()
    ? { state: 'available', value: value.trim() }
    : { state: 'not_informed', value: null }
}
export function fold(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR')
}
export const demoPeople: Representative[] = [
  ['Aurora das Pontes', 'SP'],
  ['Bento do Horizonte', 'RJ'],
  ['Clara das Veredas', 'MG'],
  ['Davi do Ipê', 'BA'],
  ['Elisa do Amanhã', 'PE'],
  ['Francisco das Águas', 'RS'],
  ['Helena dos Ventos', 'SP'],
  ['Ivo da Semente', 'AM'],
  ['Lia da Travessia', 'PR'],
  ['Nilo das Nuvens', 'CE'],
  ['Olívia dos Caminhos', 'SC'],
  ['Tomás do Sol', 'DF'],
].map(([name, uf], index) => ({
  id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  name: name ?? '',
  civilName: notCollected(),
  uf: uf ?? '',
  legislature: 'demo',
  institution: 'camara',
  party: reported('Partido fictício'),
  status: reported('Personagem fictício'),
  email: { state: 'not_applicable', value: null },
  phone: { state: 'not_applicable', value: null },
  demo: true,
  provenance: {
    source: 'demo',
    externalId: `demo-${index + 1}`,
    officialUrl: null,
    resourceUrl: null,
    fetchedAt: '2026-10-07T00:00:00.000Z',
    normalizerVersion: 'demo-1',
  },
}))
export function memoryRepresentatives(
  rows: Representative[] = demoPeople,
): RepresentativesRepository {
  return {
    async get(id) {
      return rows.find((p) => p.id === id) ?? null
    },
    async list(filters) {
      const filtered = rows
        .filter(
          (p) =>
            (!filters.uf || p.uf === filters.uf) &&
            (fold(p.name).includes(fold(filters.name)) ||
              fold(p.civilName.value ?? '').includes(fold(filters.name))),
        )
        .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR') || a.id.localeCompare(b.id))
      return {
        items: filtered.slice(
          (filters.page - 1) * filters.pageSize,
          filters.page * filters.pageSize,
        ),
        total: filtered.length,
        page: filters.page,
        pageSize: filters.pageSize,
        pages: Math.ceil(filtered.length / filters.pageSize),
      }
    },
  }
}
