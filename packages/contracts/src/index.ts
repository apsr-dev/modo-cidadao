import { z } from 'zod'
export const ufs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const
export const filtersSchema = z.object({
  name: z.string().trim().max(100).default(''),
  uf: z.preprocess((value) => (value === '' ? undefined : value), z.enum(ufs).optional()),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(24),
})
export const personIdSchema = z.uuid()
export const credentialsSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(10).max(128),
})
export const followSchema = z.object({ personId: personIdSchema, follow: z.boolean() })
export const publicEnvSchema = z.object({
  VITE_APP_NAME: z.string().min(1).max(60).default('Plataforma Cívica'),
  VITE_APP_URL: z.url().default('http://localhost:3000'),
})
export type { DataValue, Page, Representative, RepresentativeFilters } from '@civica/domain'
