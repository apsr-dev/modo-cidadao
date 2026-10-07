const directory = new URL('../apps/web/dist/client', import.meta.url).pathname
const markers = [
  'DATABASE_URL',
  'DATABASE_READ_URL',
  'SUPABASE_SECRET_KEY',
  'MIGRATION_DATABASE_URL',
  'SERVER_CONFIGURATION_INCOMPLETE',
  'postgres://',
  'postgresql://',
  'internal.raw_snapshots',
  'civica_ingest',
]
const secrets = [
  process.env.DATABASE_URL,
  process.env.DATABASE_READ_URL,
  process.env.SUPABASE_SECRET_KEY,
].filter((s): s is string => !!s && s.length > 12)
let checked = 0
for await (const path of new Bun.Glob('**/*.{js,html,map}').scan({
  cwd: directory,
  absolute: true,
})) {
  const text = await Bun.file(path).text()
  if ([...markers, ...secrets].some((marker) => text.includes(marker)))
    throw new Error('CLIENT_BUNDLE_SERVER_DATA_DETECTED')
  checked++
}
if (!checked) throw new Error('CLIENT_BUILD_MISSING')
console.log(
  `Bundle do navegador inspecionado: ${checked} arquivos; sem marcadores de banco ou segredos configurados.`,
)
