import { connectDatabase } from '@civica/db'
import { requireLocal } from './local-only'

const connection = connectDatabase(requireLocal(process.env.DATABASE_URL, 'DATABASE_URL'))
const started = new Date().toISOString()
const child = Bun.spawn(
  [
    'bun',
    'apps/worker/src/index.ts',
    '--source=camara',
    '--max-pages=1',
    '--page-size=3',
    '--limit=3',
  ],
  { stdout: 'pipe', stderr: 'pipe' },
)
try {
  let run: string | undefined
  for (let i = 0; i < 100; i++) {
    const rows =
      await connection.client`select id from internal.sync_runs where started_at >= ${started} order by started_at desc limit 1`
    if (rows[0]) {
      run = String(rows[0].id)
      break
    }
    await Bun.sleep(30)
  }
  if (!run) throw new Error('WORKER_DID_NOT_START')
  child.kill('SIGTERM')
  const code = await child.exited
  const [row] = await connection.client`select status from internal.sync_runs where id=${run}`
  if (code !== 130 || row?.status !== 'cancelled') throw new Error('WORKER_SHUTDOWN_NOT_CONFIRMED')
  console.log('SIGTERM verificado: execução cancelada no banco, pool encerrado, exit 130.')
} finally {
  if (child.exitCode === null) child.kill('SIGTERM')
  await connection.close()
}
