import { Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  BookOpen,
  CheckSquare,
  CircleUserRound,
  Compass,
  Flag,
  Landmark,
  Menu,
  Users,
  X,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { publicEnv } from '../lib/env'

const links = [
  ['/', 'Visão geral', Compass],
  ['/representantes', 'Representantes', Users],
  ['/propostas', 'Propostas', BookOpen],
  ['/votacoes', 'Votações', CheckSquare],
  ['/participe', 'Participe', Landmark],
  ['/eleicoes', 'Eleições', Flag],
  ['/meu-brasil', 'Meu Brasil', CircleUserRound],
] as const
export function Shell({ children, demo }: { children: ReactNode; demo: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Landmark size={23} />
          </span>
          <span>
            {publicEnv.VITE_APP_NAME}
            <small>CIDADANIA NO DIA A DIA</small>
          </span>
        </Link>
        <button
          className="mobile-menu"
          type="button"
          aria-label={open ? 'Fechar navegação' : 'Abrir navegação'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          aria-label="Navegação principal"
          className={open ? 'navigation is-open' : 'navigation'}
        >
          {links.map(([to, label, Icon]) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === '/' }}
              activeProps={{ className: 'active' }}
              onClick={() => setOpen(false)}
            >
              <Icon size={19} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="small-label">INFORMAÇÃO COM ORIGEM</span>
          <p>Entender o país começa por saber onde buscar.</p>
          <Link to="/participe">
            Conheça os canais oficiais <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="sidebar-footer">
          <span className="status-dot" />
          Cobertura federal <small>Uma iniciativa independente.</small>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <span>
            Brasil <span className="muted">/</span> Cidadania e participação
          </span>
          <Link to="/meu-brasil">
            <CircleUserRound size={18} /> Minha área
          </Link>
        </header>
        {demo ? (
          <div className="demo-strip">
            <span className="status-dot" /> Modo demonstração{' '}
            <span>
              Representantes, propostas e tramitações são fictícios. Nenhum dado eleitoral é
              simulado.
            </span>
          </div>
        ) : (
          <div className="live-strip">
            Catálogo local · Importação limitada da Câmara · Consulte a data de coleta em cada
            registro.
          </div>
        )}
        <main id="conteudo" className="content">
          {children}
        </main>
        <footer className="page-footer">
          <span>{publicEnv.VITE_APP_NAME} · Nome provisório</span>
          <span>Fatos, contexto e fontes. A decisão é sua.</span>
        </footer>
      </div>
    </div>
  )
}
export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="empty-state">
      <Compass size={32} />
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}
