import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.E2E_TESTING_URL ?? 'http://localhost:8888',
    trace: 'on-first-retry',
  },
  webServer: process.env.E2E_TESTING_URL && 
    process.env.E2E_TESTING_URL !== 'http://localhost:8888' ? 
    undefined : {
    command: 'npm run dev',
    url: 'http://localhost:8888',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
