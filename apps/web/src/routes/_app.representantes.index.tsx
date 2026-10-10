import { filtersSchema, ufs } from '@civica/contracts'
import {
  Button,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  NativeSelect,
  NativeSelectOption,
} from '@civica/ui'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { PersonCard } from '../features/representatives'
import { EmptyState } from '../features/shell'
import { metadata } from '../lib/env'
import { representativesQuery } from '../lib/queries'
export const Route = createFileRoute('/_app/representantes/')({
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
        Câmara dos Deputados · Amostra local limitada. Senado ainda não integrado. A lista não
        representa a bancada completa.
      </div>
      <section className="directory-workspace" aria-label="Busca e resultados">
        <form className="filter-form" method="get" action="/representantes">
          <input type="hidden" name="pageSize" value={filters.pageSize} />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="representative-name">Nome do representante</FieldLabel>
              <Input
                id="representative-name"
                name="name"
                defaultValue={filters.name}
                placeholder="Busque pelo nome"
                maxLength={100}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="representative-uf">Unidade federativa</FieldLabel>
              <NativeSelect id="representative-uf" name="uf" defaultValue={filters.uf ?? ''}>
                <NativeSelectOption value="">Todas as UFs</NativeSelectOption>
                {ufs.map((uf) => (
                  <NativeSelectOption key={uf}>{uf}</NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          </FieldGroup>
          <Button type="submit">
            Buscar <Search data-icon="inline-end" />
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
            <Link to="/representantes" search={{ name: '', page: 1, pageSize: 24 }}>
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
      </section>
    </>
  )
}
