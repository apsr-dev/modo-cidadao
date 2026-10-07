import { personIdSchema } from '@civica/contracts'
import { createFileRoute } from '@tanstack/react-router'
import { assertOrigin, personal } from '../server/auth.server'
import { http } from '../server/http.server'

const mutate = (request: Request, id: string, follow: boolean) =>
  http(async () => {
    if (!request.headers.has('authorization')) assertOrigin(request)
    const personId = personIdSchema.parse(id)
    const { service } = await personal(request)
    await (follow ? service.follow(personId) : service.unfollow(personId))
    return { ok: true }
  }, true)
export const Route = createFileRoute('/api/v1/me/follows/people/$id')({
  server: {
    handlers: {
      PUT: ({ request, params }) => mutate(request, params.id, true),
      DELETE: ({ request, params }) => mutate(request, params.id, false),
    },
  },
})
