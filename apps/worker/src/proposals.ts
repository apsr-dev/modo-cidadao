import type { connectDatabase } from '@civica/db'
import { camaraClient, listSchema, normalizeProposal } from '@civica/source-camara'
import type { SyncOptions } from './sync'

type Storage = Pick<
  ReturnType<typeof connectDatabase>,
  'saveRaw' | 'upsertProposal' | 'startRun' | 'updateRun'
>
export interface ProposalSyncOptions extends SyncOptions {
  year: number
  type?: string
  number?: number
  deputy?: number
}
export async function syncProposals(
  storage: Storage,
  options: ProposalSyncOptions,
  source: Pick<
    ReturnType<typeof camaraClient>,
    'proposals' | 'proposal' | 'authors' | 'events'
  > = camaraClient(),
) {
  const runId = await storage.startRun('proposicoes')
  let processed = 0
  try {
    const firstPage = options.startPage ?? 1
    for (
      let page = firstPage;
      page < firstPage + options.maxPages && processed < options.limit;
      page++
    ) {
      options.signal.throwIfAborted()
      const list = await source.proposals(page, options.pageSize, options, options.signal)
      await storage.saveRaw(list)
      const parsed = listSchema.parse(JSON.parse(list.text))
      if (!parsed.dados.length) break
      let pageProcessed = 0
      for (const record of parsed.dados) {
        if (processed >= options.limit) break
        options.signal.throwIfAborted()
        const detail = await source.proposal(record.id, options.signal)
        const detailId = await storage.saveRaw(detail)
        const authors = await source.authors(record.id, options.signal)
        const authorsId = await storage.saveRaw(authors)
        const events = await source.events(record.id, options.signal)
        const eventsId = await storage.saveRaw(events)
        const normalized = normalizeProposal(detail, authors, events)
        await storage.upsertProposal(normalized.proposal, normalized.revisionHash, {
          detail: detailId,
          authors: authorsId,
          events: eventsId,
        })
        processed++
        pageProcessed++
        await storage.updateRun(runId, { processed })
      }
      if (pageProcessed === parsed.dados.length)
        await storage.updateRun(runId, { checkpoint: page })
      if (!parsed.links.some((l) => l.rel === 'next')) break
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
