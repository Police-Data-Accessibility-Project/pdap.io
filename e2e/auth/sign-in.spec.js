import { expect } from '@playwright/test';
import { TEST_USERS } from 'e2e/fixtures/users';
import { test } from '../fixtures/base';

import '../msw-setup.js';

/** Matches `/` or `/profile` at the end of a string */
const SIGN_IN_PATHS = /\/(profile)?$/;

test.describe('Authentication flows', () => {
  test('should sign in with email and password', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('[name="email"]', TEST_USERS.PASSWORD_AUTH.email);
    await page.fill('[name="password"]', TEST_USERS.PASSWORD_AUTH.password);
    await page.click('button[type="submit"]');

    // Assert successful sign in
    await expect(page).toHaveURL(SIGN_IN_PATHS);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('[name="email"]', 'nonexistent@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.pdap-form-error-message')).toContainText(
      'Error logging in.'
    );
  });

  test('should sign in with GitHub', async ({ page }) => {
    await page.goto('/sign-in?gh_access_token=mock-token-123');
    await expect(page).toHaveURL(SIGN_IN_PATHS, { timeout: 10000 });
  });

  test('should show error for GitHub auth failure', async ({ page }) => {
    // Simulate failed GitHub auth by directly accessing with invalid token
    await page.goto('/sign-in?gh_access_token=invalid-token');

    await expect(page.locator('.error')).toContainText(
      'There was an error logging you in with GitHub'
    );
  });

  test('should handle existing user during GitHub auth', async ({ page }) => {
    // Simulate existing user case
    await page.goto('/sign-in?gh_access_token=existing-user-token');

    await expect(page.locator('.error')).toContainText(
      'You already have an account with this email address'
    );

    // Verify GitHub button is disabled
    const githubButton = page.locator('button:has-text("Sign in with GitHub")');
    await expect(githubButton).toBeDisabled();
  });
});
