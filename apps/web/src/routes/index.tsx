import { Button, Separator } from '@civica/ui'
import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { MarketingShell } from '../features/marketing-shell'
import { metadata, publicEnv } from '../lib/env'

export const Route = createFileRoute('/')({
  head: () =>
    metadata(
      'A cidadania continua depois do voto',
      'Conheça quem representa você e encontre canais oficiais para participar da vida pública.',
      '/',
    ),
  component: Home,
})

function Home() {
  const { demo } = getRouteApi('__root__').useLoaderData()
  return (
    <MarketingShell>
      <section className="landing-hero" aria-labelledby="landing-title">
        <img
          className="landing-photo"
          src="/images/congresso-nacional.jpg"
          alt="Palácio do Congresso Nacional, em Brasília, fotografado por Carlos Moura, Agência Senado"
          width={4176}
          height={2784}
          fetchPriority="high"
        />
        <div className="landing-hero-inner">
          <p className="landing-kicker">INFORMAÇÃO PÚBLICA. ESCOLHAS SUAS.</p>
          <h1 id="landing-title">{publicEnv.VITE_APP_NAME}</h1>
          <h2>
            A cidadania continua
            <br />
            depois do voto.
          </h2>
          <p className="landing-intro">
            Conheça quem representa você.
            <br />
            Encontre caminhos para participar.
          </p>
          <div className="landing-actions">
            <Button asChild>
              <Link to="/app">
                Explorar a plataforma <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <a className="hero-secondary" href="#como-funciona">
              Conheça o projeto <ArrowDown aria-hidden="true" />
            </a>
          </div>
          <span className="landing-footnote">Acesso público · Sem precisar criar uma conta</span>
        </div>
        <div className="landing-photo-caption">
          <span>BRASÍLIA, BRASIL</span>
          <a href="#credito-foto">Foto: Carlos Moura / Agência Senado</a>
        </div>
      </section>

      <section className="landing-section landing-purpose" id="como-funciona">
        <div>
          <p className="section-label">01 / MAIS PERTO</p>
          <h2>
            O país é público.
            <br />A informação também.
          </h2>
        </div>
        <div>
          <p>
            Decisões públicas fazem parte da sua vida. Reunimos informações e canais oficiais para
            que você possa entender e participar, no seu tempo.
          </p>
          <Link
            to="/representantes"
            search={{ name: '', page: 1, pageSize: 24 }}
            className="text-link"
          >
            Encontrar representantes <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
      <div className="landing-section">
        <Separator />
      </div>
      <section className="landing-section landing-paths" aria-labelledby="landing-paths-title">
        <div className="landing-section-heading">
          <p className="section-label">02 / COMECE POR AQUI</p>
          <h2 id="landing-paths-title">
            Um próximo passo
            <br />
            ao seu alcance.
          </h2>
        </div>
        <div className="landing-path-list">
          <Link to="/representantes" search={{ name: '', page: 1, pageSize: 24 }}>
            <span className="path-number">01</span>
            <div>
              <h3>Conheça seus representantes</h3>
              <p>Busque por nome ou estado e consulte cada fonte.</p>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link to="/participe">
            <span className="path-number">02</span>
            <div>
              <h3>Encontre um canal de participação</h3>
              <p>Consultas, ideias e debates nos portais da Câmara e do Senado.</p>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link to="/meu-brasil">
            <span className="path-number">03</span>
            <div>
              <h3>Escolha quem acompanhar</h3>
              <p>Salve perfis na sua área privada quando estiver usando dados integrados.</p>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section
        className="landing-section landing-purpose"
        id="fontes"
        aria-labelledby="sources-title"
      >
        <div>
          <p className="section-label">03 / FONTES E COBERTURA</p>
          <h2 id="sources-title">
            Saiba de onde vem
            <br />
            cada informação.
          </h2>
        </div>
        <div>
          <h3>{demo ? 'Você está na demonstração' : 'Catálogo local da Câmara'}</h3>
          <p>
            {demo
              ? 'Os representantes são personagens fictícios para conhecer a interface. A demonstração não salva acompanhamentos nem cria contas.'
              : 'O catálogo reúne deputados importados dos Dados Abertos da Câmara. A importação é limitada; não há garantia de cobertura completa nem atualização automática.'}
          </p>
          <p>
            {demo
              ? 'No modo integrado, cada perfil identifica a fonte, o link oficial e a data de coleta.'
              : 'Cada perfil identifica a fonte, o link oficial e a data de coleta. Coleta não é a data de atualização oficial.'}{' '}
            Senadores, propostas, votações, despesas e dados eleitorais ainda não estão integrados
            nesta versão.
          </p>
          <a
            className="text-link"
            href="https://dadosabertos.camara.leg.br/"
            target="_blank"
            rel="noreferrer"
          >
            Dados Abertos da Câmara <ArrowUpRight aria-hidden="true" />
          </a>
          <p>
            A participação acontece nos portais oficiais da Câmara e do Senado. Abrir um canal não
            comprova que você concluiu uma participação.
          </p>
          <Link to="/participe" className="text-link">
            Consultar canais oficiais <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className="landing-principles" id="sobre">
        <div className="landing-section">
          <p className="section-label">04 / NOSSO COMPROMISSO</p>
          <h2>
            Contexto para pensar.
            <br />
            Liberdade para decidir.
          </h2>
          <div className="principles-list">
            <p>
              <strong>Direto à fonte.</strong> Cada registro indica de onde veio a informação.
            </p>
            <p>
              <strong>Sem ranking político.</strong> Não damos notas nem recomendamos votos.
            </p>
            <p>
              <strong>Cobertura transparente.</strong> Consulte os limites de cada fonte. Uma
              amostra não representa cobertura completa.
            </p>
          </div>
          <Button asChild>
            <Link to="/app">
              Abrir a plataforma <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>
    </MarketingShell>
  )
}
