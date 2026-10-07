import { defineConfig, devices } from '@playwright/test'

const integration = process.env.E2E_INTEGRATION === '1'
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command:
          process.env.E2E_PRODUCTION === '1'
            ? 'exec bun --cwd apps/web server.ts'
            : 'exec bun --cwd apps/web --bun vite dev --host 127.0.0.1 --port 3000',
        url: 'http://localhost:3000',
        reuseExistingServer: false,
        env: { DEMO_MODE: integration ? 'false' : 'true' },
        timeout: 60000,
      },
})
