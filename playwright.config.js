import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 1,
  timeout: 20_000,
  use: {
    baseURL: 'http://localhost:5173',
    // Mock mobile viewport like iPhone 14
    ...devices['iPhone 14'],
    // Don't open browser window
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
})
