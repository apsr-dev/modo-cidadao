import { randomBytes } from 'node:crypto'
import { chmod } from 'node:fs/promises'
import { connectDatabase } from '@civica/db'
import { requireLocal } from './local-only'

// Never print CLI output: status contains local credentials.
const child = Bun.spawn(['bun', '--bun', 'supabase', 'status', '-o', 'json'], {
  stdout: 'pipe',
  stderr: 'pipe',
})
const text = await new Response(child.stdout).text()
if ((await child.exited) !== 0) throw new Error('SUPABASE_LOCAL_NOT_RUNNING')
const status = JSON.parse(text.slice(text.indexOf('{'))) as Record<string, string>
const dbUrl = requireLocal(status.DB_URL, 'DATABASE')
const apiUrl = requireLocal(status.API_URL, 'SUPABASE')
const reader = randomBytes(24).toString('hex'),
  ingest = randomBytes(24).toString('hex')
const connection = connectDatabase(dbUrl)
try {
  // Passwords are generated hex, never user-controlled or logged. SQL identifiers are fixed.
  await connection.client.unsafe(`alter role civica_reader password '${reader}'`)
  await connection.client.unsafe(`alter role civica_ingest password '${ingest}'`)
} finally {
  await connection.close()
}
const urlFor = (role: string, password: string) => {
  const url = new URL(dbUrl)
  url.username = role
  url.password = password
  return url.href
}
const path = new URL('../.env', import.meta.url)
const file = Bun.file(path)
const current = (await file.exists()) ? await file.text() : ''
const values: Record<string, string> = {
  DEMO_MODE: 'true',
  VITE_APP_NAME: 'Plataforma Cívica',
  VITE_APP_URL: 'http://localhost:3000',
  SUPABASE_URL: apiUrl,
  SUPABASE_PUBLISHABLE_KEY: status.PUBLISHABLE_KEY ?? status.ANON_KEY ?? '',
  SUPABASE_SECRET_KEY: status.SECRET_KEY ?? status.SERVICE_ROLE_KEY ?? '',
  DATABASE_READ_URL: urlFor('civica_reader', reader),
  DATABASE_URL: urlFor('civica_ingest', ingest),
  MIGRATION_DATABASE_URL: dbUrl,
}
const existing = Object.fromEntries(
  current
    .split('\n')
    .filter((line) => line.includes('=') && !line.startsWith('#'))
    .map((line) => {
      const at = line.indexOf('=')
      return [line.slice(0, at), line.slice(at + 1)]
    }),
)
if (existing.DEMO_MODE) values.DEMO_MODE = existing.DEMO_MODE
if (existing.VITE_APP_NAME) values.VITE_APP_NAME = existing.VITE_APP_NAME
if (existing.VITE_APP_URL) values.VITE_APP_URL = existing.VITE_APP_URL
await Bun.write(
  path,
  Object.entries({ ...existing, ...values })
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n',
)
await chmod(path, 0o600)
console.log('Ambiente local configurado em .env (ignorado pelo Git); credenciais não exibidas.')
