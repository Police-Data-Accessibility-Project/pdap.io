import { test, expect } from '@playwright/test';
import { TEST_USERS } from 'e2e/fixtures/users';

test.describe('Authentication flows', () => {
  test('should sign in with email and password', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('[name="email"]', TEST_USERS.PASSWORD_AUTH.email);
    await page.fill('[name="password"]', TEST_USERS.PASSWORD_AUTH.password);
    await page.click('button[type="submit"]');

    // Assert successful sign in
    await expect(page).toHaveURL('/profile');
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
});
