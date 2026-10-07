import { camaraClient, listSchema, normalizeDeputy } from '@civica/source-camara'

const source = camaraClient()
const signal = AbortSignal.timeout(30000)
const raw = await source.list(1, 1, signal)
const record = listSchema.parse(JSON.parse(raw.text)).dados[0]
if (!record) throw new Error('EMPTY_SOURCE')
const detail = await source.detail(record.id, signal)
const normalized = normalizeDeputy(JSON.parse(detail.text), detail.fetchedAt)
console.log(
  JSON.stringify({
    source: normalized.provenance.source,
    externalId: normalized.provenance.externalId,
    schema: 'valid',
    fetchedAt: detail.fetchedAt,
  }),
)
