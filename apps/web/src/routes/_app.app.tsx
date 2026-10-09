import { ufs } from '@civica/contracts'
import {
  Button,
  Field,
  FieldGroup,
  FieldLabel,
  NativeSelect,
  NativeSelectOption,
  Separator,
} from '@civica/ui'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight, Landmark } from 'lucide-react'
import { PersonCard } from '../features/representatives'
import { EmptyState } from '../features/shell'
import { metadata } from '../lib/env'
import { representativesQuery } from '../lib/queries'

const query = representativesQuery({ name: '', page: 1, pageSize: 6 })
export const Route = createFileRoute('/_app/app')({
  loader: ({ context }) => context.queryClient.ensureQueryData(query),
  head: () =>
    metadata(
      'Explorar',
      'Consulte representantes e encontre canais oficiais de participação.',
      '/app',
    ),
  component: Explore,
})
function Explore() {
  const { data } = useSuspenseQuery(query)
  const demo = data.items.some((person) => person.demo)
  return (
    <>
      <div className="workspace-heading">
        <div>
          <span className="section-label">SEU ESPAÇO DE CONSULTA</span>
          <h1>Explorar</h1>
          <p>Representantes e participação, em um só lugar.</p>
        </div>
        <span className="workspace-scope">
          <Landmark size={16} aria-hidden="true" />
          Âmbito federal
        </span>
      </div>
      <div className="explore-layout">
        <section className="explore-main" aria-labelledby="explore-people">
          <div className="section-heading">
            <div>
              <h2 id="explore-people">Quem representa você</h2>
              <p>Consulte os representantes da sua UF.</p>
            </div>
            <Link
              to="/representantes"
              search={{ name: '', page: 1, pageSize: 6 }}
              className="text-link"
            >
              Ver todos <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <form className="uf-discovery" action="/representantes" method="get">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="explore-uf">Seu estado</FieldLabel>
                <NativeSelect id="explore-uf" name="uf" defaultValue="">
                  <NativeSelectOption value="">Selecione uma UF</NativeSelectOption>
                  {ufs.map((uf) => (
                    <NativeSelectOption key={uf}>{uf}</NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            </FieldGroup>
            <Button type="submit">
              Encontrar representantes <ArrowRight data-icon="inline-end" />
            </Button>
          </form>
          <div className="list-caption">
            <span>Câmara dos Deputados</span>
            <span>Ordem alfabética · {data.total} no catálogo</span>
          </div>
          <div className="people-grid">
            {data.items.length ? (
              data.items.slice(0, 4).map((person) => <PersonCard key={person.id} person={person} />)
            ) : (
              <EmptyState title="Catálogo ainda vazio">
                <p>
                  Nenhum representante disponível neste ambiente. Consulte a cobertura e tente
                  novamente após a importação.
                </p>
              </EmptyState>
            )}
          </div>
          <p className="catalog-disclaimer">
            {demo
              ? 'Personagens fictícios para explorar a interface.'
              : 'Esta seleção mostra os primeiros registros do catálogo local, em ordem alfabética.'}{' '}
            Senado e outras esferas ainda não integrados.
          </p>
        </section>
        <aside className="explore-context" aria-label="Participação e cobertura">
          <span className="section-label">PARTICIPE</span>
          <h2>Canais de participação</h2>
          <p>Abra consultas, ideias legislativas e debates nos portais da Câmara e do Senado.</p>
          <Button asChild variant="outline">
            <Link to="/participe">
              Ver canais oficiais <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
          <Separator />
          <h3>O que você encontra aqui</h3>
          <dl className="coverage-list">
            <div>
              <dt>Representantes</dt>
              <dd>Catálogo da Câmara</dd>
            </div>
            <div>
              <dt>Participação</dt>
              <dd>Canais institucionais</dd>
            </div>
            <div>
              <dt>Propostas e votações</dt>
              <dd>Integração pendente</dd>
            </div>
            <div>
              <dt>Senado e eleições</dt>
              <dd>Integração pendente</dd>
            </div>
          </dl>
          <p className="context-footnote">
            Cada perfil indica fonte, data de coleta e informações disponíveis. Sem notas ou
            rankings políticos.
          </p>
        </aside>
      </div>
    </>
  )
}
