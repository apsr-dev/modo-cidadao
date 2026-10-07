import { filtersSchema } from '@civica/contracts'
import { createFileRoute } from '@tanstack/react-router'
import { catalog } from '../server/catalog.server'
import { http } from '../server/http.server'
export const Route = createFileRoute('/api/v1/representatives')({
  server: {
    handlers: {
      GET: ({ request }) =>
        http(() =>
          catalog().list(
            filtersSchema.parse(Object.fromEntries(new URL(request.url).searchParams)),
          ),
        ),
    },
  },
})
