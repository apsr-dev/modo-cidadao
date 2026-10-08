-- Public catalog through our server only. Personal grants/RLS are unchanged.
alter table internal.sync_runs add column resource text not null default 'deputados';
create table civic.proposals (
  id uuid primary key, source text not null check(source in ('camara','demo')),
  external_id text not null, type text not null, number integer not null check(number > 0),
  year integer not null check(year between 1900 and 2100), demo boolean not null,
  content jsonb not null, fetched_at timestamptz not null, revision_hash text not null,
  snapshot_id uuid references internal.raw_snapshots(id), unique(source,external_id),
  check ((source = 'demo') = demo), check (demo or snapshot_id is not null)
);
create index proposals_identifier on civic.proposals(type,year,number,id) where not demo;
create index proposals_order on civic.proposals(year desc,number desc,id) where not demo;
create table civic.proposal_authors (
  proposal_id uuid not null references civic.proposals(id), author_key text not null,
  deputy_external_id text, content jsonb not null,
  primary key(proposal_id,author_key)
);
create index proposal_authors_deputy on civic.proposal_authors(deputy_external_id,proposal_id);
-- Every changed source version is retained; current authors can be replaced atomically.
create table internal.proposal_revisions (
  id uuid primary key default gen_random_uuid(), proposal_id uuid not null references civic.proposals(id),
  revision_hash text not null, content jsonb not null, observed_at timestamptz not null,
  detail_snapshot_id uuid references internal.raw_snapshots(id),
  authors_snapshot_id uuid references internal.raw_snapshots(id),
  events_snapshot_id uuid references internal.raw_snapshots(id),
  unique(proposal_id,revision_hash)
);
revoke all on civic.proposals, civic.proposal_authors, internal.proposal_revisions from public, anon, authenticated;
grant select on civic.proposals, civic.proposal_authors to civica_reader;
grant select, insert, update on civic.proposals, civic.proposal_authors, internal.proposal_revisions to civica_ingest;
grant delete on civic.proposal_authors to civica_ingest;
revoke all on internal.proposal_revisions from civica_reader;
