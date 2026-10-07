import '@tanstack/react-start/server-only'
import { connectDatabase } from '@civica/db'
import { memoryProposals, memoryRepresentatives, proposals, representatives } from '@civica/domain'
import { serverEnv } from './env.server'

let connection: ReturnType<typeof connectDatabase> | undefined
export function catalogRepository() {
  const env = serverEnv()
  if (env.DEMO_MODE === 'true') return memoryRepresentatives()
  connection ??= connectDatabase(env.DATABASE_READ_URL ?? '')
  return connection.repository()
}
export const catalog = () => representatives(catalogRepository())
export function proposalsRepository() {
  const env = serverEnv()
  if (env.DEMO_MODE === 'true') return memoryProposals()
  connection ??= connectDatabase(env.DATABASE_READ_URL ?? '')
  return connection.proposalsRepository()
}
export const proposalCatalog = () => proposals(proposalsRepository())
