import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? '100%' : '50%',
  reporter: 'html',
  use: {
    baseURL: process.env.E2E_TESTING_URL ?? 'http://localhost:8888',
    trace: 'on-first-retry'
  },
  webServer: process.env.E2E_TESTING_URL ? 
    undefined : 
    {
      command: 'npm run build && npm run serve',
      url: 'http://localhost:8888',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000
    }
});
