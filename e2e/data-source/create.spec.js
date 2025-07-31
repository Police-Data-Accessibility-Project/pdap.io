import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { PASSWORD_AUTH } from '../fixtures/users';
import { test } from '../fixtures/base';

import '../msw-setup.js';

// TODO: handle advanced properties
test.describe('Data Source Create Page', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    // TODO: how to abstract this
    await page.goto('/sign-in');
    await page.fill('[name="email"]', PASSWORD_AUTH.email);
    await page.fill('[name="password"]', PASSWORD_AUTH.password);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('should display create data source form', async ({ page }) => {
    await page.goto('/data-source/create');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText('New data source');
    await expect(
      page.locator(`[data-test="${TEST_IDS.data_source_create_form}"]`)
    ).toBeVisible();
    await expect(
      page.locator(
        `input[data-test="${TEST_IDS.data_source_create_url_input}"]`
      )
    ).toBeVisible();
    await expect(
      page.locator(`[data-test="${TEST_IDS.data_source_create_submit}"]`)
    ).toBeVisible();
  });

  test('should require URL field', async ({ page }) => {
    await page.goto('/data-source/create');
    await page.waitForLoadState('networkidle');

    await page.click(`[data-test="${TEST_IDS.data_source_create_submit}"]`);
    await expect(page.locator('.pdap-form-error-message')).toBeVisible();
  });

  test('should fill and submit basic form', async ({ page }) => {
    await page.goto('/data-source/create');
    await page.waitForLoadState('networkidle');

    await page.fill(
      `input[data-test="${TEST_IDS.data_source_create_url_input}"]`,
      'https://example.com/data'
    );
    await page.fill('input[name="name"]', 'Test Data Source');
    await page.fill('textarea[name="description"]', 'Test description');

    await page.click(`[data-test="${TEST_IDS.data_source_create_submit}"]`);

    await page.waitForResponse(
      (response) =>
        response.url() === process.env.VITE_API_URL + '/data-sources' &&
        response.status() === 200 &&
        response.request().method() === 'POST'
    );
  });
});
