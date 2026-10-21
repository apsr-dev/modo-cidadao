-- Preserve existing identities and grants; the Senate uses its own source namespace.
alter table civic.people drop constraint people_source_check;
alter table civic.people add constraint people_source_check check (source in ('camara', 'senado', 'demo'));
alter table civic.mandates add column senate_details jsonb;
alter table civic.mandates add constraint mandates_institution_check check (institution in ('camara', 'senado'));
