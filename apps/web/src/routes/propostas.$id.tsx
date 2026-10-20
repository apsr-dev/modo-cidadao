import { proposalIdSchema } from '@civica/contracts'
import { authorRole, proposalLabel } from '@civica/domain'
import { Badge, Button } from '@civica/ui'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { sourceDateLabel } from '../features/proposals'
import { valueLabel } from '../features/representatives'
import { metadata } from '../lib/env'
import { proposalQuery } from '../lib/queries'
export const Route = createFileRoute('/propostas/$id')({
  loader: async ({ params, context }) => {
    if (!proposalIdSchema.safeParse(params.id).success) throw notFound()
    const p = await context.queryClient.ensureQueryData(proposalQuery(params.id))
    if (!p) throw notFound()
    return p
  },
  head: ({ loaderData: p }) =>
    metadata(
      p ? proposalLabel(p) : 'Proposta',
      p?.title || 'Ementa e tramitação oficial.',
      `/propostas/${p?.id ?? ''}`,
    ),
  component: Detail,
})
function Detail() {
  const p = Route.useLoaderData()
  return (
    <>
      <Link className="back-link" to="/propostas" search={{ page: 1, pageSize: 6 }}>
        <ArrowLeft size={16} />
        Todas as propostas
      </Link>
      <div className="page-heading">
        <Badge>{p.demo ? 'Demonstração · Proposta fictícia' : 'Câmara dos Deputados'}</Badge>
        <h1>{proposalLabel(p)}</h1>
        <p>{valueLabel(p.descriptionType)}</p>
      </div>
      {p.demo && (
        <div className="coverage-note">
          Proposta, personagens e tramitações fictícios. Não correspondem a registros legislativos
          reais.
        </div>
      )}
      <section className="panel proposal-text">
        <h2>Ementa {p.demo ? 'fictícia' : 'oficial'}</h2>
        <p>{p.title || 'Não informada pela fonte.'}</p>
        <dl>
          <dt>Apresentação</dt>
          <dd>
            {p.presentedAt.value ? sourceDateLabel(p.presentedAt.value) : valueLabel(p.presentedAt)}
          </dd>
          <dt>Situação informada na coleta</dt>
          <dd>{valueLabel(p.situation)}</dd>
          <dt>Órgão informado</dt>
          <dd>{valueLabel(p.organ)}</dd>
        </dl>
        <div className="proposal-actions">
          {p.fullTextUrl && (
            <Button asChild>
              <a href={p.fullTextUrl} target="_blank" rel="noreferrer">
                Abrir texto oficial <ArrowUpRight size={16} />
              </a>
            </Button>
          )}
          {p.provenance.officialUrl && (
            <Button asChild variant="outline">
              <a href={p.provenance.officialUrl} target="_blank" rel="noreferrer">
                Ficha oficial <ArrowUpRight size={16} />
              </a>
            </Button>
          )}
        </div>
        {!p.fullTextUrl && (
          <p className="muted">
            Link do inteiro teor{' '}
            {p.demo ? 'não se aplica à demonstração' : 'não informado pela fonte'}.
          </p>
        )}
        <p className="muted">
          O tipo do documento e a situação oficial dão contexto. Aprovação de uma etapa não
          significa transformação em lei.
        </p>
      </section>
      <section className="panel">
        <h2>Autoria e coautoria</h2>
        <p className="muted">
          A Câmara considera autores tanto os proponentes quanto os apoiadores. O papel abaixo
          preserva o campo “proponente” da fonte; ordem de assinatura não define autoria principal.
        </p>
        {p.authors.length ? (
          <ul className="proposal-authors">
            {p.authors.map((a) => (
              <li key={a.id}>
                {a.personId ? (
                  <Link to="/representantes/$id" params={{ id: a.personId }}>
                    {a.name}
                  </Link>
                ) : a.sourceUrl ? (
                  <a href={a.sourceUrl} target="_blank" rel="noreferrer">
                    {a.name} <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <strong>{a.name}</strong>
                )}
                <span>
                  {authorRole(a)} · {valueLabel(a.type)}
                  {a.signatureOrder !== null ? ` · Assinatura ${a.signatureOrder}` : ''}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Não há autores informados no recurso coletado.</p>
        )}
      </section>
      <section className="panel">
        <h2>Tramitação</h2>
        <p className="muted">
          Eventos em ordem cronológica. Horários são preservados como informados pela fonte; quando
          não há fuso, ele não é inferido.
        </p>
        {p.events.length ? (
          <ol className="proposal-timeline">
            {p.events.map((event) => (
              <li key={event.sequence}>
                <span className="small-label">
                  {sourceDateLabel(event.occurredAt)} · Sequência {event.sequence}
                </span>
                <h3>{valueLabel(event.description)}</h3>
                <p>
                  {valueLabel(event.organ)} · {valueLabel(event.situation)}
                </p>
                {event.dispatch.value && (
                  <details>
                    <summary>Despacho da fonte</summary>
                    <p>{event.dispatch.value}</p>
                  </details>
                )}
                {event.documentUrl && (
                  <a href={event.documentUrl} target="_blank" rel="noreferrer">
                    Documento desta tramitação <ArrowUpRight size={14} />
                  </a>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p>
            Nenhuma tramitação informada no recurso coletado. Isso não comprova conclusão da
            proposta.
          </p>
        )}
      </section>
      <section className="provenance">
        <h2>Origem e cobertura</h2>
        <p>
          {p.demo
            ? 'Dados fictícios para demonstração.'
            : 'Fonte: Dados Abertos da Câmara dos Deputados.'}
        </p>
        <p>
          Identificador: {p.provenance.source}/{p.provenance.externalId}
        </p>
        <p>
          Detalhe coletado: {p.provenance.fetchedAt} · Autores: {p.authorsCollectedAt} ·
          Tramitações: {p.eventsCollectedAt}
        </p>
        {p.provenance.resourceUrl && (
          <a href={p.provenance.resourceUrl} target="_blank" rel="noreferrer">
            Consultar registro da fonte <ArrowUpRight size={14} />
          </a>
        )}
        <p>
          Coleta não é data de atualização legislativa. A consulta reflete os recursos disponíveis
          na fonte naquele momento. Votações, relatorias e resumos ainda não estão integrados.
        </p>
      </section>
    </>
  )
}
