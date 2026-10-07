import type { DataValue } from '@civica/domain'
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
  status: text().notNull(),
  startedAt: instant('started_at').defaultNow().notNull(),
  finishedAt: instant('finished_at'),
  processed: integer().default(0).notNull(),
  checkpoint: integer().default(0).notNull(),
  errorCode: text('error_code'),
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
