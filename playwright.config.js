import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? '50%' : '50%',
  reporter: 'html',
  testIgnore: process.env.E2E_TESTING_ENV === 'production' ? [ 'auth/sign-up.spec.js', '**/create.spec.js' ] : undefined, // exclude sign-up test from prod for now until we can decide on a strategy for cleaning up users created by the test
  use: {
    baseURL: process.env.E2E_TESTING_URL ?? 'http://localhost:8888',
    trace: 'on-first-retry'
  },
  webServer: process.env.E2E_TESTING_URL?.includes('pdap.') ? 
    undefined : 
    {
      command: 'npm run build:dev && npm run serve',
      url: 'http://localhost:8888',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000
    }
});
