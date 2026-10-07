import { resolve, sep } from 'node:path'
import { parseEnv } from 'node:util'

const localEnvironment = Bun.file(new URL('../../.env', import.meta.url))
if (await localEnvironment.exists()) {
  const values = parseEnv(await localEnvironment.text())
  for (const key of [
    'DEMO_MODE',
    'DATABASE_READ_URL',
    'SUPABASE_URL',
    'SUPABASE_PUBLISHABLE_KEY',
    'VITE_APP_URL',
    'PORT',
  ]) {
    if (values[key] !== undefined) process.env[key] ??= values[key]
  }
}

// Fetch-style Start output, following TanStack's Bun hosting reference.
const entry = resolve(import.meta.dir, 'dist/server/server.js')
const { default: handler } = await import(entry)
const assets = resolve(import.meta.dir, 'dist/client')
const port = Number(process.env.PORT ?? 3000)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT_INVALID')
const server = Bun.serve({
  hostname: process.env.HOST ?? '127.0.0.1',
  port,
  async fetch(request) {
    const pathname = new URL(request.url).pathname
    if (request.method === 'GET' || request.method === 'HEAD') {
      let decoded: string
      try {
        decoded = decodeURIComponent(pathname)
      } catch {
        return new Response('Bad request', { status: 400 })
      }
      const path = resolve(assets, `.${decoded}`)
      if (
        path.startsWith(`${assets}${sep}`) &&
        !decoded.split('/').some((part) => part.startsWith('.'))
      ) {
        const file = Bun.file(path)
        if (await file.exists())
          return new Response(request.method === 'HEAD' ? null : file, {
            headers: {
              'Content-Type': file.type,
              'Cache-Control': pathname.startsWith('/assets/')
                ? 'public, max-age=31536000, immutable'
                : 'public, max-age=300',
            },
          })
      }
    }
    return handler.fetch(request)
  },
  error() {
    return new Response('Serviço temporariamente indisponível.', { status: 500 })
  },
})
console.log(`Plataforma Cívica · Bun ${Bun.version} · http://${server.hostname}:${server.port}`)
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, async () => {
    await server.stop()
    process.exit(0)
  })
