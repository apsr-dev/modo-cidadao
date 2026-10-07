import { proposalFiltersSchema } from '@civica/contracts'
import { createFileRoute } from '@tanstack/react-router'
import { proposalCatalog } from '../server/catalog.server'
import { http } from '../server/http.server'
export const Route = createFileRoute('/api/v1/proposals')({
  server: {
    handlers: {
      GET: ({ request }) =>
        http(() =>
          proposalCatalog().list(
            proposalFiltersSchema.parse(Object.fromEntries(new URL(request.url).searchParams)),
          ),
        ),
    },
  },
})
