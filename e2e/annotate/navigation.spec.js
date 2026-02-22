import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { test } from '../fixtures/base';

import '../msw-setup.js';

test.describe('Annotation stepper navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/annotate');
    await page.waitForLoadState('networkidle');
  });

  test('stepper reflects current step as active', async ({ page }) => {
    const stepper = page.locator(
      `[data-test="${TEST_IDS.annotate_stepper_desktop}"]`
    );
    await expect(stepper).toBeVisible();

    // First step (URL Type) should be active — has wine-500 bg class
    const urlTypeStep = page.locator('[data-test="annotate-step-url_type"]');
    const urlTypeCircle = urlTypeStep.locator('div').first();
    await expect(urlTypeCircle).toHaveClass(/bg-brand-wine-500/);
  });

  test('stepper shows completed state after answering a step', async ({
    page
  }) => {
    // Select a URL type to mark it as answered
    await page.click('[data-test="annotate-url-type-relevant-data-source"]');

    // Wait for navigation to next step
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_location}"]`)
    ).toBeVisible({ timeout: 5000 });

    // URL Type step should show completed state (wineneutral-500 bg)
    const urlTypeStep = page.locator('[data-test="annotate-step-url_type"]');
    const urlTypeCircle = urlTypeStep.locator('div').first();
    await expect(urlTypeCircle).toHaveClass(/bg-wineneutral-500/);

    // Location step should now be active
    const locationStep = page.locator('[data-test="annotate-step-location"]');
    const locationCircle = locationStep.locator('div').first();
    await expect(locationCircle).toHaveClass(/bg-brand-wine-500/);
  });

  test('clicking an enabled step in stepper navigates to it', async ({
    page
  }) => {
    // Select URL type to enable further steps
    await page.click('[data-test="annotate-url-type-relevant-data-source"]');

    // Wait for Location step to appear
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_location}"]`)
    ).toBeVisible({ timeout: 5000 });

    // Click URL Type step to go back
    await page.click('[data-test="annotate-step-url_type"]');
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_url_type}"]`)
    ).toBeVisible();
  });

  test('disabled steps in stepper are not clickable', async ({ page }) => {
    // Without selecting URL type, steps beyond URL Type should be disabled
    const locationStep = page.locator('[data-test="annotate-step-location"]');
    await expect(locationStep).toBeDisabled();
  });

  test('skipped steps show skipped styling', async ({ page }) => {
    // Select URL type
    await page.click('[data-test="annotate-url-type-relevant-data-source"]');

    // Wait for Location step
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_location}"]`)
    ).toBeVisible({ timeout: 5000 });

    // Skip Location by clicking Next
    await page.click(`[data-test="${TEST_IDS.annotate_next_button}"]`);

    // Skip Agency by clicking Next again
    await page.click(`[data-test="${TEST_IDS.annotate_next_button}"]`);

    // Location step circle should have skipped styling
    const locationStep = page.locator('[data-test="annotate-step-location"]');
    const locationCircle = locationStep.locator('div').first();
    await expect(locationCircle).toHaveClass(/border-dashed/);
  });
});
