import { rm } from 'node:fs/promises'

const route = new URL('../apps/web/src/routes/boundary-probe.tsx', import.meta.url)
const workspace = new URL('../packages/ui/src/boundary-probe.ts', import.meta.url)
try {
  await Bun.write(
    workspace,
    "import { connectDatabase } from '@civica/db'\nexport const leak = connectDatabase\n",
  )
  await Bun.write(
    route,
    "import { createFileRoute } from '@tanstack/react-router'\nimport {leak} from '../../../../packages/ui/src/boundary-probe'\nexport const Route=createFileRoute('/boundary-probe')({component:()=> <div>{String(leak)}</div>})\n",
  )
  const child = Bun.spawn(['bun', 'run', '--cwd', 'apps/web', 'build'], {
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [stdout, stderr] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ])
  const code = await child.exited
  if (code === 0 || !`${stdout}${stderr}`.match(/import.protection|server.only|denied|forbidden/i))
    throw new Error('WORKSPACE_IMPORT_PROTECTION_NOT_CONFIRMED')
  console.log(
    'Proteção confirmada: import de banco através de pacote do workspace bloqueou o build do cliente.',
  )
} finally {
  await rm(route, { force: true })
  await rm(workspace, { force: true })
}
