import { Badge, Button } from '@civica/ui'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckSquare,
  Landmark,
  MapPin,
  MessageSquare,
  Users,
} from 'lucide-react'
import { metadata } from '../lib/env'
export const Route = createFileRoute('/')({
  head: () =>
    metadata(
      'A cidadania continua depois do voto',
      'Conheça representantes, entenda a atividade do Congresso e encontre canais oficiais de participação.',
      '/',
    ),
  component: Home,
})
function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="status-dot" /> SEU PAÍS. SUA PARTICIPAÇÃO.
          </span>
          <h1>
            A cidadania continua
            <br />
            depois do <em>voto.</em>
          </h1>
          <p>
            Conheça quem representa você e encontre caminhos para participar. Informação pública,
            reunida para fazer parte do seu dia a dia.
          </p>
          <div className="hero-actions">
            <Button asChild>
              <Link to="/representantes" search={{ name: '', page: 1, pageSize: 6 }}>
                Encontrar representantes <ArrowRight size={17} />
              </Link>
            </Button>
            <Link className="text-link" to="/participe">
              Quero participar <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="hero-footnote">
            <Check size={15} /> Navegue sem criar uma conta
          </div>
        </div>
        <div className="civic-illustration" aria-hidden="true">
          <div className="illustration-orbit orbit-one" />
          <div className="illustration-orbit orbit-two" />
          <span className="illustration-star star-one">✳</span>
          <span className="illustration-star star-two">+</span>
          <div className="civic-card card-back">
            <span className="mini-line" />
            <span className="mini-line short" />
            <div className="mini-people">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="civic-card card-front">
            <span className="stamp">
              <Landmark size={27} />
            </span>
            <span className="illustration-label">
              A vida pública
              <br />
              <strong>também é sua.</strong>
            </span>
            <div className="illustration-bottom">
              <span>BRASIL · PARTICIPAÇÃO</span>
              <ArrowUpRight size={21} />
            </div>
          </div>
          <div className="floating-note">
            <MessageSquare size={17} /> Sua voz tem lugar
          </div>
        </div>
      </section>
      <section className="discover-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">POR ONDE COMEÇAR</span>
            <h2>Mais perto das decisões.</h2>
          </div>
          <span className="section-caption">Descobrir. Entender. Acompanhar. Participar.</span>
        </div>
        <div className="discovery-grid">
          {[
            {
              to: '/representantes',
              icon: Users,
              title: 'Quem representa você',
              text: 'Explore deputados federais da Câmara e consulte a origem de cada informação.',
              label: 'Explorar representantes',
              tone: 'green',
            },
            {
              to: '/propostas',
              icon: BookOpen,
              title: 'O que está em discussão',
              text: 'O espaço para entender propostas, versões do texto e tramitações.',
              label: 'Conhecer este espaço',
              tone: 'yellow',
            },
            {
              to: '/votacoes',
              icon: CheckSquare,
              title: 'Como as decisões acontecem',
              text: 'O espaço para consultar decisões e votos com o contexto necessário.',
              label: 'Conhecer este espaço',
              tone: 'blue',
            },
          ].map(({ to, icon: Icon, title, text, label, tone }) => (
            <Link to={to} key={to} className="discovery-card">
              <span className={`icon-tile ${tone}`}>
                <Icon size={23} />
              </span>
              {to !== '/representantes' && (
                <Badge className="quiet-badge">Integração pendente</Badge>
              )}
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="card-action">
                {label}
                <ArrowRight size={17} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="participation-callout">
        <div className="participation-symbol">
          <MessageSquare size={31} />
        </div>
        <div>
          <span className="eyebrow">ALÉM DA URNA</span>
          <h2>Participar pode começar com uma pergunta.</h2>
          <p>Encontre consultas, debates e canais de diálogo nos portais oficiais.</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/participe">
            Ver como participar <ArrowUpRight size={17} />
          </Link>
        </Button>
      </section>
      <div className="trust-row">
        <div>
          <MapPin size={20} />
          <p>
            <strong>Cobertura transparente</strong>
            <span>
              Deputados federais disponíveis. Senado e esferas estadual/distrital ainda não
              integrados.
            </span>
          </p>
        </div>
        <div>
          <Landmark size={20} />
          <p>
            <strong>Direto à fonte</strong>
            <span>Dados e participação conectados aos canais oficiais.</span>
          </p>
        </div>
        <div>
          <Check size={20} />
          <p>
            <strong>Sem notas para políticos</strong>
            <span>Contexto para você formar a própria opinião.</span>
          </p>
        </div>
      </div>
    </>
  )
}
