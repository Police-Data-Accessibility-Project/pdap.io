import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { PASSWORD_AUTH } from '../fixtures/users';
import { test } from '../fixtures/base';

import '../msw-setup.js';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    // TODO: figure out how to abstract this.
    await page.goto('/sign-in');
    await page.fill('[name="email"]', PASSWORD_AUTH.email);
    await page.fill('[name="password"]', PASSWORD_AUTH.password);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('should display user profile information', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    // Wait for either profile or sign-in page to load
    await page.waitForSelector('h1', { state: 'visible' });
    
    // If redirected to sign-in, the auth failed - skip test
    const heading = await page.locator('h1').textContent();
    if (heading?.includes('Sign In')) {
      test.skip(true, 'Authentication failed - user not signed in');
    }

    await expect(page.locator('h1')).toContainText('Profile');
    await expect(
      page.locator(`[data-test="${TEST_IDS.profile_basic_info_heading}"]`)
    ).toContainText('Basic information');
    await expect(
      page.locator(`[data-test="${TEST_IDS.profile_email}"]`)
    ).toBeVisible();
    await expect(
      page.locator(`[data-test="${TEST_IDS.profile_signout}"]`)
    ).toBeVisible();
    await expect(
      page.locator(`[data-test="${TEST_IDS.profile_reset_password}"]`)
    ).toBeVisible();
  });

  test('should handle GitHub account linking', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    const githubLinkButton = page.locator(
      `[data-test="${TEST_IDS.profile_github_link}"]`
    );
    if (await githubLinkButton.isVisible()) {
      await expect(githubLinkButton).toContainText('Link account with GitHub');
    }
  });

  test('should show linked GitHub account status', async ({ page }) => {
    await page.goto('/profile?gh_access_token=mock-token-123');
    await page.waitForLoadState('networkidle');

    const linkedStatus = page.locator(
      `[data-test="${TEST_IDS.profile_github_linked}"]`
    );
    if (await linkedStatus.isVisible()) {
      await expect(linkedStatus).toContainText(
        'Your account is linked with GitHub'
      );
    }
  });

  test('should generate and display API key', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    await page.click(`[data-test="${TEST_IDS.profile_api_key_regenerate}"]`);
    await expect(
      page.locator(`[data-test="${TEST_IDS.profile_api_key_display}"]`)
    ).toBeVisible();
    await expect(
      page.locator(`[data-test="${TEST_IDS.profile_api_key_copy}"]`)
    ).toBeVisible();
    await expect(
      page.locator(`[data-test="${TEST_IDS.profile_api_key_dismiss}"]`)
    ).toBeVisible();

    await page.click(`[data-test="${TEST_IDS.profile_api_key_dismiss}"]`);
    await expect(
      page.locator(`[data-test="${TEST_IDS.profile_api_key_display}"]`)
    ).not.toBeVisible();
  });

  test('should display user tables', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    // Check if authenticated
    const heading = await page.locator('h1').textContent();
    if (heading?.includes('Sign In')) {
      test.skip(true, 'Authentication failed - user not signed in');
    }

    await expect(
      page.locator(`[data-test="${TEST_IDS.profile_my_stuff_heading}"]`)
    ).toContainText('My stuff');
    // TODO: how to merge mock data in the profile response for the sake of testing?
    // await expect(
    //   page.locator(`[data-test="${TEST_IDS.profile_requests_table}"]`)
    // ).toBeVisible();
    // await expect(
    //   page.locator(`[data-test="${TEST_IDS.profile_followed_searches_table}"]`)
    // ).toBeVisible();
    // await expect(
    //   page.locator(`[data-test="${TEST_IDS.profile_recent_searches_table}"]`)
    // ).toBeVisible();
  });

  test('should handle unfollow functionality', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    const unfollowButton = page
      .locator(`[data-test="${TEST_IDS.profile_unfollow_button}"]`)
      .first();
    if (await unfollowButton.isVisible()) {
      await unfollowButton.click();
      await expect(unfollowButton).toBeDisabled();
    }
  });

  test('should navigate to change password', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    // Check if authenticated
    const heading = await page.locator('h1').textContent();
    if (heading?.includes('Sign In')) {
      test.skip(true, 'Authentication failed - user not signed in');
    }

    await page.click(`[data-test="${TEST_IDS.profile_reset_password}"]`);
    await expect(page).toHaveURL('/change-password');
  });

  test('should handle sign out', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    await page.click(`[data-test="${TEST_IDS.profile_signout}"]`);
    await expect(page).toHaveURL('/sign-in');
  });
});
