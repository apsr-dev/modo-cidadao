import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { EmptyState, Shell } from '../features/shell'
import { getSettings } from '../lib/functions'
import styleHref from '../styles.css?url'
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => getSettings(),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#155b47' },
    ],
    links: [
      { rel: 'stylesheet', href: styleHref },
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
  const { demo } = Route.useLoaderData()
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <Shell demo={demo}>
          <Outlet />
        </Shell>
        <Scripts />
      </body>
    </html>
  )
}
