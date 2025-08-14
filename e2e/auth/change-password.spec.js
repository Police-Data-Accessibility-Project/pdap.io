const { expect } = require('@playwright/test');
const { test } = require('../fixtures/base');
const { PASSWORD_AUTH } = require('../fixtures/users');
const { TEST_IDS } = require('../fixtures/test-ids');
require('../msw-setup.js');

test.describe('Change password flow', () => {
  /** Skipping for now, because user password state (which does not match our validation schema) is reset nightly :( */
  test.skip('should change password successfully', async ({ page }) => {
    // Step 1: Sign in first
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');

    await page.fill(
      `input[data-test="${TEST_IDS.email_input}"]`,
      PASSWORD_AUTH.email
    );
    await page.fill(
      `input[data-test="${TEST_IDS.password_input}"]`,
      PASSWORD_AUTH.password
    );
    await page.click(`[data-test="${TEST_IDS.sign_in_submit}"]`);

    // Wait for successful sign in
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/(profile)?$/);

    // Step 2: Navigate to change password page
    await page.goto('/change-password');
    await page.waitForLoadState('networkidle');

    // Step 3: Fill out change password form
    await page.fill(
      `input[data-test="${TEST_IDS.current_password_input}"]`,
      PASSWORD_AUTH.password
    );
    await page.fill(
      `input[data-test="${TEST_IDS.new_password_input}"]`,
      PASSWORD_AUTH.password
    ); // Same password
    await page.fill(
      `input[data-test="${TEST_IDS.confirm_password_input}"]`,
      PASSWORD_AUTH.password
    );

    // Step 4: Submit form
    await page.click(`[data-test="${TEST_IDS.change_password_submit}"]`);

    // Step 5: Verify success (should redirect to profile or show success message)
    await page.waitForLoadState('networkidle');

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/profile', { timeout: 30000 });
  });
});
