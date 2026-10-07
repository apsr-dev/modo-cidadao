import { credentialsSchema, filtersSchema, followSchema, personIdSchema } from '@civica/contracts'
import { createServerFn } from '@tanstack/react-start'
export const getSettings = createServerFn({ method: 'GET' }).handler(async () => {
  const { serverEnv } = await import('../server/env.server')
  return { demo: serverEnv().DEMO_MODE === 'true' }
})
export const listRepresentatives = createServerFn({ method: 'GET' })
  .validator(filtersSchema)
  .handler(async ({ data }) => {
    const { catalog } = await import('../server/catalog.server')
    return catalog().list(data)
  })
export const getRepresentative = createServerFn({ method: 'GET' })
  .validator(personIdSchema)
  .handler(async ({ data }) => {
    const { catalogRepository } = await import('../server/catalog.server')
    return catalogRepository().get(data)
  })
export const getPersonal = createServerFn({ method: 'GET' }).handler(async () => {
  const { personal, noStore } = await import('../server/auth.server')
  const { DomainError } = await import('@civica/domain')
  const { serverEnv } = await import('../server/env.server')
  noStore()
  if (serverEnv().DEMO_MODE === 'true')
    return {
      status: 'demo' as const,
      ids: [] as string[],
      people: [] as { id: string; name: string }[],
      email: null,
    }
  try {
    const { user, service } = await personal()
    const ids = await service.list()
    const { catalogRepository } = await import('../server/catalog.server')
    const people = (await Promise.all(ids.map((id) => catalogRepository().get(id)))).flatMap((p) =>
      p ? [{ id: p.id, name: p.name }] : [],
    )
    return {
      status: 'authenticated' as const,
      ids,
      people,
      email: user.email ?? null,
    }
  } catch (error) {
    if (error instanceof DomainError && error.code === 'UNAUTHORIZED')
      return {
        status: 'anonymous' as const,
        ids: [] as string[],
        people: [] as { id: string; name: string }[],
        email: null,
      }
    return {
      status: 'unavailable' as const,
      ids: [] as string[],
      people: [] as { id: string; name: string }[],
      email: null,
    }
  }
})
export const setFollow = createServerFn({ method: 'POST' })
  .validator(followSchema)
  .handler(async ({ data }) => {
    const { personal, assertOrigin } = await import('../server/auth.server')
    assertOrigin()
    const { service } = await personal()
    await (data.follow ? service.follow(data.personId) : service.unfollow(data.personId))
    return { ok: true }
  })
export const login = createServerFn({ method: 'POST' })
  .validator(credentialsSchema)
  .handler(async ({ data }) => {
    const { authClient, assertOrigin } = await import('../server/auth.server')
    assertOrigin()
    const { error } = await authClient().auth.signInWithPassword(data)
    return { ok: !error }
  })
export const signup = createServerFn({ method: 'POST' })
  .validator(credentialsSchema)
  .handler(async ({ data }) => {
    const { authClient, assertOrigin } = await import('../server/auth.server')
    assertOrigin()
    const { data: result, error } = await authClient().auth.signUp(data)
    return { ok: !error, confirmed: !!result.session }
  })
export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const { authClient, assertOrigin } = await import('../server/auth.server')
  assertOrigin()
  const { error } = await authClient().auth.signOut()
  if (error) throw new Error('SIGN_OUT_FAILED')
  return { ok: true }
})
