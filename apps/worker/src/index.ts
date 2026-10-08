import { connectDatabase } from '@civica/db'
import { z } from 'zod'
import { requireLocal } from '../../../scripts/local-only'
import { syncProposals } from './proposals'
import { syncCamara } from './sync'

const args = process.argv.slice(2)
if (args.includes('--help') || !args.length) {
  console.log(
    'Uso: bun run worker -- --source=camara --resource=deputies --start-page=1 --max-pages=1 --page-size=3 --limit=3\nPropostas: --resource=proposals --year=2026 --type=PL [--number=4916] [--deputy=204379]\nLotes manuais, locais, máximo 100 registros/chamada e 5 páginas. SIGINT/SIGTERM cancela e fecha o pool.',
  )
  process.exit(0)
}
const entries = Object.fromEntries(
  args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')),
)
const options = z
  .object({
    source: z.literal('camara'),
    resource: z.enum(['deputies', 'proposals']).default('deputies'),
    'start-page': z.coerce.number().int().min(1).max(10000).default(1),
    year: z.coerce.number().int().min(1900).max(2100).default(new Date().getUTCFullYear()),
    type: z
      .string()
      .regex(/^[A-Z][A-Z0-9]{0,9}$/)
      .optional(),
    number: z.coerce.number().int().min(1).max(1000000).optional(),
    deputy: z.coerce.number().int().positive().optional(),
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
  const common = {
    maxPages: options.data['max-pages'],
    pageSize: options.data['page-size'],
    limit: options.data.limit,
    signal: abort.signal,
    startPage: options.data['start-page'],
  }
  const result =
    options.data.resource === 'proposals'
      ? await syncProposals(connection, {
          ...common,
          year: options.data.year,
          type: options.data.type,
          number: options.data.number,
          deputy: options.data.deputy,
        })
      : await syncCamara(connection, common)
  console.log(JSON.stringify({ event: 'sync_completed', ...result }))
} catch {
  console.error(JSON.stringify({ event: abort.signal.aborted ? 'sync_cancelled' : 'sync_failed' }))
  process.exitCode = abort.signal.aborted ? 130 : 1
} finally {
  await connection.close()
  process.off('SIGINT', stop)
  process.off('SIGTERM', stop)
}
