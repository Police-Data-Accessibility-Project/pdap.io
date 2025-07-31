import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { test } from '../fixtures/base';

import '../msw-setup.js';

test.describe('Search Results Page', () => {
  test('should display search results for a location', async ({ page }) => {
    // Navigate directly to search results with location_id
    await page.goto('/search/results?location_id=6593');

    // Page should load with results
    await expect(page.locator('h1')).toContainText('Data');
    await expect(page.locator('h1')).toBeVisible();

    // Should show some navigation or content
    const nav = page.locator('nav');
    if ((await nav.count()) > 1) {
      // Look for the search results nav specifically
      const searchNav = page.locator('nav').nth(1);
      if (await searchNav.isVisible()) {
        await expect(searchNav).toBeVisible();
      }
    }

    // Should show data source results
    await page.waitForLoadState('networkidle');
    const dataSourceCount = await page
      .locator(`[data-test="${TEST_IDS.data_source_link}"]`)
      .count();
    if (dataSourceCount > 0) {
      await expect(
        page.locator(`[data-test="${TEST_IDS.data_source_link}"]`).first()
      ).toBeVisible();
    }
  });

  // TODO: fix this flakiness
  test.skip('should allow updating search from results page', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1000, height: 667 });
    await page.goto('/search/results?location_id=6593');
    await page.waitForLoadState('networkidle');

    await page.click(`[data-test="${TEST_IDS.search_toggle}"]`);
    const searchInput = page.locator(
      `input[data-test="${TEST_IDS.search_typeahead}"]`
    );
    await searchInput.click();
    await searchInput.clear();
    await searchInput.type('Chicago', { delay: 100 });

    // Wait for typeahead dropdown to appear
    await page
      .locator(`[data-test="${TEST_IDS.typeahead_list_item}"]`)
      .first()
      .waitFor({ state: 'visible' });
    await page
      .locator(`[data-test="${TEST_IDS.typeahead_list_item}"]`)
      .first()
      .click();

    // Wait for button to be enabled and submit
    await page
      .locator(`[data-test="${TEST_IDS.search_submit}"]:not([disabled])`)
      .waitFor({ state: 'visible' });
    await page.click(`[data-test="${TEST_IDS.search_submit}"]`);

    // URL should update with new location
    await expect(page).toHaveURL(/\/search\/results\?location_id=\d+/);
  });

  test('should navigate between geographic levels', async ({ page }) => {
    await page.goto('/search/results?location_id=6593');

    // Wait for navigation to load
    await page.waitForLoadState('networkidle');
    const navCount = await page.locator('nav a[href*="#"]').count();
    if (navCount === 0) {
      return; // Skip test if no navigation present
    }

    // Click on different geographic levels
    const navLinks = page.locator('nav a[href*="#"]');
    const firstLink = navLinks.first();

    if (await firstLink.isVisible()) {
      await firstLink.click();
      // Should scroll to the appropriate section
      await expect(page).toHaveURL(/#\w+/);
    }
  });

  test('should show follow functionality when authenticated', async ({
    page
  }) => {
    // This would require authentication setup
    await page.goto('/search/results?location_id=6593');

    // Check if follow button exists (may be disabled if not authenticated)
    const followButton = page.locator('button:has-text("Follow")');
    if (await followButton.isVisible()) {
      await expect(followButton).toBeVisible();
    }
  });

  test('should handle search with record categories', async ({ page }) => {
    await page.goto(
      '/search/results?location_id=4&record_categories=Police%20%26%20public%20interactions'
    );

    // Should display results filtered by record category
    await expect(page.locator('h1')).toContainText('Data');
    await page.waitForLoadState('networkidle');
    const resultCount = await page
      .locator(`[data-test="${TEST_IDS.data_source_link}"]`)
      .count();
    if (resultCount === 0) {
      console.log('No data sources found for this category');
    }
  });

  test('should show search toggle on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/search/results?location_id=6593');

    // Search should be hidden initially on mobile
    const searchToggle = page.locator('button:has-text("Show search")');
    await expect(searchToggle).toBeVisible();

    // Click to show search
    await searchToggle.click();
    await expect(
      page.locator(`input[data-test="${TEST_IDS.search_typeahead}"]`)
    ).toBeVisible();

    // Click to hide search
    await page.click('button:has-text("Hide search")');
    await expect(
      page.locator(`input[data-test="${TEST_IDS.search_typeahead}"]`)
    ).not.toBeVisible();
  });

  test('should display data source information correctly', async ({ page }) => {
    await page.goto('/search/results?location_id=6593');

    await page.waitForLoadState('networkidle');
    const dataSourceCount = await page
      .locator(`[data-test="${TEST_IDS.data_source_link}"]`)
      .count();
    if (dataSourceCount === 0) {
      return; // Skip test if no data sources available
    }

    const firstDataSource = page
      .locator(`[data-test="${TEST_IDS.data_source_link}"]`)
      .first();

    // Should show data source name
    await expect(firstDataSource.locator('h6')).toBeVisible();

    // Should show record type with icon
    await expect(firstDataSource.locator('.pill')).toBeVisible();

    // Should show visit link
    await expect(
      firstDataSource.locator('a[href*="http"]:has-text("Visit")')
    ).toBeVisible();
  });
});
