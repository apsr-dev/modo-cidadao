-- Sole migration chain. Catalog/ingestion roles never carry a citizen's identity.
create schema civic;
create schema internal;
revoke all on schema civic, internal from public, anon, authenticated;
create role civica_reader login nosuperuser nocreatedb nocreaterole noinherit nobypassrls;
create role civica_ingest login nosuperuser nocreatedb nocreaterole noinherit nobypassrls;
grant usage on schema civic to civica_reader, civica_ingest;
grant usage on schema internal to civica_ingest;

create table internal.raw_snapshots (
  id uuid primary key default gen_random_uuid(),
  source text not null, resource text not null, external_id text not null,
  resource_url text not null, content_hash text not null, body text not null,
  source_content_hash text not null, redacted_fields jsonb not null default '[]',
  fetched_at timestamptz not null,
  unique(source, resource, external_id, content_hash)
);
create table internal.raw_observations (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references internal.raw_snapshots(id),
  fetched_at timestamptz not null
);
create table internal.sync_runs (
  id uuid primary key default gen_random_uuid(), source text not null,
  status text not null check(status in ('running','completed','failed','cancelled')),
  started_at timestamptz not null default now(), finished_at timestamptz,
  processed integer not null default 0, checkpoint integer not null default 0,
  error_code text
);
create table civic.people (
  id uuid primary key, name text not null, civil_name jsonb not null,
  source text not null check(source in ('camara','demo')), external_id text not null,
  search_name text not null, demo boolean not null,
  official_url text, resource_url text, fetched_at timestamptz not null,
  normalizer_version text not null,
  snapshot_id uuid references internal.raw_snapshots(id),
  unique(source, external_id),
  check ((source = 'demo') = demo),
  check (demo or (snapshot_id is not null and official_url is not null and resource_url is not null))
);
create table civic.mandates (
  id text primary key, person_id uuid not null references civic.people(id),
  institution text not null, jurisdiction text not null, legislature text not null,
  status jsonb not null, observed_at timestamptz not null,
  unique(person_id,institution,legislature)
);
create index mandates_uf on civic.mandates(jurisdiction);
-- Observation history does not invent a legal start/end of party membership.
create table civic.party_memberships (
  id uuid primary key default gen_random_uuid(), mandate_id text not null references civic.mandates(id),
  party jsonb not null, observed_from timestamptz not null, observed_until timestamptz,
  snapshot_id uuid references internal.raw_snapshots(id)
);
create unique index one_current_party on civic.party_memberships(mandate_id) where observed_until is null;
create table civic.contacts (
  person_id uuid primary key references civic.people(id),
  email jsonb not null, phone jsonb not null, verified_at timestamptz not null
);
create table public.followed_people (
  user_id uuid not null references auth.users(id) on delete cascade,
  person_id uuid not null references civic.people(id),
  created_at timestamptz not null default now(), primary key(user_id,person_id)
);
alter table public.followed_people enable row level security;
revoke all on public.followed_people from public, anon, authenticated;
grant select, insert, delete on public.followed_people to authenticated;
create policy own_follows_select on public.followed_people for select to authenticated using ((select auth.uid()) = user_id);
create policy own_follows_insert on public.followed_people for insert to authenticated with check ((select auth.uid()) = user_id);
create policy own_follows_delete on public.followed_people for delete to authenticated using ((select auth.uid()) = user_id);
-- UPDATE is deliberately not granted: ownership cannot be reassigned.
grant select on all tables in schema civic to civica_reader;
grant select, insert, update on all tables in schema civic, internal to civica_ingest;
revoke all on all tables in schema internal from public, anon, authenticated, civica_reader;
