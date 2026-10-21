import type { connectDatabase } from '@civica/db'
import { normalizeSenators, senadoClient } from '@civica/source-senado'

type Storage = Pick<
  ReturnType<typeof connectDatabase>,
  'saveRaw' | 'upsertRepresentative' | 'startRun' | 'updateRun'
>
export async function syncSenado(
  storage: Storage,
  options: { limit: number; signal: AbortSignal },
  source = senadoClient(),
) {
  const runId = await storage.startRun('senadores-atuais', 'senado')
  let processed = 0
  try {
    options.signal.throwIfAborted()
    const raw = await source.list(options.signal)
    const snapshotId = await storage.saveRaw(raw)
    // Validate the entire collection before changing any public record.
    const people = normalizeSenators(JSON.parse(raw.text), raw.fetchedAt)
    for (const person of people.slice(0, options.limit)) {
      options.signal.throwIfAborted()
      await storage.upsertRepresentative(person, snapshotId)
      processed++
      await storage.updateRun(runId, { processed })
    }
    if (processed === people.length) await storage.updateRun(runId, { checkpoint: 1 })
    await storage.updateRun(runId, {
      status: 'completed',
      processed,
      finishedAt: new Date().toISOString(),
    })
    return {
      runId,
      processed,
      available: people.length,
      coverage: processed === people.length ? 'observed-list' : 'partial',
    }
  } catch (error) {
    await storage.updateRun(runId, {
      status: options.signal.aborted ? 'cancelled' : 'failed',
      processed,
      errorCode: options.signal.aborted ? 'ABORTED' : 'INGESTION_FAILED',
      finishedAt: new Date().toISOString(),
    })
    throw error
  }
}
