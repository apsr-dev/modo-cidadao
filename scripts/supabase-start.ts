// Supabase CLI emits credentials on success; keep them out of terminal logs.
export {}

const child = Bun.spawn(['bun', '--bun', 'supabase', 'start'], { stdout: 'pipe', stderr: 'pipe' })
const [stdout, stderr] = await Promise.all([
  new Response(child.stdout).text(),
  new Response(child.stderr).text(),
])
const code = await child.exited
if (code !== 0) {
  // Exclude any line that might contain credentials or URLs with passwords.
  const safe = `${stdout}\n${stderr}`
    .split('\n')
    .filter((line) => !/key|secret|token|password|postgres(?:ql)?:\/\//i.test(line))
    .slice(-15)
    .join('\n')
  console.error(safe || 'SUPABASE_LOCAL_START_FAILED')
  process.exit(code)
}
console.log(
  'Supabase local iniciado. Execute bun run db:env para gravar a configuração privada em .env.',
)
