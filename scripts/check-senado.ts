import { normalizeSenators, senadoClient } from '@civica/source-senado'

const raw = await senadoClient().list(AbortSignal.timeout(45000))
const people = normalizeSenators(JSON.parse(raw.text), raw.fetchedAt)
console.log(
  JSON.stringify({
    source: 'senado',
    schema: 'valid',
    serviceVersion: '4',
    observed: people.length,
    fetchedAt: raw.fetchedAt,
    pagination: 'none',
  }),
)
