-- Existing rows remain explicitly not collected until a new official observation.
alter table civic.people
  add column photo jsonb not null default '{"state":"not_collected","value":null}'::jsonb;
