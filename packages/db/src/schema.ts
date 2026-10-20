import type { DataValue, Proposal, ProposalAuthor } from '@civica/domain'
import {
  boolean,
  integer,
  jsonb,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

const civic = pgSchema('civic')
const internal = pgSchema('internal')
const instant = (name: string) => timestamp(name, { withTimezone: true, mode: 'string' })
export const rawSnapshots = internal.table('raw_snapshots', {
  id: uuid().primaryKey().defaultRandom(),
  source: text().notNull(),
  resource: text().notNull(),
  externalId: text('external_id').notNull(),
  resourceUrl: text('resource_url').notNull(),
  contentHash: text('content_hash').notNull(),
  sourceContentHash: text('source_content_hash').notNull(),
  redactedFields: jsonb('redacted_fields').$type<string[]>().notNull(),
  body: text().notNull(),
  fetchedAt: instant('fetched_at').notNull(),
})
export const rawObservations = internal.table('raw_observations', {
  id: uuid().primaryKey().defaultRandom(),
  snapshotId: uuid('snapshot_id')
    .notNull()
    .references(() => rawSnapshots.id),
  fetchedAt: instant('fetched_at').notNull(),
  sourceContentHash: text('source_content_hash').notNull(),
})
export const syncRuns = internal.table('sync_runs', {
  id: uuid().primaryKey().defaultRandom(),
  source: text().notNull(),
  resource: text().notNull().default('deputados'),
  status: text().notNull(),
  startedAt: instant('started_at').defaultNow().notNull(),
  finishedAt: instant('finished_at'),
  processed: integer().default(0).notNull(),
  checkpoint: integer().default(0).notNull(),
  errorCode: text('error_code'),
})
export const proposalRecords = civic.table('proposals', {
  id: uuid().primaryKey(),
  source: text().$type<'camara' | 'demo'>().notNull(),
  externalId: text('external_id').notNull(),
  type: text().notNull(),
  number: integer().notNull(),
  year: integer().notNull(),
  demo: boolean().notNull(),
  content: jsonb().$type<Proposal>().notNull(),
  fetchedAt: instant('fetched_at').notNull(),
  revisionHash: text('revision_hash').notNull(),
  snapshotId: uuid('snapshot_id').references(() => rawSnapshots.id),
})
export const proposalAuthors = civic.table(
  'proposal_authors',
  {
    proposalId: uuid('proposal_id')
      .notNull()
      .references(() => proposalRecords.id),
    authorKey: text('author_key').notNull(),
    deputyExternalId: text('deputy_external_id'),
    content: jsonb().$type<ProposalAuthor>().notNull(),
  },
  (table) => [primaryKey({ columns: [table.proposalId, table.authorKey] })],
)
export const proposalRevisions = internal.table('proposal_revisions', {
  id: uuid().primaryKey().defaultRandom(),
  proposalId: uuid('proposal_id')
    .notNull()
    .references(() => proposalRecords.id),
  revisionHash: text('revision_hash').notNull(),
  content: jsonb().$type<Proposal>().notNull(),
  observedAt: instant('observed_at').notNull(),
  detailSnapshotId: uuid('detail_snapshot_id').references(() => rawSnapshots.id),
  authorsSnapshotId: uuid('authors_snapshot_id').references(() => rawSnapshots.id),
  eventsSnapshotId: uuid('events_snapshot_id').references(() => rawSnapshots.id),
})
export const people = civic.table('people', {
  id: uuid().primaryKey(),
  name: text().notNull(),
  civilName: jsonb('civil_name').$type<DataValue>().notNull(),
  source: text().$type<'demo' | 'camara'>().notNull(),
  externalId: text('external_id').notNull(),
  searchName: text('search_name').notNull(),
  demo: boolean().notNull(),
  officialUrl: text('official_url'),
  resourceUrl: text('resource_url'),
  fetchedAt: instant('fetched_at').notNull(),
  normalizerVersion: text('normalizer_version').notNull(),
  snapshotId: uuid('snapshot_id').references(() => rawSnapshots.id),
})
export const mandates = civic.table('mandates', {
  id: text().primaryKey(),
  personId: uuid('person_id')
    .notNull()
    .references(() => people.id),
  institution: text().notNull(),
  jurisdiction: text().notNull(),
  legislature: text().notNull(),
  status: jsonb().$type<DataValue>().notNull(),
  observedAt: instant('observed_at').notNull(),
})
export const partyMemberships = civic.table('party_memberships', {
  id: uuid().primaryKey().defaultRandom(),
  mandateId: text('mandate_id')
    .notNull()
    .references(() => mandates.id),
  party: jsonb().$type<DataValue>().notNull(),
  observedFrom: instant('observed_from').notNull(),
  observedUntil: instant('observed_until'),
  snapshotId: uuid('snapshot_id').references(() => rawSnapshots.id),
})
export const contacts = civic.table('contacts', {
  personId: uuid('person_id')
    .primaryKey()
    .references(() => people.id),
  email: jsonb().$type<DataValue>().notNull(),
  phone: jsonb().$type<DataValue>().notNull(),
  verifiedAt: instant('verified_at').notNull(),
})
export const followedPeople = pgTable(
  'followed_people',
  {
    userId: uuid('user_id').notNull(),
    personId: uuid('person_id')
      .notNull()
      .references(() => people.id),
    createdAt: instant('created_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.personId] })],
)
