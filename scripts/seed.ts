import { connectDatabase } from '@civica/db'
import { createDemoProposals, demoPeople } from '@civica/domain'
import { requireLocal } from './local-only'

const connection = connectDatabase(requireLocal(process.env.DATABASE_URL, 'DATABASE_URL'))
try {
  for (const p of demoPeople) await connection.upsertRepresentative(p)
  for (const p of createDemoProposals())
    await connection.upsertProposal(p, `demo-proposal-${p.number}-1`)
  console.log(
    `Seed determinístico: ${demoPeople.length} personagens e 8 propostas fictícias. Catálogo oficial mantém demo=false.`,
  )
} finally {
  await connection.close()
}
