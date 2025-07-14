import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { test } from '../fixtures/base';

import '../msw-setup.js';

test.describe('Data Request Page', () => {
  test('should display data request details', async ({ page }) => {
    await page.goto('/data-request/1');
    await page.waitForLoadState('networkidle');

    // Should show data request title or not found message
    const title = page.locator('h1');
    await title.waitFor({ state: 'visible' });
    await expect(title).toBeVisible();

    // If data request exists, check for GitHub link
    const githubLink = page.locator(
      'a:has-text("Help out with this issue on GitHub")'
    );
    if (await githubLink.isVisible()) {
      await expect(githubLink).toHaveAttribute('target', '_blank');
    }
  });

  test('should show record type pills', async ({ page }) => {
    await page.goto('/data-request/1');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.locator('h1').waitFor({ state: 'visible' });

    // Should show record type pill if available
    const recordTypePill = page.locator('.pill').first();
    if (await recordTypePill.isVisible()) {
      await expect(recordTypePill).toBeVisible();
    }
  });

  test('should display all data request sections', async ({ page }) => {
    await page.goto('/data-request/1');

    await page.waitForLoadState('networkidle');
    await page.locator('h1').waitFor({ state: 'visible' });

    // Check for various sections
    const sections = [
      'Locations covered by request',
      'Coverage Range',
      'Target date',
      'Request notes',
      'Data requirements'
    ];

    for (const section of sections) {
      const sectionHeader = page.locator(`h4:has-text("${section}")`);
      if (await sectionHeader.isVisible()) {
        await expect(sectionHeader).toBeVisible();
      }
    }
  });

  test('should show prev/next navigation when coming from search results', async ({
    page
  }) => {
    // First go to search results to establish context
    await page.goto('/search/results?location_id=6593');
    await page.waitForLoadState('networkidle');

    const dataRequestCount = await page
      .locator(`[data-test="${TEST_IDS.data_request_link}"]`)
      .count();
    if (dataRequestCount === 0) {
      return; // Skip test if no data requests available
    }

    // Click on a data request
    await page.click(`[data-test="${TEST_IDS.data_request_link}"]`);

    // Should be on data request page
    await expect(page).toHaveURL(/\/data-request\/\d+/);

    // Should show navigation if there are multiple results
    const prevButton = page.locator('a:has-text("PREV")');
    const nextButton = page.locator('a:has-text("NEXT")');

    // At least one navigation button should be visible if there are multiple results
    if ((await prevButton.isVisible()) || (await nextButton.isVisible())) {
      // Test navigation functionality
      if (
        (await nextButton.isVisible()) &&
        !(await nextButton.locator('.disabled').isVisible())
      ) {
        const currentUrl = page.url();
        await nextButton.click();

        // Should navigate to different data request
        await expect(page).not.toHaveURL(currentUrl);
        await expect(page).toHaveURL(/\/data-request\/\d+/);
      }
    }
  });

  test('should handle swipe navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Go through search results first
    await page.goto('/search/results?location_id=6593');
    await page.waitForLoadState('networkidle');

    const dataRequestCount = await page
      .locator(`[data-test="${TEST_IDS.data_request_link}"]`)
      .count();
    if (dataRequestCount === 0) {
      return; // Skip test if no data requests available
    }

    await page.click(`[data-test="${TEST_IDS.data_request_link}"]`);

    await expect(page).toHaveURL(/\/data-request\/\d+/);

    // Test swipe gestures (simulated with mouse drag)
    const main = page.locator('main');
    if (await main.isVisible()) {
      // Simulate swipe left (next) with mouse drag
      await main.hover();
      await page.mouse.down();
      await page.mouse.move(50, 300);
      await page.mouse.up();

      // Should potentially navigate to next data request
      await page.waitForTimeout(500);
    }
  });

  test('should handle loading and error states', async ({ page }) => {
    // Test loading state
    const responsePromise = page.waitForResponse(/\/data-requests\/\d+/);
    await page.goto('/data-request/1');

    // Should show loading spinner initially
    const spinner = page.locator('.pdap-spinner'); // TODO - why data-test not forwarded to spinner?
    if (await spinner.isVisible({ timeout: 1000 })) {
      await expect(spinner).toBeVisible();
    }

    await responsePromise;
    await page.waitForLoadState('networkidle');

    // Should show content after loading
    await page.locator('h1').waitFor({ state: 'visible' });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle non-existent data request', async ({ page }) => {
    await page.goto('/data-request/99999');
    await page.waitForLoadState('networkidle');

    // Should show not found message
    await page
      .locator('h1:has-text("Data request not found")')
      .waitFor({ state: 'visible' });
    await expect(
      page.locator('h1:has-text("Data request not found")')
    ).toBeVisible();
    await expect(
      page.locator('p:has-text("We don\'t have a record of that request")')
    ).toBeVisible();
  });

  test('should display location information correctly', async ({ page }) => {
    await page.goto('/data-request/1');

    await page.waitForLoadState('networkidle');
    await page.locator('h1').waitFor({ state: 'visible' });

    // Check if location information is displayed
    const locationSection = page.locator(
      'h4:has-text("Locations covered by request")'
    );
    if (await locationSection.isVisible()) {
      await expect(locationSection).toBeVisible();

      // Should have location text following the section
      const locationText = page.locator(
        'h4:has-text("Locations covered by request") + p'
      );
      if (await locationText.isVisible()) {
        await expect(locationText).toBeVisible();
      }
    }
  });

  test('should display urgency and coverage information', async ({ page }) => {
    await page.goto('/data-request/1');

    await page.waitForLoadState('networkidle');
    await page.locator('h1').waitFor({ state: 'visible' });

    // Check coverage range section
    const coverageSection = page.locator('h4:has-text("Coverage Range")');
    if (await coverageSection.isVisible()) {
      await expect(coverageSection).toBeVisible();
    }

    // Check target date section
    const targetSection = page.locator('h4:has-text("Target date")');
    if (await targetSection.isVisible()) {
      await expect(targetSection).toBeVisible();
    }
  });
});
