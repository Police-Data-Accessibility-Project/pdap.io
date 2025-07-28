const { expect } = require('@playwright/test');
const { test } = require('../fixtures/base');
const { PASSWORD_AUTH } = require('../fixtures/users');
require('../msw-setup.js');

test.describe('Change password flow', () => {
  test('should change password successfully', async ({ page }) => {
    // Step 1: Sign in first
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', PASSWORD_AUTH.email);
    await page.fill('input[name="password"]', PASSWORD_AUTH.password);
    await page.click('button[type="submit"]');

    // Wait for successful sign in
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/(profile)?$/);

    // Step 2: Navigate to change password page
    await page.goto('/change-password');
    await page.waitForLoadState('networkidle');

    // Step 3: Fill out change password form
    await page.fill('input[name="currentPassword"]', PASSWORD_AUTH.password);
    await page.fill('input[name="password"]', PASSWORD_AUTH.password); // Same password
    await page.fill('input[name="confirmPassword"]', PASSWORD_AUTH.password);

    // Step 4: Submit form
    await page.click('button[type="submit"]');

    // Step 5: Verify success (should redirect to profile or show success message)
    await page.waitForLoadState('networkidle');

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/profile', { timeout: 30000 });
  });
});
