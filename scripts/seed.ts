import { connectDatabase } from '@civica/db'
import { demoPeople } from '@civica/domain'
import { requireLocal } from './local-only'

const connection = connectDatabase(requireLocal(process.env.DATABASE_URL, 'DATABASE_URL'))
try {
  for (const p of demoPeople) await connection.upsertRepresentative(p)
  console.log(
    `Seed determinístico: ${demoPeople.length} personagens fictícios. Catálogo oficial mantém demo=false.`,
  )
} finally {
  await connection.close()
}
