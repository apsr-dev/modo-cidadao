import '@tanstack/react-start/server-only'
import { z } from 'zod'

const schema = z.object({
  DEMO_MODE: z.enum(['true', 'false']).default('true'),
  DATABASE_READ_URL: z.url().optional(),
  SUPABASE_URL: z.url().optional(),
  SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  VITE_APP_URL: z.url().default('http://localhost:3000'),
})
export function serverEnv() {
  const result = schema.safeParse(process.env)
  if (!result.success) {
    console.error(
      'SERVER_CONFIGURATION_INVALID',
      result.error.issues.map((issue) => issue.path.join('.')),
    )
    throw new Error('SERVER_CONFIGURATION_INVALID')
  }
  const env = result.data
  if (
    env.DEMO_MODE === 'false' &&
    (!env.DATABASE_READ_URL || !env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY)
  ) {
    console.error(
      'SERVER_CONFIGURATION_INCOMPLETE',
      ['DATABASE_READ_URL', 'SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY'].filter(
        (key) => !process.env[key],
      ),
    )
    throw new Error('SERVER_CONFIGURATION_INCOMPLETE')
  }
  return env
}
