-- Every observation retains the received response hash, even when CPF removal
-- makes two source responses share one deduplicated stored snapshot.
alter table internal.raw_observations add column source_content_hash text;
update internal.raw_observations as observation
set source_content_hash = snapshot.source_content_hash
from internal.raw_snapshots as snapshot
where snapshot.id = observation.snapshot_id;
alter table internal.raw_observations alter column source_content_hash set not null;
