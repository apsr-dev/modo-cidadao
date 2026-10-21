// Isolate ephemeral CI containers and ports; never rewrite development configuration locally.
export {}

const runId = process.env.GITHUB_RUN_ID ?? ''
const attempt = process.env.GITHUB_RUN_ATTEMPT ?? ''
if (process.env.GITHUB_ACTIONS !== 'true' || !/^\d+$/.test(runId) || !/^\d+$/.test(attempt))
  throw new Error('CI_DATABASE_CONFIGURATION_ONLY')

const path = new URL('../supabase/config.toml', import.meta.url)
const config = await Bun.file(path).text()
const reservations: Array<{ stop(): void }> = []
try {
  const isolated = config
    .replace(/^project_id = "[^"\n]+"$/m, `project_id = "modo-cidadao-ci-${runId}-${attempt}"`)
    .replace(/^(\s*(?:port|shadow_port|inspector_port)\s*=\s*)\d+$/gm, (_, prefix: string) => {
      const listener = Bun.listen({
        hostname: '127.0.0.1',
        port: 0,
        socket: { data() {} },
      })
      reservations.push(listener)
      return `${prefix}${listener.port}`
    })
  // Hold every reservation until all ports are selected, preventing duplicates within this run.
  if (reservations.length === 0 || isolated === config)
    throw new Error('CI_DATABASE_CONFIG_INVALID')
  await Bun.write(path, isolated)
} finally {
  for (const listener of reservations) listener.stop()
}
console.log('Supabase CI isolado por execução, com portas locais disponíveis; sem credenciais.')
