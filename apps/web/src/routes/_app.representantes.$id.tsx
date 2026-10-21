import { personIdSchema } from '@civica/contracts'
import { Badge, Button } from '@civica/ui'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight, Mail, Phone } from 'lucide-react'
import { FollowButton } from '../features/follow'
import { ProposalCard } from '../features/proposals'
import { RepresentativePhoto } from '../features/representative-photo'
import { valueLabel } from '../features/representatives'
import { representationLabels } from '../lib/catalog-labels'
import { metadata } from '../lib/env'
import { proposalsQuery, representativeQuery } from '../lib/queries'
export const Route = createFileRoute('/_app/representantes/$id')({
  loader: async ({ params, context }) => {
    if (!personIdSchema.safeParse(params.id).success) throw notFound()
    const person = await context.queryClient.ensureQueryData(representativeQuery(params.id))
    if (!person) throw notFound()
    const proposals = await context.queryClient.ensureQueryData(
      proposalsQuery({ authorId: person.id, page: 1, pageSize: 3 }),
    )
    return { person, proposals }
  },
  head: ({ loaderData }) =>
    metadata(
      loaderData?.person.name ?? 'Representante',
      'Perfil, origem dos dados e canais oficiais disponíveis.',
      `/representantes/${loaderData?.person.id ?? ''}`,
    ),
  component: Profile,
})
function Profile() {
  const { person: p, proposals } = Route.useLoaderData()
  const institution = representationLabels(p).name
  return (
    <>
      <Link className="back-link" to="/representantes" search={{ name: '', page: 1, pageSize: 24 }}>
        <ArrowLeft size={16} />
        Todos os representantes
      </Link>
      <section className="profile-header">
        <RepresentativePhoto person={p} large />
        <div>
          <Badge>
            {p.demo ? 'Demonstração · Personagem fictício' : representationLabels(p).office}
          </Badge>
          <h1>{p.name}</h1>
          <p>
            UF de representação: {p.uf} · {valueLabel(p.party)}
          </p>
          <p className="muted">Situação informada: {valueLabel(p.status)}</p>
        </div>
      </section>
      <div className="profile-grid">
        <section className="panel">
          <h2>Informações de representação</h2>
          <dl>
            <dt>Nome civil</dt>
            <dd>{valueLabel(p.civilName)}</dd>
            <dt>Cargo</dt>
            <dd>
              {representationLabels(p).office}
              {p.demo ? ' (contexto demonstrativo)' : ''}
            </dd>
            <dt>Esfera</dt>
            <dd>
              {representationLabels(p).sphere}
              {p.demo ? ' (contexto demonstrativo)' : ''}
            </dd>
            <dt>UF de representação</dt>
            <dd>{p.uf}</dd>
            <dt>Instituição</dt>
            <dd>
              {representationLabels(p).name}
              {p.demo ? ' (contexto demonstrativo)' : ''}
            </dd>
            <dt>{p.institution === 'senado' ? 'Legislaturas do mandato' : 'Legislatura'}</dt>
            <dd>{p.demo ? 'Não se aplica' : p.legislature}</dd>
            <dt>Partido informado na coleta</dt>
            <dd>{valueLabel(p.party)}</dd>
          </dl>
          {p.senateMandate && (
            <>
              <h3>Mandato informado pelo Senado</h3>
              <dl>
                <dt>Identificador do mandato</dt>
                <dd>{p.senateMandate.externalId}</dd>
                <dt>Participação no mandato</dt>
                <dd>{valueLabel(p.senateMandate.participation)}</dd>
              </dl>
              <h3>Períodos de exercício informados</h3>
              {p.senateMandate.exercises.length ? (
                <ul>
                  {p.senateMandate.exercises.map((period) => (
                    <li key={period.externalId}>
                      {period.start ?? 'Início não informado'} — {period.end ?? 'Fim não informado'}
                      {period.endReason ? ` · ${period.endReason}` : ''}
                      {period.endReasonCode ? ` (${period.endReasonCode})` : ''}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Períodos não informados pela fonte.</p>
              )}
              <p className="muted">
                A lista reúne senadores em exercício na coleta. Titular ou suplente indica a
                participação no mandato; não determina exercício atual fora dessa observação. Os
                períodos exibidos limitam-se ao recurso coletado.
              </p>
            </>
          )}
          <p className="muted">Histórico completo de exercício e filiação ainda não disponível.</p>
        </section>
        <section className="panel">
          <h2>Contatos {p.demo ? '' : 'oficiais'}</h2>
          <div className="contact">
            <Mail size={20} />
            <div>
              <small>E-mail institucional</small>
              {p.email.value ? (
                <a href={`mailto:${p.email.value}`}>{p.email.value}</a>
              ) : (
                <span>{valueLabel(p.email)}</span>
              )}
            </div>
          </div>
          <div className="contact">
            <Phone size={20} />
            <div>
              <small>Telefone do gabinete</small>
              {p.phone.value ? (
                <a href={`tel:${p.phone.value.replace(/[^+\d]/g, '')}`}>{p.phone.value}</a>
              ) : (
                <span>{valueLabel(p.phone)}</span>
              )}
            </div>
          </div>
          {p.provenance.officialUrl && (
            <Button asChild variant="outline">
              <a href={p.provenance.officialUrl} target="_blank" rel="noreferrer">
                Abrir perfil oficial <ArrowUpRight size={16} />
              </a>
            </Button>
          )}
          <p className="muted">Abrir um canal não confirma envio, leitura ou resposta.</p>
        </section>
      </div>
      <section className="profile-proposals">
        <div className="results-heading">
          <h2>Propostas de autoria e coautoria</h2>
          <Link to="/propostas" search={{ authorId: p.id, page: 1, pageSize: 6 }}>
            Ver todas as propostas importadas
          </Link>
        </div>
        <p className="muted">
          Proponentes e signatários de apoio são apresentados com papéis distintos. A coleção
          importada não representa toda a atuação parlamentar.
        </p>
        {proposals.items.length ? (
          <div className="proposal-grid">
            {proposals.items.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} personId={p.id} />
            ))}
          </div>
        ) : (
          <p className="coverage-note">
            {p.institution === 'senado'
              ? 'Matérias do Senado ainda não integradas. Isso não significa ausência de atuação parlamentar.'
              : 'Nenhuma proposta importada para esta pessoa. Isso não significa ausência de propostas na Câmara.'}
          </p>
        )}
      </section>
      <section className="panel follow-panel">
        <div>
          <h2>Acompanhe esta pessoa</h2>
          <p>Salve o perfil na sua área pessoal. Feed e alertas ainda não estão disponíveis.</p>
        </div>
        <FollowButton id={p.id} demo={p.demo} />
      </section>
      <section className="provenance">
        <h2>Origem e cobertura</h2>
        <p>
          {p.demo
            ? 'Dados fictícios para demonstração. Não correspondem a políticos reais.'
            : `Fonte: Dados Abertos ${p.institution === 'senado' ? 'do Senado Federal' : 'da Câmara dos Deputados'}.`}
        </p>
        <p>
          Identificador: {p.provenance.source}/{p.provenance.externalId} ·{' '}
          {p.demo ? 'Referência da demonstração' : 'Coleta'}:{' '}
          {new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'America/Sao_Paulo',
          }).format(new Date(p.provenance.fetchedAt))}{' '}
          (Brasília)
        </p>
        {!p.demo && (
          <p>
            Foto: {p.photo.state === 'available' ? institution : valueLabel(p.photo)}
            {p.photo.value && (
              <>
                {' '}
                ·{' '}
                <a href={p.photo.value} target="_blank" rel="noreferrer">
                  Imagem oficial{' '}
                  {p.institution === 'senado' ? 'do Senado Federal' : 'da Câmara dos Deputados'}
                </a>
              </>
            )}
          </p>
        )}
        {p.provenance.resourceUrl && (
          <a href={p.provenance.resourceUrl} target="_blank" rel="noreferrer">
            Consultar registro da fonte <ArrowUpRight size={14} />
          </a>
        )}
        <p>
          Importação manual e limitada, sem atualização automática. A coleta não é data de
          atualização oficial. Ausência em outra coleta não remove registros nem comprova
          afastamento. A seção de propostas mostra somente os vínculos coletados. Votações, gastos e
          candidaturas ainda não estão integrados neste perfil.
        </p>
      </section>
    </>
  )
}
