import interFontHref from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { EmptyState } from '../features/shell'
import { getSettings } from '../lib/functions'
import { themeInitScript } from '../lib/theme'
import styleHref from '../styles.css?url'
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => getSettings(),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#0056b3' },
    ],
    links: [
      { rel: 'stylesheet', href: styleHref },
      {
        rel: 'preload',
        href: interFontHref,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: Root,
  notFoundComponent: () => (
    <EmptyState title="Página não encontrada">
      <p>Este endereço não está disponível.</p>
      <Link to="/">Voltar ao início</Link>
    </EmptyState>
  ),
  errorComponent: ({ reset }) => (
    <EmptyState title="Não foi possível carregar esta página">
      <p>Os dados estão temporariamente indisponíveis.</p>
      <button type="button" className="button button-primary" onClick={reset}>
        Tentar novamente
      </button>
    </EmptyState>
  ),
})
function Root() {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Static theme bootstrap with no user data. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
