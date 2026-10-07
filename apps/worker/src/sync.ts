import type { connectDatabase } from '@civica/db'
import { camaraClient, listSchema, normalizeDeputy, type RawResponse } from '@civica/source-camara'
export interface SyncOptions {
  maxPages: number
  pageSize: number
  limit: number
  signal: AbortSignal
}
type Storage = Pick<
  ReturnType<typeof connectDatabase>,
  'saveRaw' | 'upsertRepresentative' | 'startRun' | 'updateRun'
>
export async function syncCamara(storage: Storage, options: SyncOptions, source = camaraClient()) {
  const runId = await storage.startRun()
  let processed = 0
  try {
    for (let page = 1; page <= options.maxPages && processed < options.limit; page++) {
      options.signal.throwIfAborted()
      const raw = await source.list(page, options.pageSize, options.signal)
      await storage.saveRaw(raw)
      const parsed = listSchema.parse(JSON.parse(raw.text))
      if (!parsed.dados.length) break
      let pageProcessed = 0
      for (const record of parsed.dados) {
        if (processed >= options.limit) break
        options.signal.throwIfAborted()
        const detail: RawResponse = await source.detail(record.id, options.signal)
        const snapshotId = await storage.saveRaw(detail)
        const normalized = normalizeDeputy(JSON.parse(detail.text), detail.fetchedAt)
        if (normalized.provenance.externalId !== String(record.id))
          throw new Error('SOURCE_ID_MISMATCH')
        await storage.upsertRepresentative(normalized, snapshotId)
        processed++
        pageProcessed++
        await storage.updateRun(runId, { processed })
      }
      // Only a fully persisted page can advance its checkpoint.
      if (pageProcessed === parsed.dados.length)
        await storage.updateRun(runId, { checkpoint: page })
      if (!parsed.links.some((link) => link.rel === 'next')) break
    }
    await storage.updateRun(runId, {
      status: 'completed',
      processed,
      finishedAt: new Date().toISOString(),
    })
    return { runId, processed }
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
