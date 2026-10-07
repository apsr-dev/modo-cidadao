import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Vite's envDir feeds import.meta.env; private process.env also needs explicit loading
// when the workspace is launched by a task runner from apps/web.
const localEnv = loadEnv(
  process.env.NODE_ENV ?? 'development',
  fileURLToPath(new URL('../..', import.meta.url)),
  '',
)
for (const key of [
  'DEMO_MODE',
  'DATABASE_READ_URL',
  'SUPABASE_URL',
  'SUPABASE_PUBLISHABLE_KEY',
  'VITE_APP_URL',
]) {
  if (localEnv[key] !== undefined) process.env[key] ??= localEnv[key]
}
export default defineConfig({
  envDir: '../..',
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [
    tailwindcss(),
    tanstackStart({
      importProtection: {
        behavior: 'error',
        include: ['**/apps/web/src/**', '**/packages/**'],
        client: {
          specifiers: [
            '@civica/db',
            '@civica/source-camara',
            'postgres',
            'drizzle-orm',
            '@supabase/ssr',
          ],
          files: ['**/*.server.*', '**/packages/db/**', '**/packages/source-camara/**'],
        },
      },
    }),
    react(),
  ],
})
