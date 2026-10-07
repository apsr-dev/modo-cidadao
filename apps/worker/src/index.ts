import { connectDatabase } from '@civica/db'
import { z } from 'zod'
import { requireLocal } from '../../../scripts/local-only'
import { syncCamara } from './sync'

const args = process.argv.slice(2)
if (args.includes('--help') || !args.length) {
  console.log(
    'Uso: bun run worker -- --source=camara --max-pages=1 --page-size=3 --limit=3\nSincronização manual, local e limitada (máximo 100 registros). SIGINT/SIGTERM cancela e fecha o pool.',
  )
  process.exit(0)
}
const entries = Object.fromEntries(
  args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')),
)
const options = z
  .object({
    source: z.literal('camara'),
    'max-pages': z.coerce.number().int().min(1).max(5).default(1),
    'page-size': z.coerce.number().int().min(1).max(20).default(3),
    limit: z.coerce.number().int().min(1).max(100).default(3),
  })
  .strict()
  .safeParse(entries)
if (!options.success) {
  console.error('WORKER_INVALID_OPTIONS')
  process.exit(1)
}
const abort = new AbortController()
const stop = () => abort.abort()
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
const connection = connectDatabase(requireLocal(process.env.DATABASE_URL, 'DATABASE_URL'))
try {
  const result = await syncCamara(connection, {
    maxPages: options.data['max-pages'],
    pageSize: options.data['page-size'],
    limit: options.data.limit,
    signal: abort.signal,
  })
  console.log(JSON.stringify({ event: 'sync_completed', ...result }))
} catch {
  console.error(JSON.stringify({ event: abort.signal.aborted ? 'sync_cancelled' : 'sync_failed' }))
  process.exitCode = abort.signal.aborted ? 130 : 1
} finally {
  await connection.close()
  process.off('SIGINT', stop)
  process.off('SIGTERM', stop)
}
