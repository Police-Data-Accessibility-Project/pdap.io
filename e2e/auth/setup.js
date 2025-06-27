import { test as setup, expect } from '@playwright/test';
import { TEST_USERS } from 'e2e/fixtures/users';
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await page.goto('/sign-in');
  // TODO: how to make dynamic for different users?
  await page.fill('[name="email"]', TEST_USERS.PASSWORD_AUTH.email);
  await page.fill('[name="password"]', TEST_USERS.PASSWORD_AUTH.password);
  await page.click('button[type="submit"]');

  // Wait for authentication to complete
  await expect(page).toHaveURL('/dashboard');

  // Save signed-in state
  await page.context().storageState({ path: authFile });
});
