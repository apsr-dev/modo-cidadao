import { proposalIdSchema } from '@civica/contracts'
import { createFileRoute } from '@tanstack/react-router'
import { proposalCatalog } from '../server/catalog.server'
import { http } from '../server/http.server'
export const Route = createFileRoute('/api/v1/proposals/$id')({
  server: {
    handlers: {
      GET: ({ params }) => http(() => proposalCatalog().get(proposalIdSchema.parse(params.id))),
    },
  },
})
