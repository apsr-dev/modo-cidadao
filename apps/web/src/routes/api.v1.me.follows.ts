import { createFileRoute } from '@tanstack/react-router'
import { personal } from '../server/auth.server'
import { http } from '../server/http.server'
export const Route = createFileRoute('/api/v1/me/follows')({
  server: {
    handlers: {
      GET: ({ request }) =>
        http(async () => ({ ids: await (await personal(request)).service.list() }), true),
    },
  },
})
