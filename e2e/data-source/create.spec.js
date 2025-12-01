import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { PASSWORD_AUTH } from '../fixtures/users';
import { test } from '../fixtures/base';

import '../msw-setup.js';

const SOURCE_COLLECTOR_SUBMIT = `${process.env.VITE_SOURCE_COLLECTOR_API_URL}/submit/data-source`;
const REQUIRED_ERROR_SELECTOR = '.pdap-form-error-message';

async function setChecked(page, selector, checked = true) {
  await page.waitForSelector(selector, { state: 'attached' });
  await page.evaluate(
    ({ sel, checkedVal }) => {
      const input = document.querySelector(sel);
      if (!input) throw new Error(`Input not found for selector: ${sel}`);
      input.checked = checkedVal;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { sel: selector, checkedVal: checked }
  );
}

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
    await expect(
      page.locator(`[data-test="${TEST_IDS.data_source_create_advanced}"]`)
    ).toBeVisible();
  });

  test('should require URL field', async ({ page }) => {
    await page.goto('/data-source/create');
    await page.waitForLoadState('networkidle');

    await page.click(`[data-test="${TEST_IDS.data_source_create_submit}"]`);
    await expect(page.locator(REQUIRED_ERROR_SELECTOR)).toBeVisible();
  });

  test('should fill and submit basic form', async ({ page }) => {
    await page.goto('/data-source/create');
    await page.waitForLoadState('networkidle');

    const uniqueUrl = `https://example.com/data-${Date.now()}`;
    await page.fill(
      `input[data-test="${TEST_IDS.data_source_create_url_input}"]`,
      uniqueUrl
    );
    await page.fill('input[name="name"]', 'Test Data Source');
    await page.fill('textarea[name="description"]', 'Test description');
    await setChecked(
      page,
      `[data-test="${TEST_IDS.data_source_create_record_type_arrest_records}"] input`
    );

    await page.click(`[data-test="${TEST_IDS.data_source_create_submit}"]`);

    await page.waitForResponse((response) => {
      const matchesEndpoint = response.url() === SOURCE_COLLECTOR_SUBMIT;
      const isPost = response.request().method() === 'POST';
      return matchesEndpoint && isPost && response.status() >= 200 && response.status() < 300;
    });
  });

  test('should fill and submit with advanced properties', async ({ page }) => {
    await page.goto('/data-source/create');
    await page.waitForLoadState('networkidle');

    // Fill required base fields
    const uniqueUrl = `https://example.com/advanced-data-${Date.now()}`;
    await page.fill(
      `input[data-test="${TEST_IDS.data_source_create_url_input}"]`,
      uniqueUrl
    );
    await page.fill('input[name="name"]', 'Advanced Data Source');
    await page.fill('textarea[name="description"]', 'Advanced description');
    await setChecked(
      page,
      `[data-test="${TEST_IDS.data_source_create_record_type_arrest_records}"] input`
    );

    // Expand advanced properties and wait for section to render
    await page.click(`[data-test="${TEST_IDS.data_source_create_advanced}"]`);
    await expect(
      page.getByRole('heading', { name: 'Agency supplied' })
    ).toBeVisible();

    await setChecked(page, 'input[name="access_types-web-page"]');
    await setChecked(page, 'input[name="access_types-api"]');
    await setChecked(page, 'input[name="record_formats-json"]');
    await setChecked(page, 'input[name="record_formats-pdf"]');
    await setChecked(
      page,
      `[data-test="${TEST_IDS.data_source_create_update_method_insert}"] input`
    );

    // Notes
    await page.fill(
      `[data-test="${TEST_IDS.data_source_create_access_notes}"] textarea, textarea[name="access_notes"]`,
      'Access may require authentication.'
    );
    await page.fill(
      `[data-test="${TEST_IDS.data_source_create_submission_notes}"] textarea, textarea[name="submission_notes"]`,
      'Submitted with advanced properties populated.'
    );

    // Submit
    await page.click(`[data-test="${TEST_IDS.data_source_create_submit}"]`);

    await page.waitForResponse((response) => {
      const matchesEndpoint = response.url() === SOURCE_COLLECTOR_SUBMIT;
      const isPost = response.request().method() === 'POST';
      return matchesEndpoint && isPost && response.status() >= 200 && response.status() < 300;
    });
  });
});
