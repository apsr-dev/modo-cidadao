import type { Proposal, ProposalFilters, ProposalsRepository } from '@civica/domain'
import { and, asc, count, desc, eq, inArray, not, sql } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { people, proposalAuthors, proposalRecords, proposalRevisions } from './schema'

export function proposalStore(db: PostgresJsDatabase<Record<string, never>>) {
  async function linkAuthors(rows: Proposal[]) {
    const ids = [
      ...new Set(
        rows.flatMap((p) =>
          p.authors.flatMap((a) => (a.deputyExternalId ? [a.deputyExternalId] : [])),
        ),
      ),
    ]
    const matches = ids.length
      ? await db
          .select({ id: people.id, externalId: people.externalId })
          .from(people)
          .where(
            and(eq(people.source, 'camara'), not(people.demo), inArray(people.externalId, ids)),
          )
      : []
    const map = new Map(matches.map((p) => [p.externalId, p.id]))
    return rows.map((p) => ({
      ...p,
      authors: p.authors.map((a) => ({
        ...a,
        personId: p.demo ? a.personId : (map.get(a.deputyExternalId ?? '') ?? null),
      })),
    }))
  }
  function repository(includeDemo = false): ProposalsRepository {
    return {
      async get(id) {
        const [row] = await db
          .select({ content: proposalRecords.content })
          .from(proposalRecords)
          .where(
            and(eq(proposalRecords.id, id), includeDemo ? undefined : not(proposalRecords.demo)),
          )
        return row ? ((await linkAuthors([row.content]))[0] ?? null) : null
      },
      async list(filters: ProposalFilters) {
        const predicate = and(
          includeDemo ? undefined : not(proposalRecords.demo),
          filters.type ? eq(proposalRecords.type, filters.type) : undefined,
          filters.number ? eq(proposalRecords.number, filters.number) : undefined,
          filters.year ? eq(proposalRecords.year, filters.year) : undefined,
          filters.authorId
            ? sql`exists(select 1 from civic.proposal_authors pa join civic.people person on person.source='camara' and person.external_id=pa.deputy_external_id where pa.proposal_id=${proposalRecords.id} and person.id=${filters.authorId})`
            : undefined,
        )
        const [rows, totals] = await Promise.all([
          db
            .select({ content: proposalRecords.content })
            .from(proposalRecords)
            .where(predicate)
            .orderBy(
              desc(proposalRecords.year),
              desc(proposalRecords.number),
              asc(proposalRecords.id),
            )
            .limit(filters.pageSize)
            .offset((filters.page - 1) * filters.pageSize),
          db.select({ total: count() }).from(proposalRecords).where(predicate),
        ])
        const items = (await linkAuthors(rows.map((r) => r.content))).map(
          ({
            events: _events,
            authorsCollectedAt: _authorsAt,
            eventsCollectedAt: _eventsAt,
            ...summary
          }) => summary,
        )
        const total = totals[0]?.total ?? 0
        return {
          items,
          total,
          page: filters.page,
          pageSize: filters.pageSize,
          pages: Math.ceil(total / filters.pageSize),
        }
      },
    }
  }
  async function upsertProposal(
    p: Proposal,
    revisionHash: string,
    snapshots: { detail: string; authors: string; events: string } | null = null,
  ) {
    await db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${p.id}, 0))`)
      const [existing] = await tx
        .select({ at: proposalRecords.fetchedAt })
        .from(proposalRecords)
        .where(eq(proposalRecords.id, p.id))
      if (existing && Date.parse(existing.at) > Date.parse(p.provenance.fetchedAt)) return
      const values = {
        id: p.id,
        source: p.provenance.source,
        externalId: p.provenance.externalId,
        type: p.type,
        number: p.number,
        year: p.year,
        demo: p.demo,
        content: p,
        fetchedAt: p.provenance.fetchedAt,
        revisionHash,
        snapshotId: snapshots?.detail ?? null,
      }
      await tx
        .insert(proposalRecords)
        .values(values)
        .onConflictDoUpdate({ target: proposalRecords.id, set: values })
      await tx
        .insert(proposalRevisions)
        .values({
          proposalId: p.id,
          revisionHash,
          content: p,
          observedAt: p.provenance.fetchedAt,
          detailSnapshotId: snapshots?.detail,
          authorsSnapshotId: snapshots?.authors,
          eventsSnapshotId: snapshots?.events,
        })
        .onConflictDoNothing()
      await tx.delete(proposalAuthors).where(eq(proposalAuthors.proposalId, p.id))
      if (p.authors.length)
        await tx.insert(proposalAuthors).values(
          p.authors.map((a) => ({
            proposalId: p.id,
            authorKey: a.id,
            deputyExternalId: a.deputyExternalId,
            content: a,
          })),
        )
    })
  }
  return { repository, upsertProposal }
}
