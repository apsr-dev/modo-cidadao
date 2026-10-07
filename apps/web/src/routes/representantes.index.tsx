import { filtersSchema, ufs } from '@civica/contracts'
import { Button } from '@civica/ui'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { PersonCard } from '../features/representatives'
import { EmptyState } from '../features/shell'
import { metadata } from '../lib/env'
import { representativesQuery } from '../lib/queries'
export const Route = createFileRoute('/representantes/')({
  validateSearch: filtersSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(representativesQuery(deps)),
  head: () =>
    metadata(
      'Representantes',
      'Explore representantes da Câmara por nome e UF, com fontes e contatos oficiais quando disponíveis.',
      '/representantes',
    ),
  component: Directory,
})
function Directory() {
  const filters = Route.useSearch()
  const { data } = useSuspenseQuery(representativesQuery(filters))
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">QUEM REPRESENTA VOCÊ</span>
        <h1>Representantes</h1>
        <p>Encontre pessoas, consulte fontes e conheça os contatos disponíveis.</p>
      </div>
      <div className="coverage-note">
        Catálogo local da Câmara · Situação conforme a última coleta. Uma busca vazia não comprova
        ausência na fonte. Senado ainda não integrado.
      </div>
      <form className="filter-form" method="get" action="/representantes">
        <label className="search-field">
          <span>Nome do representante</span>
          <div>
            <Search size={18} />
            <input
              name="name"
              defaultValue={filters.name}
              placeholder="Busque pelo nome"
              maxLength={100}
            />
          </div>
        </label>
        <label>
          <span>Unidade federativa</span>
          <select name="uf" defaultValue={filters.uf ?? ''}>
            <option value="">Todas as UFs</option>
            {ufs.map((uf) => (
              <option key={uf}>{uf}</option>
            ))}
          </select>
        </label>
        <Button type="submit">
          Buscar <Search size={16} />
        </Button>
      </form>
      <div className="results-heading">
        <p>
          <strong>{data.total}</strong>{' '}
          {data.total === 1 ? 'representante encontrado' : 'representantes encontrados'}
        </p>
        <span>Ordem alfabética</span>
      </div>
      {data.items.length ? (
        <div className="people-grid">
          {data.items.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <EmptyState title="Nenhum representante nesta busca">
          <p>Experimente outro nome ou UF. A cobertura local é limitada.</p>
          <Link to="/representantes" search={{ name: '', page: 1, pageSize: 6 }}>
            Limpar filtros
          </Link>
        </EmptyState>
      )}
      <nav className="pagination" aria-label="Paginação">
        {filters.page > 1 ? (
          <Link to="/representantes" search={{ ...filters, page: filters.page - 1 }}>
            ← Anterior
          </Link>
        ) : (
          <span />
        )}
        <span>
          Página {filters.page}
          {data.pages > 0 ? ` de ${data.pages}` : ''}
        </span>
        {filters.page < data.pages ? (
          <Link to="/representantes" search={{ ...filters, page: filters.page + 1 }}>
            Próxima →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  )
}
