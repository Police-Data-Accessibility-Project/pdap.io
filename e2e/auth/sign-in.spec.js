import { expect } from '@playwright/test';
import { TEST_USERS } from 'e2e/fixtures/users';
import { TestIds } from 'e2e/fixtures/test-ids';
import { test } from '../fixtures/base';

import '../msw-setup.js';

/** Matches `/` or `/profile` at the end of a string */
const SIGN_IN_PATHS = /\/(profile)?$/;

test.describe('Authentication flows', () => {
  test('should sign in with email and password', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill(
      // TODO: in design-system, add a prop to forward test IDs to the input and REMOVE from the top-level div. Currently being added in both places.
      `input[data-test="${TestIds.email_input}"]`,
      TEST_USERS.PASSWORD_AUTH.email
    );
    await page.fill(
      `input[data-test="${TestIds.password_input}"]`,
      TEST_USERS.PASSWORD_AUTH.password
    );
    await page.click(`[data-test="${TestIds.submit_button}"]`);

    // Assert successful sign in
    await expect(page).toHaveURL(SIGN_IN_PATHS);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill(
      `input[data-test="${TestIds.email_input}"]`,
      'nonexistent@example.com'
    );
    await page.fill(
      `input[data-test="${TestIds.password_input}"]`,
      'wrongpassword'
    );
    await page.click(`[data-test="${TestIds.submit_button}"]`);

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

    await expect(
      page.locator(`[data-test="${TestIds.error_message}"]`)
    ).toContainText('There was an error logging you in with GitHub');
  });

  test('should handle existing user during GitHub auth', async ({ page }) => {
    // Simulate existing user case
    await page.goto('/sign-in?gh_access_token=existing-user-token');

    await expect(
      page.locator(`[data-test="${TestIds.error_message}"]`)
    ).toContainText('You already have an account with this email address');

    // Verify GitHub button is disabled
    const githubButton = page.locator(
      `[data-test="${TestIds.github_signin_button}"]`
    );
    await expect(githubButton).toBeDisabled();
  });
});
