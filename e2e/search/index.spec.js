import { expect } from '@playwright/test';
import { TestIds } from '../fixtures/test-ids';
import { test } from '../fixtures/base';

import '../msw-setup.js';

test.describe('Search Page (Home)', () => {
  test('should display search form and map', async ({ page }) => {
    await page.goto('/');

    // Search form should be visible
    await expect(
      page.locator(`input[data-test="${TestIds.search_typeahead}"]`)
    ).toBeVisible({
      timeout: 15000
    });
    await expect(
      page.locator(`[data-test="${TestIds.search_submit}"]`)
    ).toBeVisible();

    // Map should be visible on desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page
      .locator(`[data-test="${TestIds.data_source_map}"]`)
      .waitFor({ state: 'visible' });
    await expect(
      page.locator(`[data-test="${TestIds.data_source_map}"]`)
    ).toBeVisible();

    // Recent sources section should be visible
    await expect(
      page.locator('h3:has-text("Recently added Data Sources")')
    ).toBeVisible();
  });

  test('should allow searching from home page', async ({ page }) => {
    await page.goto('/');

    // Fill search input
    await page.fill(
      `input[data-test="${TestIds.search_typeahead}"]`,
      'New York'
    );
    await page
      .locator(`[data-test="${TestIds.typeahead_list_item}"]`)
      .first()
      .waitFor({ state: 'visible' });
    await page.click(
      `[data-test="${TestIds.typeahead_list_item}"]:first-child`
    );

    // Submit search
    await page.click(`[data-test="${TestIds.search_submit}"]`);

    // Should navigate to search results
    await expect(page).toHaveURL(/\/search\/results/);
  });

  test('should display different data type checkboxes', async ({ page }) => {
    await page.goto('/');

    // Check for data type checkboxes
    await expect(page.locator('input[name="all-data-types"]')).toBeVisible();
    await expect(
      page.locator('input[name="police-and-public-interactions"]')
    ).toBeVisible();
    await expect(
      page.locator('input[name="info-about-officers"]')
    ).toBeVisible();
    await expect(
      page.locator('input[name="info-about-agencies"]')
    ).toBeVisible();
    await expect(
      page.locator('input[name="agency-published-resources"]')
    ).toBeVisible();
    await expect(page.locator('input[name="jails-and-courts"]')).toBeVisible();
  });

  test('should handle checkbox interactions correctly', async ({ page }) => {
    await page.goto('/');

    // Initially "All data types" should be checked
    await expect(page.locator('input[name="all-data-types"]')).toBeChecked();

    // Click on a specific data type
    await page.click('label[for="interactions"]');

    // "All data types" should now be unchecked
    await expect(
      page.locator('input[name="all-data-types"]')
    ).not.toBeChecked();
    await expect(
      page.locator('input[name="police-and-public-interactions"]')
    ).toBeChecked();

    // Click "All data types" again
    await page.click('label[for="all-data-types"]');

    // Other checkboxes should be unchecked
    await expect(
      page.locator('input[name="police-and-public-interactions"]')
    ).not.toBeChecked();
    await expect(page.locator('input[name="all-data-types"]')).toBeChecked();
  });
});
