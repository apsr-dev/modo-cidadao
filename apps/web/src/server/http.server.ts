import '@tanstack/react-start/server-only'
import { DomainError } from '@civica/domain'
import { ZodError } from 'zod'
export async function http(action: () => Promise<unknown>, privateResponse = false) {
  const requestId = crypto.randomUUID()
  const headers = {
    'Cache-Control': privateResponse ? 'private, no-store' : 'no-store',
    'X-Request-Id': requestId,
    ...(privateResponse ? { Vary: 'Cookie, Authorization' } : {}),
  }
  try {
    return Response.json(await action(), { headers })
  } catch (error) {
    const code =
      error instanceof ZodError
        ? 'INVALID_INPUT'
        : error instanceof DomainError
          ? error.code
          : 'UNAVAILABLE'
    const status = {
      INVALID_INPUT: 400,
      NOT_FOUND: 404,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      UNAVAILABLE: 503,
    }[code]
    return Response.json(
      { error: { code, message: 'Não foi possível concluir esta solicitação.', requestId } },
      { status, headers },
    )
  }
}
