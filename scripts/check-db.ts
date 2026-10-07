import { connectDatabase } from '@civica/db'
import { requireLocal } from './local-only'

const connection = connectDatabase(requireLocal(process.env.DATABASE_READ_URL, 'DATABASE_READ_URL'))
try {
  const [row] = await connection.client`select current_user as role, version() as version`
  console.log({ role: row?.role, version: row?.version })
  console.log({
    catalogCount: (await connection.repository().list({ name: '', page: 1, pageSize: 1 })).total,
  })
} finally {
  await connection.close()
}
