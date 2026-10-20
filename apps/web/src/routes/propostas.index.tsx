import { proposalFiltersSchema } from '@civica/contracts'
import { Button } from '@civica/ui'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { ProposalCard } from '../features/proposals'
import { EmptyState } from '../features/shell'
import { metadata } from '../lib/env'
import { proposalsQuery } from '../lib/queries'
export const Route = createFileRoute('/propostas/')({
  validateSearch: proposalFiltersSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(proposalsQuery(deps)),
  head: () =>
    metadata(
      'Propostas',
      'Ementas, autoria e histórico de tramitação da Câmara, com fontes oficiais.',
      '/propostas',
    ),
  component: Directory,
})
function Directory() {
  const filters = Route.useSearch()
  const { data } = useSuspenseQuery(proposalsQuery(filters))
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">ENTENDA O QUE ESTÁ EM DISCUSSÃO</span>
        <h1>Propostas</h1>
        <p>Consulte o texto apresentado, a autoria e o caminho percorrido na Câmara.</p>
      </div>
      <div className="coverage-note">
        Catálogo local da Câmara · Apenas propostas importadas. Uma busca vazia não comprova
        ausência na fonte. Senado ainda não integrado.
      </div>
      {filters.authorId && (
        <p className="muted">
          Filtro de autoria ativo. Mostra proponentes e signatários de apoio, conforme a fonte.
        </p>
      )}
      <form className="filter-form proposal-filters" method="get" action="/propostas">
        {filters.authorId && <input type="hidden" name="authorId" value={filters.authorId} />}
        <label>
          <span>Tipo da proposta</span>
          <input
            name="type"
            defaultValue={filters.type ?? ''}
            placeholder="PL, PEC, REQ…"
            maxLength={10}
          />
        </label>
        <label>
          <span>Número</span>
          <input
            name="number"
            type="number"
            min={1}
            max={1000000}
            defaultValue={filters.number ?? ''}
            placeholder="4916"
          />
        </label>
        <label>
          <span>Ano</span>
          <input
            name="year"
            type="number"
            min={1900}
            max={2100}
            defaultValue={filters.year ?? ''}
            placeholder="2026"
          />
        </label>
        <Button type="submit">
          Buscar <Search size={16} />
        </Button>
      </form>
      <div className="results-heading">
        <p>
          <strong>{data.total}</strong>{' '}
          {data.total === 1 ? 'proposta encontrada' : 'propostas encontradas'}
        </p>
        <span>Ano e número decrescentes</span>
      </div>
      {data.items.length ? (
        <div className="proposal-grid">
          {data.items.map((p) => (
            <ProposalCard key={p.id} proposal={p} personId={filters.authorId} />
          ))}
        </div>
      ) : (
        <EmptyState title="Nenhuma proposta importada nesta busca">
          <p>
            Experimente outro identificador. A cobertura é parcial e a lista contém apenas os
            registros coletados.
          </p>
          <Link to="/propostas" search={{ page: 1, pageSize: 6 }}>
            Limpar filtros
          </Link>
        </EmptyState>
      )}
      <nav className="pagination" aria-label="Paginação de propostas">
        {filters.page > 1 ? (
          <Link to="/propostas" search={{ ...filters, page: filters.page - 1 }}>
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
          <Link to="/propostas" search={{ ...filters, page: filters.page + 1 }}>
            Próxima →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  )
}
