import { connectDatabase } from '@civica/db'
import { createDemoProposals, reported } from '@civica/domain'
import { minimizeRaw, normalizeProposal, type RawResponse } from '@civica/source-camara'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { requireLocal } from '../../scripts/local-only'
import detail from '../fixtures/camara-proposal-2642134.json'
import authors from '../fixtures/camara-proposal-2642134-authors.json'
import events from '../fixtures/camara-proposal-2642134-events.json'

describe.skipIf(process.env.LOCAL_INTEGRATION !== '1')('propostas no PostgreSQL local', () => {
  let writer: ReturnType<typeof connectDatabase>,
    reader: ReturnType<typeof connectDatabase>,
    admin: ReturnType<typeof connectDatabase>
  const scratch = '00000000-0000-4000-9000-999999999999'
  beforeAll(() => {
    writer = connectDatabase(requireLocal(process.env.DATABASE_URL, 'DATABASE_URL'))
    reader = connectDatabase(requireLocal(process.env.DATABASE_READ_URL, 'DATABASE_READ_URL'))
    admin = connectDatabase(
      requireLocal(process.env.MIGRATION_DATABASE_URL, 'MIGRATION_DATABASE_URL'),
    )
  })
  afterAll(async () => {
    if (admin) {
      await admin.client`delete from civic.proposal_authors where proposal_id=${scratch}`
      await admin.client`delete from internal.proposal_revisions where proposal_id=${scratch}`
      await admin.client`delete from civic.proposals where id=${scratch}`
    }
    await writer?.close()
    await reader?.close()
    await admin?.close()
  })
  it('persiste fixture oficial, filtra e relaciona o autor por identificador da fonte', async () => {
    const raw = (payload: unknown, resource: RawResponse['resource']): RawResponse => ({
      resource,
      externalId: '2642134',
      url: `https://dadosabertos.camara.leg.br/api/v2/proposicoes/2642134`,
      fetchedAt: '2026-10-07T15:12:00.000Z',
      ...minimizeRaw(JSON.stringify(payload), resource),
    })
    const d = raw(detail, 'proposicao'),
      a = raw(authors, 'proposicao-autores'),
      e = raw(events, 'proposicao-tramitacoes')
    const snapshots = {
      detail: await writer.saveRaw(d),
      authors: await writer.saveRaw(a),
      events: await writer.saveRaw(e),
    }
    const normalized = normalizeProposal(d, a, e)
    await writer.upsertProposal(normalized.proposal, normalized.revisionHash, snapshots)
    await writer.upsertProposal(normalized.proposal, normalized.revisionHash, snapshots)
    const list = await reader
      .proposalsRepository()
      .list({ type: 'PL', year: 2026, number: 4916, page: 1, pageSize: 1 })
    expect(list.total).toBe(1)
    expect(list.items[0]?.id).toBe(normalized.proposal.id)
    expect(list.items[0]).not.toHaveProperty('events')
    const person = (
      await reader.repository().list({ name: 'Acácio Favacho', page: 1, pageSize: 1 })
    ).items[0]
    expect(person).toBeDefined()
    expect(
      (await reader.proposalsRepository().list({ authorId: person?.id, page: 1, pageSize: 1 }))
        .total,
    ).toBeGreaterThanOrEqual(1)
    expect(
      (await reader.proposalsRepository().get(normalized.proposal.id))?.authors[0]?.personId,
    ).toBe(person?.id)
    await expect(reader.client`select * from internal.proposal_revisions`).rejects.toThrow()
    await expect(
      reader.client`update civic.proposals set number=number where false`,
    ).rejects.toThrow()
  })
  it('retém a revisão anterior, não duplica replay e não aceita observação antiga', async () => {
    const original = createDemoProposals()[0]
    if (!original) throw new Error('MISSING_DEMO')
    const p = {
      ...original,
      id: scratch,
      provenance: { ...original.provenance, externalId: 'demo-test-revision' },
    }
    await writer.upsertProposal(p, 'test-v1')
    await writer.upsertProposal(p, 'test-v1')
    const corrected = {
      ...p,
      events: p.events.map((e) => ({ ...e, dispatch: reported('Retificação fictícia de teste') })),
      provenance: { ...p.provenance, fetchedAt: '2026-10-07T00:01:00.000Z' },
    }
    await writer.upsertProposal(corrected, 'test-v2')
    await writer.upsertProposal(p, 'test-v1')
    const revisions =
      await writer.client`select content from internal.proposal_revisions where proposal_id=${scratch} order by observed_at`
    expect(revisions).toHaveLength(2)
    expect(revisions[0]?.content.events[0].dispatch.value).toBe(p.events[0]?.dispatch.value)
    expect((await reader.proposalsRepository(true).get(scratch))?.events[0]?.dispatch.value).toBe(
      'Retificação fictícia de teste',
    )
    expect(await reader.proposalsRepository().get(scratch)).toBeNull()
  })
  it('falha de autores reverte a transação sem corromper a versão válida', async () => {
    const valid = await reader.proposalsRepository(true).get(scratch)
    if (!valid?.authors[0]) throw new Error('MISSING_SCRATCH')
    const invalid = {
      ...valid,
      title: 'Alteração fictícia que deve ser revertida',
      authors: [valid.authors[0], valid.authors[0]],
      provenance: { ...valid.provenance, fetchedAt: '2026-10-07T00:02:00.000Z' },
    }
    await expect(writer.upsertProposal(invalid, 'test-invalid')).rejects.toThrow()
    expect((await reader.proposalsRepository(true).get(scratch))?.title).toBe(valid.title)
    const rows =
      await writer.client`select count(*)::int as count from internal.proposal_revisions where proposal_id=${scratch}`
    expect(rows[0]?.count).toBe(2)
  })
})
