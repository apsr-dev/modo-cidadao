import { fold, type Representative, type RepresentativesRepository } from '@civica/domain'
import { and, asc, count, eq, isNull, like, not, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { proposalStore } from './proposals'
import {
  contacts,
  mandates,
  partyMemberships,
  people,
  rawObservations,
  rawSnapshots,
  syncRuns,
} from './schema'

export * as schema from './schema'
export function connectDatabase(url: string) {
  if (!url) throw new Error('DATABASE_URL_REQUIRED')
  const client = postgres(url, {
    prepare: false,
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10,
    onnotice: () => {},
  })
  const db = drizzle(client)
  const join = () =>
    db
      .select({
        person: people,
        mandate: mandates,
        membership: partyMemberships,
        contact: contacts,
      })
      .from(people)
      .innerJoin(
        mandates,
        and(
          eq(people.id, mandates.personId),
          sql`${mandates.id} = (select m.id from civic.mandates m where m.person_id = ${people.id} order by m.observed_at desc, m.id desc limit 1)`,
        ),
      )
      .innerJoin(
        partyMemberships,
        and(eq(mandates.id, partyMemberships.mandateId), isNull(partyMemberships.observedUntil)),
      )
      .innerJoin(contacts, eq(people.id, contacts.personId))
  type Row = Awaited<ReturnType<typeof join>>[number]
  const dto = ({ person: p, mandate: m, membership, contact: c }: Row): Representative => ({
    id: p.id,
    name: p.name,
    civilName: p.civilName,
    uf: m.jurisdiction,
    legislature: m.legislature,
    institution: 'camara',
    party: membership.party,
    status: m.status,
    email: c.email,
    phone: c.phone,
    demo: p.demo,
    provenance: {
      source: p.source,
      externalId: p.externalId,
      officialUrl: p.officialUrl,
      resourceUrl: p.resourceUrl,
      fetchedAt: new Date(p.fetchedAt).toISOString(),
      normalizerVersion: p.normalizerVersion,
    },
  })
  function repository(includeDemo = false): RepresentativesRepository {
    return {
      async get(id) {
        const [row] = await join().where(
          and(eq(people.id, id), includeDemo ? undefined : not(people.demo)),
        )
        return row ? dto(row) : null
      },
      async list(filters) {
        const name = fold(filters.name).replace(/[\\%_]/g, '\\$&')
        const predicate = and(
          includeDemo ? undefined : not(people.demo),
          filters.uf ? eq(mandates.jurisdiction, filters.uf) : undefined,
          name ? like(people.searchName, `%${name}%`) : undefined,
        )
        const rows = await join()
          .where(predicate)
          .orderBy(asc(people.name), asc(people.id))
          .limit(filters.pageSize)
          .offset((filters.page - 1) * filters.pageSize)
        const [totalRow] = await db
          .select({ total: count() })
          .from(join().where(predicate).as('filtered'))
        const total = totalRow?.total ?? 0
        return {
          items: rows.map(dto),
          total,
          page: filters.page,
          pageSize: filters.pageSize,
          pages: Math.ceil(total / filters.pageSize),
        }
      },
    }
  }
  async function saveRaw(raw: {
    resource: string
    externalId: string
    url: string
    hash: string
    sourceHash: string
    redactedFields: string[]
    text: string
    fetchedAt: string
  }) {
    return db.transaction(async (tx) => {
      const [saved] = await tx
        .insert(rawSnapshots)
        .values({
          source: 'camara',
          resource: raw.resource,
          externalId: raw.externalId,
          resourceUrl: raw.url,
          contentHash: raw.hash,
          sourceContentHash: raw.sourceHash,
          redactedFields: raw.redactedFields,
          body: raw.text,
          fetchedAt: raw.fetchedAt,
        })
        .onConflictDoUpdate({
          target: [
            rawSnapshots.source,
            rawSnapshots.resource,
            rawSnapshots.externalId,
            rawSnapshots.contentHash,
          ],
          set: { contentHash: raw.hash },
        })
        .returning({ id: rawSnapshots.id })
      if (!saved) throw new Error('RAW_NOT_PERSISTED')
      await tx.insert(rawObservations).values({
        snapshotId: saved.id,
        fetchedAt: raw.fetchedAt,
        sourceContentHash: raw.sourceHash,
      })
      return saved.id
    })
  }
  async function upsertRepresentative(p: Representative, snapshotId: string | null = null) {
    await db.transaction(async (tx) => {
      // Serialize updates of one source identity; replays cannot create concurrent current affiliations.
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${p.id}, 0))`)
      const [existing] = await tx
        .select({ fetchedAt: people.fetchedAt })
        .from(people)
        .where(eq(people.id, p.id))
      if (existing && Date.parse(existing.fetchedAt) > Date.parse(p.provenance.fetchedAt)) return
      const values = {
        id: p.id,
        name: p.name,
        civilName: p.civilName,
        searchName: fold(`${p.name} ${p.civilName.value ?? ''}`),
        source: p.provenance.source,
        externalId: p.provenance.externalId,
        demo: p.demo,
        officialUrl: p.provenance.officialUrl,
        resourceUrl: p.provenance.resourceUrl,
        fetchedAt: p.provenance.fetchedAt,
        normalizerVersion: p.provenance.normalizerVersion,
        snapshotId,
      }
      await tx.insert(people).values(values).onConflictDoUpdate({ target: people.id, set: values })
      const mandateId = `${p.id}:camara:${p.legislature}`
      const mandate = {
        id: mandateId,
        personId: p.id,
        institution: p.institution,
        jurisdiction: p.uf,
        legislature: p.legislature,
        status: p.status,
        observedAt: p.provenance.fetchedAt,
      }
      await tx
        .insert(mandates)
        .values(mandate)
        .onConflictDoUpdate({ target: mandates.id, set: mandate })
      const [previous] = await tx
        .select()
        .from(partyMemberships)
        .where(
          and(eq(partyMemberships.mandateId, mandateId), isNull(partyMemberships.observedUntil)),
        )
      if (
        !previous ||
        previous.party.state !== p.party.state ||
        previous.party.value !== p.party.value
      ) {
        if (previous)
          await tx
            .update(partyMemberships)
            .set({ observedUntil: p.provenance.fetchedAt })
            .where(eq(partyMemberships.id, previous.id))
        await tx
          .insert(partyMemberships)
          .values({ mandateId, party: p.party, observedFrom: p.provenance.fetchedAt, snapshotId })
      }
      const contact = {
        personId: p.id,
        email: p.email,
        phone: p.phone,
        verifiedAt: p.provenance.fetchedAt,
      }
      await tx
        .insert(contacts)
        .values(contact)
        .onConflictDoUpdate({ target: contacts.personId, set: contact })
    })
  }
  return {
    proposalsRepository: proposalStore(db).repository,
    upsertProposal: proposalStore(db).upsertProposal,
    db,
    client,
    repository,
    saveRaw,
    upsertRepresentative,
    async startRun(resource = 'deputados') {
      const [r] = await db
        .insert(syncRuns)
        .values({ source: 'camara', resource, status: 'running' })
        .returning({ id: syncRuns.id })
      if (!r) throw new Error('RUN_NOT_CREATED')
      return r.id
    },
    async updateRun(id: string, values: Partial<typeof syncRuns.$inferInsert>) {
      await db.update(syncRuns).set(values).where(eq(syncRuns.id, id))
    },
    close: () => client.end({ timeout: 5 }),
  }
}

export type { PersonalDatabase } from './personal-schema'
