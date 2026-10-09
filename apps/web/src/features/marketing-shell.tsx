import { Button } from '@civica/ui'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { publicEnv } from '../lib/env'
import { Brand } from './shell'
import { ThemeToggle } from './theme-toggle'

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="marketing-shell">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="marketing-header">
        <Brand />
        <nav aria-label="Sobre o projeto">
          <a href="#como-funciona">Como funciona</a>
          <a href="#sobre">O projeto</a>
        </nav>
        <div className="marketing-header-actions">
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link to="/app">
              <span className="desktop-action">Abrir plataforma</span>
              <span className="mobile-action">Abrir app</span>{' '}
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </header>
      <main id="conteudo">{children}</main>
      <footer className="marketing-footer">
        <div>
          <Brand />
          <p>Uma iniciativa independente. Nome provisório.</p>
        </div>
        <div>
          <Link to="/app">
            Explorar a plataforma <ArrowUpRight aria-hidden="true" />
          </Link>
          <p>Fatos, contexto e fontes. A decisão é sua.</p>
        </div>
        <p className="photo-credit" id="credito-foto">
          Foto do Congresso: Carlos Moura / Agência Senado, 22/07/2025.{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:Imagens_de_Bras%C3%ADlia_-_Pal%C3%A1cio_do_Congresso_Nacional_(54672677055).jpg"
            target="_blank"
            rel="noreferrer"
          >
            Original
          </a>{' '}
          ·{' '}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noreferrer"
          >
            CC BY-SA 4.0
          </a>
          . Exibida com recorte e sobreposição para contraste. {publicEnv.VITE_APP_NAME} não é um
          portal governamental.
        </p>
      </footer>
    </div>
  )
}
