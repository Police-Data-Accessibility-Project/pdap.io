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

    // Expand advanced properties and wait for section to render
    await page.click(`[data-test="${TEST_IDS.data_source_create_advanced}"]`);
    await expect(
      page.getByText('Level of detail available at this source')
    ).toBeVisible();

    // Small helper to reliably toggle inputs rendered inside design-system wrappers
    const setChecked = async (wrapperTestId, checked) => {
      const selector = `[data-test="${wrapperTestId}"] input`;
      await page.waitForSelector(selector, { state: 'attached' });
      await page.evaluate(({ sel, checkedVal }) => {
        const el = document.querySelector(sel);
        if (!el) throw new Error(`Input not found for ${sel}`);
        el.checked = checkedVal;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, { sel: selector, checkedVal: checked });
    };

    // Level of detail
    await setChecked(TEST_IDS.data_source_create_detail_individual, true);

    // Record type
    await setChecked(
      TEST_IDS.data_source_create_record_type_arrest_records,
      true
    );

    // Note: leave conditional checkboxes, access types, and formats untouched
    // to avoid backend enum mismatches while we validate advanced flow.

    // Update method
    await setChecked(TEST_IDS.data_source_create_update_method_insert, true);

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

    // Expect POST to succeed (accept any 2xx)
    await page.waitForResponse((response) => {
      const isCreate =
        response.url() === process.env.VITE_API_URL + '/data-sources' &&
        response.request().method() === 'POST';
      return isCreate && response.status() >= 200 && response.status() < 300;
    });
  });
});
