const { expect } = require('@playwright/test');
const { test } = require('../fixtures/base');
const { MailgunHelper } = require('../helpers/mailgun');
const { TEST_IDS } = require('../fixtures/test-ids');
require('../msw-setup.js');

// Base email from ENV
const BASE_EMAIL = process.env.E2E_SIGNUP_EMAIL;

test.describe('Sign-up verification flow', () => {
  let mailgun;

  test.beforeAll(async () => {
    mailgun = new MailgunHelper();
  });

  // Helper function to handle email validation flow
  async function handleEmailValidation(page, testEmail) {
    // Wait for and retrieve verification email
    console.log('Waiting for verification email...');
    const email = await mailgun.getLatestEmailFor(testEmail);

    // Extract verification URL from email
    const verificationUrl = mailgun.extractVerificationUrl(
      email.body.html || email.body.text
    );
    console.log(`Verification URL: ${verificationUrl}`);

    // Navigate to verification URL
    await page.goto(verificationUrl);
    await page.waitForLoadState('networkidle');
    console.log('After verification URL navigation, current URL:', page.url());

    // Check if we're on the validation page and handle it
    if (page.url().includes('/validate')) {
      console.log('On validation page, looking for buttons');

      // If there's a button to request a new token, click it
      const requestButton = page.locator('button:has-text("request another")');
      if (await requestButton.isVisible()) {
        await requestButton.click();
        await page.waitForLoadState('networkidle');
        console.log('Clicked request new token button');

        // Add a delay to ensure the new email has time to be sent and indexed
        console.log('Waiting 10 seconds for new email to be sent...');
        await page.waitForTimeout(10000);

        // Wait for and retrieve the new verification email
        console.log('Waiting for new verification email...');
        const newEmail = await mailgun.getLatestEmailFor(testEmail);

        // Extract the new verification URL
        const newVerificationUrl = mailgun.extractVerificationUrl(
          newEmail.body.html || newEmail.body.text
        );
        console.log(`New verification URL: ${newVerificationUrl}`);

        // Navigate to the new verification URL
        await page.goto(newVerificationUrl);
        await page.waitForLoadState('networkidle');
        console.log(
          'After new verification URL navigation, current URL:',
          page.url()
        );
      }
    } else {
      console.log('Not on validation page, current URL:', page.url());
    }
  }

  test('should complete sign-up with email verification', async ({ page }) => {
    // Generate unique test email for this run
    const [localPart, domain] = BASE_EMAIL.split('@');
    const timestamp = Date.now();
    const TEST_EMAIL = `${localPart}+${timestamp}@${domain}`;
    console.log('Using test email:', TEST_EMAIL);

    // Step 1: Go to sign-up page
    await page.goto('/sign-up');
    await page.waitForLoadState('networkidle');

    // Step 2: Fill out sign-up form
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');

    // Step 3: Submit form
    await page.click('button[type="submit"]');

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');

    // Step 4: Should be on the success page
    await expect(page.locator('h1')).toContainText('Thanks for signing up!');
    
    // Add delay to ensure email has time to be sent and indexed
    console.log('Waiting 10 seconds for email to be sent and indexed...');
    await page.waitForTimeout(10000);

    // Handle email validation flow
    await handleEmailValidation(page, TEST_EMAIL);

    // Check we're on the profile page
    await expect(page).toHaveURL(/\/profile/);
    await expect(page.locator('h1')).toContainText('Profile');
  });
});
