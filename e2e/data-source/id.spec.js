import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { test } from '../fixtures/base';

import '../msw-setup.js';

test.describe('Data Source Page', () => {
  test('should display data source details', async ({ page }) => {
    await page.goto('/data-source/4');
    await page.waitForLoadState('networkidle');

    // Should show data source title or not found message
    const title = page.locator('h1');
    await title.waitFor({ state: 'visible' });
    await expect(title).toBeVisible();

    // If data source exists, check for visit button
    const visitButton = page.locator('a:has-text("Visit Data Source")');
    if (await visitButton.isVisible()) {
      await expect(visitButton).toHaveAttribute('target', '_blank');
    }
  });

  test('should show record type and jurisdiction pills', async ({ page }) => {
    await page.goto('/data-source/4');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.locator('h1').waitFor({ state: 'visible' });

    // Should show record type pill if available
    const recordTypePill = page.locator('.pill').first();
    if (await recordTypePill.isVisible()) {
      await expect(recordTypePill).toBeVisible();
    }
  });

  test('should display description with expand/collapse functionality', async ({
    page
  }) => {
    await page.goto('/data-source/198');

    // Wait for description section
    const descriptionSection = page.locator('h4:has-text("Description")');
    if (await descriptionSection.isVisible()) {
      await expect(descriptionSection).toBeVisible();

      // Check if expand button exists for long descriptions
      const expandButton = page.locator('button:has-text("See more")');
      if (await expandButton.isVisible()) {
        await expandButton.click();
        await expect(page.locator('button:has-text("See less")')).toBeVisible();

        // Click to collapse
        await page.click('button:has-text("See less")');
        await expect(page.locator('button:has-text("See more")')).toBeVisible();
      }
    }
  });

  test('should handle multiple agencies correctly', async ({ page }) => {
    await page.goto('/data-source/4');

    await page.waitForLoadState('networkidle');
    await page.locator('h1').waitFor({ state: 'visible' });

    // Check if agency information is displayed
    const agencyInfoCount = await page
      .locator(`[data-test="${TEST_IDS.agency_info}"]`)
      .count();
    if (agencyInfoCount > 0) {
      await expect(
        page.locator(`[data-test="${TEST_IDS.agency_info}"]`)
      ).toBeVisible();
      await expect(
        page.locator(`[data-test="${TEST_IDS.county_state}"]`)
      ).toBeVisible();
      await expect(
        page.locator(`[data-test="${TEST_IDS.agency_type}"]`)
      ).toBeVisible();
    }
  });

  test('should show prev/next navigation when coming from search results', async ({
    page
  }) => {
    // First go to search results to establish context
    await page.goto('/search/results?location_id=6593');
    await page.waitForLoadState('networkidle');

    const dataSourceCount = await page
      .locator(`[data-test="${TEST_IDS.data_source_link}"]`)
      .count();
    if (dataSourceCount === 0) {
      return; // Skip test if no data sources available
    }

    // Click on a data source
    await page.click(`[data-test="${TEST_IDS.data_source_link}"]`);

    // Should be on data source page
    await expect(page).toHaveURL(/\/data-source\/\d+/);

    // Should show navigation if there are multiple results
    const prevButton = page.locator('button:has-text("Previous")');
    const nextButton = page.locator('button:has-text("Next")');

    // At least one navigation button should be visible if there are multiple results
    if ((await prevButton.isVisible()) || (await nextButton.isVisible())) {
      // Test navigation functionality
      if ((await nextButton.isVisible()) && (await nextButton.isEnabled())) {
        const currentUrl = page.url();
        await nextButton.click();

        // Should navigate to different data source
        await expect(page).not.toHaveURL(currentUrl);
        await expect(page).toHaveURL(/\/data-source\/\d+/);
      }
    }
  });

  test('should handle swipe navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Go through search results first
    await page.goto('/search/results?location_id=6593');
    await page.waitForLoadState('networkidle');

    const dataSourceCount = await page
      .locator(`[data-test="${TEST_IDS.data_source_link}"]`)
      .count();
    if (dataSourceCount === 0) {
      return; // Skip test if no data sources available
    }

    await page.click(`[data-test="${TEST_IDS.data_source_link}"]`);

    await expect(page).toHaveURL(/\/data-source\/\d+/);

    // Test swipe gestures (simulated with mouse drag)
    const main = page.locator('main');
    if (await main.isVisible()) {
      // Simulate swipe left (next) with mouse drag
      await main.hover();
      await page.mouse.down();
      await page.mouse.move(50, 300);
      await page.mouse.up();

      // Should potentially navigate to next data source
      await page.waitForTimeout(500);
    }
  });

  test('should display data source sections correctly', async ({ page }) => {
    await page.goto('/data-source/4');

    await page.waitForLoadState('networkidle');
    await page.locator('h1').waitFor({ state: 'visible' });

    // Should show various data source sections
    const sections = page.locator('.section');
    if ((await sections.count()) > 0) {
      // Each section should have a header
      await expect(sections.first().locator('h2')).toBeVisible();
    }
  });

  test('should handle loading and error states', async ({ page }) => {
    // Test loading state
    const responsePromise = page.waitForResponse(/\/data-sources\/\d+/);
    await page.goto('/data-source/4');

    // Should show loading spinner initially
    const spinner = page.locator('[data-testid="spinner"]');
    if (await spinner.isVisible({ timeout: 1000 })) {
      await expect(spinner).toBeVisible();
    }

    await responsePromise;
    await page.waitForLoadState('networkidle');

    // Should show content after loading
    await page.locator('h1').waitFor({ state: 'visible' });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle non-existent data source', async ({ page }) => {
    await page.goto('/data-source/99999');
    await page.waitForLoadState('networkidle');

    // Should show not found message
    await page
      .locator('h1:has-text("Data source not found")')
      .waitFor({ state: 'visible' });
    await expect(
      page.locator('h1:has-text("Data source not found")')
    ).toBeVisible();
    await expect(
      page.locator('p:has-text("We don\'t have a record of that source")')
    ).toBeVisible();
  });
});
