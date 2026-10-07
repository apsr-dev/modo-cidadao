import type { PersonalDatabase } from '@civica/db'
import '@tanstack/react-start/server-only'
import { DomainError, type FollowsRepository, following } from '@civica/domain'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { getCookies, getRequest, setCookie, setResponseHeader } from '@tanstack/react-start/server'
import { catalogRepository } from './catalog.server'
import { serverEnv } from './env.server'
export function noStore() {
  setResponseHeader('Cache-Control', 'private, no-store')
  setResponseHeader('Vary', 'Cookie, Authorization')
}
export function assertOrigin(request: Request = getRequest()) {
  if (request.headers.get('origin') !== new URL(serverEnv().VITE_APP_URL).origin)
    throw new DomainError('FORBIDDEN')
}
export function authClient(request: Request = getRequest()) {
  noStore()
  const env = serverEnv()
  if (env.DEMO_MODE === 'true' || !env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY)
    throw new DomainError('UNAVAILABLE')
  const token = request.headers.get('authorization')
  if (token) {
    if (!/^Bearer [A-Za-z0-9._-]+$/.test(token)) throw new DomainError('UNAUTHORIZED')
    return createClient<PersonalDatabase>(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: token } },
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return createServerClient<PersonalDatabase>(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => Object.entries(getCookies()).map(([name, value]) => ({ name, value })),
      setAll: (cookies) => {
        for (const { name, value, options } of cookies)
          setCookie(name, value, {
            ...options,
            httpOnly: true,
            sameSite: 'lax',
            secure: env.VITE_APP_URL.startsWith('https:'),
          })
      },
    },
  })
}
export async function authenticated(request: Request = getRequest()) {
  const client = authClient(request)
  const bearer = request.headers.get('authorization')?.slice(7)
  const { data, error } = bearer ? await client.auth.getUser(bearer) : await client.auth.getUser()
  if (error || !data.user) throw new DomainError('UNAUTHORIZED')
  return { client, user: data.user }
}
export async function personal(request: Request = getRequest()) {
  const { client, user } = await authenticated(request)
  const repo: FollowsRepository = {
    async list() {
      const { data, error } = await client
        .from('followed_people')
        .select('person_id')
        .eq('user_id', user.id)
      if (error) throw new DomainError('UNAVAILABLE')
      return (data ?? []).map((row) => String(row.person_id))
    },
    async add(id) {
      const { error } = await client
        .from('followed_people')
        .upsert(
          { user_id: user.id, person_id: id },
          { onConflict: 'user_id,person_id', ignoreDuplicates: true },
        )
      if (error) throw new DomainError('UNAVAILABLE')
    },
    async remove(id) {
      const { error } = await client
        .from('followed_people')
        .delete()
        .eq('user_id', user.id)
        .eq('person_id', id)
      if (error) throw new DomainError('UNAVAILABLE')
    },
  }
  return { user, service: following(user.id, repo, catalogRepository()) }
}
