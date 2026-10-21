import { createHash } from 'node:crypto'
import { connectDatabase } from '@civica/db'
import { LIST_URL, normalizeSenators } from '@civica/source-senado'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { syncSenado } from '../../apps/worker/src/senado'
import { requireLocal } from '../../scripts/local-only'
import fixture from '../fixtures/senado-current.json'

const date = '2026-10-21T12:00:00.000Z'
const text = JSON.stringify(fixture)
const hash = createHash('sha256').update(text).digest('hex')
const raw = {
  source: 'senado' as const,
  resource: 'senadores-atuais',
  externalId: 'atual',
  url: LIST_URL,
  text,
  hash,
  sourceHash: hash,
  redactedFields: [],
  fetchedAt: date,
}
describe.skipIf(process.env.LOCAL_INTEGRATION !== '1')('Senado no PostgreSQL local', () => {
  let writer: ReturnType<typeof connectDatabase>, reader: ReturnType<typeof connectDatabase>
  beforeAll(() => {
    writer = connectDatabase(requireLocal(process.env.DATABASE_URL, 'DATABASE_URL'))
    reader = connectDatabase(requireLocal(process.env.DATABASE_READ_URL, 'DATABASE_READ_URL'))
  })
  afterAll(async () => {
    await writer?.close()
    await reader?.close()
  })
  it('reexecuta worker com snapshots deduplicados, observações separadas e leitura da instituição correta', async () => {
    const source = { list: async () => raw }
    await syncSenado(writer, { limit: 100, signal: new AbortController().signal }, source)
    await syncSenado(writer, { limit: 100, signal: new AbortController().signal }, source)
    const normalized = normalizeSenators(fixture, date)
    for (const p of normalized) expect(await reader.repository().get(p.id)).toEqual(p)
    const [snapshots] =
      await writer.client`select count(*)::int as count from internal.raw_snapshots where source='senado' and content_hash=${hash}`
    expect(snapshots?.count).toBe(1)
    const [observations] =
      await writer.client`select count(*)::int as count from internal.raw_observations o join internal.raw_snapshots s on s.id=o.snapshot_id where s.source='senado' and s.content_hash=${hash}`
    expect(observations?.count).toBeGreaterThanOrEqual(2)
    const p = normalized[0]
    if (!p) throw new Error('FIXTURE_MISSING')
    const [parties] =
      await writer.client`select count(*)::int as count from civic.party_memberships where mandate_id=${`${p.id}:senado:${p.senateMandate?.externalId}`} and observed_until is null`
    expect(parties?.count).toBe(1)
    const list = await reader
      .repository()
      .list({ name: 'ana paula', uf: 'MA', page: 1, pageSize: 1 })
    expect(list.total).toBe(1)
    expect(list.items[0]?.institution).toBe('senado')
    const proposals = await reader
      .proposalsRepository()
      .list({ authorId: p.id, page: 1, pageSize: 3 })
    expect(proposals.total).toBe(0)
    await expect(reader.client`select * from internal.raw_snapshots`).rejects.toThrow()
    await expect(
      reader.client`update civic.mandates set senate_details=null where false`,
    ).rejects.toThrow()
  })
  it('replay antigo, resposta incompleta e falha não removem o último registro válido', async () => {
    const p = normalizeSenators(fixture, date)[1]
    if (!p) throw new Error('FIXTURE_MISSING')
    await writer.upsertRepresentative({
      ...p,
      name: 'Observação antiga',
      provenance: { ...p.provenance, fetchedAt: '2026-10-20T12:00:00.000Z' },
    })
    expect((await reader.repository().get(p.id))?.name).toBe(p.name)
    await syncSenado(
      writer,
      { limit: 1, signal: new AbortController().signal },
      { list: async () => raw },
    )
    expect(await reader.repository().get(p.id)).toEqual(p)
    await expect(
      syncSenado(
        writer,
        { limit: 100, signal: new AbortController().signal },
        {
          list: async () => {
            throw new Error('SOURCE_FAILED')
          },
        },
      ),
    ).rejects.toThrow()
    expect(await reader.repository().get(p.id)).toEqual(p)
    expect(await reader.repository().list({ name: 'acacio', page: 1, pageSize: 1 })).toMatchObject({
      items: [{ institution: 'camara' }],
    })
  })
})
