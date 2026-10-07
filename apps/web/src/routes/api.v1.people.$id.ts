import { personIdSchema } from '@civica/contracts'
import { createFileRoute } from '@tanstack/react-router'
import { catalog } from '../server/catalog.server'
import { http } from '../server/http.server'
export const Route = createFileRoute('/api/v1/people/$id')({
  server: {
    handlers: { GET: ({ params }) => http(() => catalog().get(personIdSchema.parse(params.id))) },
  },
})
