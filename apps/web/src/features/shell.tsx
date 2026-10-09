import { Button, cn, Empty, EmptyContent, EmptyHeader, EmptyTitle, Separator } from '@civica/ui'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  ArrowLeft,
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
import { type ReactNode, useRef, useState } from 'react'
import { publicEnv } from '../lib/env'
import { ThemeToggle } from './theme-toggle'

const links = [
  ['/app', 'Explorar', Compass],
  ['/representantes', 'Representantes', Users],
  ['/propostas', 'Propostas', BookOpen],
  ['/votacoes', 'Votações', CheckSquare],
  ['/participe', 'Participe', Landmark],
  ['/eleicoes', 'Eleições', Flag],
  ['/meu-brasil', 'Meu Brasil', CircleUserRound],
] as const

export function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand-mark">
        <Landmark size={20} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span>{publicEnv.VITE_APP_NAME}</span>
    </Link>
  )
}

export function Shell({ children, demo }: { children: ReactNode; demo: boolean }) {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const current =
    links.find(
      ([path]) => pathname === path || (path !== '/app' && pathname.startsWith(`${path}/`)),
    )?.[1] ?? 'Plataforma'
  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Brand />
          <button
            className="mobile-menu"
            ref={menuButton}
            type="button"
            aria-label={open ? 'Fechar navegação' : 'Abrir navegação'}
            aria-expanded={open}
            aria-controls="app-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <nav
          id="app-navigation"
          aria-label="Navegação principal"
          className={cn('navigation', open && 'is-open')}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false)
              menuButton.current?.focus()
            }
          }}
        >
          <span className="navigation-label">PLATAFORMA</span>
          {links.map(([to, label, Icon]) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === '/app' }}
              activeProps={{ className: 'active' }}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Separator />
          <span className="sidebar-coverage">
            <span className="status-dot" />
            Cobertura federal
          </span>
          <Link to="/">
            <ArrowLeft size={16} aria-hidden="true" />
            Sobre o projeto
          </Link>
          <small>Uma iniciativa independente.</small>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <span>
            Plataforma <span className="breadcrumb-separator">/</span> <strong>{current}</strong>
          </span>
          <div className="topbar-actions">
            <ThemeToggle />
            <Button asChild variant="ghost">
              <Link to="/meu-brasil">
                <CircleUserRound data-icon="inline-start" />
                Minha área
              </Link>
            </Button>
          </div>
        </header>
        <div className={cn('data-strip', demo ? 'demo-strip' : 'live-strip')}>
          <span className="status-dot" />
          <strong>{demo ? 'Modo demonstração' : 'Dados integrados'}</strong>
          <span>
            {demo
              ? 'Representantes fictícios. Nenhum dado eleitoral é simulado.'
              : 'Catálogo local da Câmara. Consulte a coleta e a cobertura de cada registro.'}
          </span>
        </div>
        <main id="conteudo" className="content">
          {children}
        </main>
        <footer className="page-footer">
          <span>{publicEnv.VITE_APP_NAME} · Nome provisório</span>
          <Link to="/participe">
            Canais oficiais <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </div>
  )
}
export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Empty className="empty-state">
      <EmptyHeader>
        <Compass size={26} strokeWidth={1.5} aria-hidden="true" />
        <EmptyTitle role="heading" aria-level={2}>
          {title}
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  )
}
