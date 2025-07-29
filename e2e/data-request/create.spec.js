import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { PASSWORD_AUTH } from '../fixtures/users';
import { test } from '../fixtures/base';

import '../msw-setup.js';

test.describe('Data Request Create Page', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto('/sign-in');
    await page.fill(
      `input[data-test="${TEST_IDS.email_input}"]`,
      PASSWORD_AUTH.email
    );
    await page.fill(
      `input[data-test="${TEST_IDS.password_input}"]`,
      PASSWORD_AUTH.password
    );
    await page.click(`[data-test="${TEST_IDS.sign_in_submit}"]`);
    await page.waitForLoadState('networkidle');
  });

  test('should display create data request form', async ({ page }) => {
    await page.goto('/data-request/create');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText('New request');
    await expect(
      page.locator(`[data-test="${TEST_IDS.data_request_create_form}"]`)
    ).toBeVisible();
    await expect(
      page.locator(
        `input[data-test="${TEST_IDS.data_request_create_title_input}"]`
      )
    ).toBeVisible();
    await expect(
      page.locator(`[data-test="${TEST_IDS.data_request_create_submit}"]`)
    ).toBeVisible();
  });

  test('should require all form fields', async ({ page }) => {
    await page.goto('/data-request/create');
    await page.waitForLoadState('networkidle');

    await page.click(`[data-test="${TEST_IDS.data_request_create_submit}"]`);
    await expect(page.locator('.pdap-form-error-message')).toBeVisible(); // Not using Test_Ids because of design-system
  });

  test('should fill and submit complete form', async ({ page }) => {
    await page.goto('/data-request/create');
    await page.waitForLoadState('networkidle');

    // Fill required fields
    await page.fill(
      `input[data-test="${TEST_IDS.data_request_create_title_input}"]`,
      'Test Data Request'
    );

    // Add location
    const typeaheadInput = page.locator(
      `input[data-test="${TEST_IDS.data_request_create_location_input}"]`
    );
    await typeaheadInput.fill('Pittsburgh');
    await page.waitForSelector(
      `[data-test="${TEST_IDS.typeahead_list_item}"]`,
      {
        timeout: 5000
      }
    );
    await page.click(
      `[data-test="${TEST_IDS.typeahead_list_item}"]:first-child`
    );

    // Fill other required fields
    await page.fill('input[name="coverage_range"]', '2020 - 2023');
    await page.click('button:has-text("Select")');
    await page.click('#input-request_urgency'); // TODO: test-ids?
    await page.click('#request_urgency-option-urgent');
    await page.fill('textarea[name="submission_notes"]', 'Test request notes');
    await page.fill(
      'textarea[name="data_requirements"]',
      'Test data requirements'
    );

    await page.click(`[data-test="${TEST_IDS.data_request_create_submit}"]`);

    await page.waitForResponse(
      (response) =>
        response.url().includes('/data-requests') &&
        response.status() === 200 &&
        response.request().method() === 'POST'
    );
  });

  // TODO: add test for clearing to the /data-source/create route
  test('should clear form when clear button clicked', async ({ page }) => {
    await page.goto('/data-request/create');
    await page.waitForLoadState('networkidle');

    // Fill some fields
    await page.fill(
      `input[data-test="${TEST_IDS.data_request_create_title_input}"]`,
      'Test Title'
    );
    await page.fill('textarea[name="submission_notes"]', 'Test notes');

    // Click clear button
    await page.click(`[data-test="${TEST_IDS.data_request_create_clear}"]`);

    // Fields should be empty
    await expect(
      page.locator(
        `input[data-test="${TEST_IDS.data_request_create_title_input}"]`
      )
    ).toHaveValue('');
    await expect(page.locator('textarea[name="submission_notes"]')).toHaveValue(
      ''
    );
  });

  test('should validate location requirement', async ({ page }) => {
    await page.goto('/data-request/create');
    await page.waitForLoadState('networkidle');

    // Fill all fields except location
    await page.fill(
      `input[data-test="${TEST_IDS.data_request_create_title_input}"]`,
      'Test Request'
    );
    await page.fill('input[name="coverage_range"]', '2020 - 2023');
    await page.click('button:has-text("Select")');
    await page.click('#input-request_urgency'); // TODO: test-ids?
    await page.click('#request_urgency-option-urgent');
    await page.fill('textarea[name="submission_notes"]', 'Test notes');
    await page.fill('textarea[name="data_requirements"]', 'Test requirements');

    await page.click(`[data-test="${TEST_IDS.data_request_create_submit}"]`);

    // Should show location error
    await expect(page.locator('text=Please include a location')).toBeVisible();
  });
});
