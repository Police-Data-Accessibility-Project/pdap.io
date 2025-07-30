const { expect } = require('@playwright/test');
const { test } = require('../fixtures/base');
const { TEST_IDS } = require('../fixtures/test-ids');
const { MailgunHelper } = require('../helpers/mailgun');
const { TEST_RESET_EMAIL } = require('e2e/fixtures/users');
require('../msw-setup.js');

// Test email for password reset
const TEST_EMAIL = TEST_RESET_EMAIL;

test.describe('Password reset flow', () => {
  let mailgun;

  test.beforeAll(async () => {
    mailgun = new MailgunHelper();
  });

  test('should complete password reset flow', async ({ page }) => {
    // Step 1: Go to request password reset page
    await page.goto('/request-reset-password');
    await page.waitForLoadState('networkidle');

    // Step 2: Fill out reset request form
    await page.fill(`input[data-test="${TEST_IDS.email_input}"]`, TEST_EMAIL);

    // Step 3: Submit form
    await page.click(`[data-test="${TEST_IDS.form_submit}"]`);

    // Step 4: Verify we're on the success page
    // await expect(page.locator('h1')).toContainText(
    //   'Request a link to reset your password'
    // );
    await expect(
      page.locator(`[data-test="${TEST_IDS.success_subheading}"]`)
    ).toContainText('We sent you an email with a link to reset your password');

    // Step 5: Wait for and retrieve password reset email
    console.log('Waiting for password reset email...');
    const email = await mailgun.getLatestEmailFor(TEST_EMAIL);

    // Step 6: Extract reset URL from email
    const resetUrl = mailgun.extractPasswordResetUrl(
      email.body.html || email.body.text
    );
    console.log(`Reset URL: ${resetUrl}`);

    // Step 7: Navigate to reset URL
    await page.goto(resetUrl);
    await page.waitForLoadState('networkidle');

    // Step 8: Fill out new password form
    await page.fill(
      `input[data-test="${TEST_IDS.password_input}"]`,
      'NewPassword123!'
    );
    await page.fill(
      `input[data-test="${TEST_IDS.confirm_password_input}"]`,
      'NewPassword123!'
    );

    // Step 9: Submit new password
    await page.click(`[data-test="${TEST_IDS.form_submit}"]`);

    // Step 10: Verify password was reset successfully
    await expect(page).toHaveURL(/\/profile/);
  });
});
