import { expect } from '@playwright/test';
import { TestIds } from '../fixtures/test-ids';
import { test } from '../fixtures/base';

import '../msw-setup.js';

test.describe('Search Flow', () => {
  test('should navigate from home to search results to data source', async ({
    page
  }) => {
    // Start at home page
    await page.goto('/');

    // Search for a location
    await page.waitForSelector(
      `[data-test="${TestIds.search_typeahead}"] input`
    );
    await page.fill(
      `[data-test="${TestIds.search_typeahead}"] input`,
      'Pittsburgh'
    );
    await page.waitForSelector(`[data-test="${TestIds.typeahead_list_item}"]`, {
      timeout: 15000
    });
    await page.click(
      `[data-test="${TestIds.typeahead_list_item}"]:first-child`
    );

    // Submit search
    await page.click(`[data-test="${TestIds.search_submit}"]`);

    // Should be on search results page
    await expect(page).toHaveURL(/\/search\/results/);
    await expect(page.locator('h1')).toContainText('Data');

    // Click on first data source
    await page.waitForSelector(`[data-test="${TestIds.data_source_link}"]`);
    await page.click(`[data-test="${TestIds.data_source_link}"]`);

    // Should be on data source page
    await expect(page).toHaveURL(/\/data-source\/\d+/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
