import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { test } from '../fixtures/base';

import '../msw-setup.js';

/**
 * Helper to advance to the next wizard step. Selection auto-advance is
 * throttled at 250ms, so we fall back to clicking the Next button when
 * auto-advance doesn't fire in time.
 */
async function advanceToStep(page, targetTestId) {
  const target = page.locator(`[data-test="${targetTestId}"]`);
  if (await target.isVisible().catch(() => false)) return;
  try {
    await expect(target).toBeVisible({ timeout: 1000 });
  } catch {
    await page.click(`[data-test="${TEST_IDS.annotate_next_button}"]`);
    await expect(target).toBeVisible({ timeout: 5000 });
  }
}

/**
 * Helper to select the first suggestion in a step, or skip if none exist.
 * Suggestions may not exist for URLs with no prior annotations.
 */
async function selectFirstSuggestionOrSkip(page, containerTestId) {
  const label = page.locator(`[data-test="${containerTestId}"] label`).first();
  const count = await label.count();
  if (count > 0 && (await label.isVisible().catch(() => false))) {
    await label.click();
  } else {
    await page.click(`[data-test="${TEST_IDS.annotate_next_button}"]`);
  }
}

test.describe('Annotation wizard flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/annotate');
    await page.waitForLoadState('networkidle');
  });

  test('anonymous happy path: full wizard flow with submission', async ({
    page
  }) => {
    // Page should load with annotation content
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_page}"]`)
    ).toBeVisible();

    // Dismiss anon warning if visible
    const anonWarning = page.locator(
      `[data-test="${TEST_IDS.annotate_anon_warning}"]`
    );
    if (await anonWarning.isVisible()) {
      await page.click(
        `[data-test="${TEST_IDS.annotate_anon_warning_dismiss}"]`
      );
      await expect(anonWarning).toBeHidden();
    }

    // Step 1: Select URL Type — "Relevant Data Source"
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_url_type}"]`)
    ).toBeVisible();
    await page.click('[data-test="annotate-url-type-relevant-data-source"]');

    // Step 2: Location — select suggestion or skip
    await advanceToStep(page, TEST_IDS.annotate_location);
    await selectFirstSuggestionOrSkip(page, TEST_IDS.annotate_location);

    // Step 3: Agency — select suggestion or skip
    await advanceToStep(page, TEST_IDS.annotate_agency);
    await selectFirstSuggestionOrSkip(page, TEST_IDS.annotate_agency);

    // Step 4: Record Type — select first available or skip
    await advanceToStep(page, TEST_IDS.annotate_record_type);
    const recordLabel = page
      .locator(`[data-test="${TEST_IDS.annotate_record_type}"] label`)
      .first();
    const recordCount = await recordLabel.count();
    if (recordCount > 0 && (await recordLabel.isVisible().catch(() => false))) {
      await recordLabel.click();
    } else {
      await page.click(`[data-test="${TEST_IDS.annotate_next_button}"]`);
    }

    // Step 5: Name — select first option or skip
    await advanceToStep(page, TEST_IDS.annotate_name);
    const nameOption = page
      .locator(`[data-test="${TEST_IDS.annotate_name}"] .space-y-2 > div`)
      .first();
    const nameCount = await nameOption.count();
    if (nameCount > 0 && (await nameOption.isVisible().catch(() => false))) {
      await nameOption.click();
    }

    // Advance to Confirm
    await page.click(`[data-test="${TEST_IDS.annotate_next_button}"]`);

    // Step 6: Review and submit
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_confirm}"]`)
    ).toBeVisible();
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_confirm_summary}"]`)
    ).toBeVisible();

    // Submit
    await page.click(`[data-test="${TEST_IDS.annotate_submit}"]`);

    // After submit, wizard should reset to URL Type step with a new annotation
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_url_type}"]`)
    ).toBeVisible({ timeout: 15000 });
  });

  test('tab navigation: prev/next buttons enable/disable correctly', async ({
    page
  }) => {
    const prevButton = page.locator(
      `[data-test="${TEST_IDS.annotate_prev_button}"]`
    );
    const nextButton = page.locator(
      `[data-test="${TEST_IDS.annotate_next_button}"]`
    );

    // Previous should be disabled on first step
    await expect(prevButton).toBeDisabled();

    // Next should be disabled until URL type is selected
    await expect(nextButton).toBeDisabled();

    // Select URL type
    await page.click('[data-test="annotate-url-type-relevant-data-source"]');

    // Now on Location step — prev should be enabled
    await advanceToStep(page, TEST_IDS.annotate_location);
    await expect(prevButton).toBeEnabled();

    // Go back to URL Type
    await prevButton.click();
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_url_type}"]`)
    ).toBeVisible();
    await expect(prevButton).toBeDisabled();
  });

  test('skip path: selecting "Not Relevant" skips to Confirm', async ({
    page
  }) => {
    // Select "Not Relevant Or Useful"
    await page.click('[data-test="annotate-url-type-not-relevant-or-useful"]');

    // The path for "Not Relevant" is: URL Type → Confirm
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_confirm}"]`)
    ).toBeVisible({ timeout: 5000 });
  });

  test('skip path: selecting "Broken" skips to Confirm', async ({ page }) => {
    // Select "Broken / bad data"
    await page.click('[data-test="annotate-url-type-broken-bad-data"]');

    // Should auto-advance directly to Confirm
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_confirm}"]`)
    ).toBeVisible({ timeout: 5000 });
  });
});
