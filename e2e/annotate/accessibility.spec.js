import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { test } from '../fixtures/base';
import AxeBuilder from '@axe-core/playwright';

import '../msw-setup.js';

/**
 * Accessibility tests for the annotation wizard using axe-core.
 *
 * Checks WCAG 2 AA compliance at each wizard step.
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

async function selectFirstSuggestionOrSkip(page, containerTestId) {
  const label = page.locator(`[data-test="${containerTestId}"] label`).first();
  const count = await label.count();
  if (count > 0 && (await label.isVisible().catch(() => false))) {
    await label.click();
  } else {
    await page.click(`[data-test="${TEST_IDS.annotate_next_button}"]`);
  }
}

/**
 * Helper to format axe violations for readable test output.
 */
function formatViolations(violations) {
  return violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes.map((n) => n.html.substring(0, 150))
  }));
}

/**
 * Create an axe builder scoped to the annotation wizard with
 * upstream design system elements excluded (their contrast issues
 * should be fixed in the design-system repo, not here).
 */
function wizardAxeBuilder(page) {
  return new AxeBuilder({ page })
    .include(`[data-test="${TEST_IDS.annotate_wizard}"]`)
    .exclude('.pdap-button-primary')
    .exclude('.pdap-button-secondary')
    .withTags(['wcag2aa', 'wcag2a']);
}

test.describe('Annotation accessibility (axe-core)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/annotate');
    await page.waitForLoadState('networkidle');

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
  });

  test('URL Type step passes WCAG 2 AA', async ({ page }) => {
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_url_type}"]`)
    ).toBeVisible();

    const results = await wizardAxeBuilder(page).analyze();

    expect(
      results.violations,
      `Accessibility violations found:\n${JSON.stringify(formatViolations(results.violations), null, 2)}`
    ).toEqual([]);
  });

  test('URL Type selected state passes WCAG 2 AA', async ({ page }) => {
    // Select a URL type to trigger the selected state
    await page.click('[data-test="annotate-url-type-relevant-data-source"]');

    // Go back to URL Type to see the selected state
    await page.click(`[data-test="${TEST_IDS.annotate_prev_button}"]`);
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_url_type}"]`)
    ).toBeVisible();

    const results = await wizardAxeBuilder(page).analyze();

    expect(
      results.violations,
      `Accessibility violations found:\n${JSON.stringify(formatViolations(results.violations), null, 2)}`
    ).toEqual([]);
  });

  test('Location step passes WCAG 2 AA', async ({ page }) => {
    await page.click('[data-test="annotate-url-type-relevant-data-source"]');
    await advanceToStep(page, TEST_IDS.annotate_location);

    const results = await wizardAxeBuilder(page).analyze();

    expect(
      results.violations,
      `Accessibility violations found:\n${JSON.stringify(formatViolations(results.violations), null, 2)}`
    ).toEqual([]);
  });

  test('Agency step passes WCAG 2 AA', async ({ page }) => {
    await page.click('[data-test="annotate-url-type-relevant-data-source"]');
    await advanceToStep(page, TEST_IDS.annotate_location);
    await selectFirstSuggestionOrSkip(page, TEST_IDS.annotate_location);
    await advanceToStep(page, TEST_IDS.annotate_agency);

    const results = await wizardAxeBuilder(page).analyze();

    expect(
      results.violations,
      `Accessibility violations found:\n${JSON.stringify(formatViolations(results.violations), null, 2)}`
    ).toEqual([]);
  });

  test('Record Type step passes WCAG 2 AA', async ({ page }) => {
    await page.click('[data-test="annotate-url-type-relevant-data-source"]');
    await advanceToStep(page, TEST_IDS.annotate_location);
    await selectFirstSuggestionOrSkip(page, TEST_IDS.annotate_location);
    await advanceToStep(page, TEST_IDS.annotate_agency);
    await selectFirstSuggestionOrSkip(page, TEST_IDS.annotate_agency);
    await advanceToStep(page, TEST_IDS.annotate_record_type);

    const results = await wizardAxeBuilder(page).analyze();

    expect(
      results.violations,
      `Accessibility violations found:\n${JSON.stringify(formatViolations(results.violations), null, 2)}`
    ).toEqual([]);
  });

  test('Name step passes WCAG 2 AA', async ({ page }) => {
    await page.click('[data-test="annotate-url-type-relevant-data-source"]');
    await advanceToStep(page, TEST_IDS.annotate_location);
    await selectFirstSuggestionOrSkip(page, TEST_IDS.annotate_location);
    await advanceToStep(page, TEST_IDS.annotate_agency);
    await selectFirstSuggestionOrSkip(page, TEST_IDS.annotate_agency);
    await advanceToStep(page, TEST_IDS.annotate_record_type);

    const recordLabel = page
      .locator(`[data-test="${TEST_IDS.annotate_record_type}"] label`)
      .first();
    if (
      (await recordLabel.count()) > 0 &&
      (await recordLabel.isVisible().catch(() => false))
    ) {
      await recordLabel.click();
    } else {
      await page.click(`[data-test="${TEST_IDS.annotate_next_button}"]`);
    }

    await advanceToStep(page, TEST_IDS.annotate_name);

    // Select first name option to trigger the "Selected" banner
    const nameOption = page
      .locator(`[data-test="${TEST_IDS.annotate_name}"] .space-y-2 > div`)
      .first();
    if (
      (await nameOption.count()) > 0 &&
      (await nameOption.isVisible().catch(() => false))
    ) {
      await nameOption.click();
    }

    const results = await wizardAxeBuilder(page).analyze();

    expect(
      results.violations,
      `Accessibility violations found:\n${JSON.stringify(formatViolations(results.violations), null, 2)}`
    ).toEqual([]);
  });

  test('Confirm step passes WCAG 2 AA', async ({ page }) => {
    await page.click('[data-test="annotate-url-type-relevant-data-source"]');
    await advanceToStep(page, TEST_IDS.annotate_location);
    await selectFirstSuggestionOrSkip(page, TEST_IDS.annotate_location);
    await advanceToStep(page, TEST_IDS.annotate_agency);
    await selectFirstSuggestionOrSkip(page, TEST_IDS.annotate_agency);
    await advanceToStep(page, TEST_IDS.annotate_record_type);

    const recordLabel = page
      .locator(`[data-test="${TEST_IDS.annotate_record_type}"] label`)
      .first();
    if (
      (await recordLabel.count()) > 0 &&
      (await recordLabel.isVisible().catch(() => false))
    ) {
      await recordLabel.click();
    } else {
      await page.click(`[data-test="${TEST_IDS.annotate_next_button}"]`);
    }

    await advanceToStep(page, TEST_IDS.annotate_name);
    await page.click(`[data-test="${TEST_IDS.annotate_next_button}"]`);
    await expect(
      page.locator(`[data-test="${TEST_IDS.annotate_confirm}"]`)
    ).toBeVisible();

    const results = await wizardAxeBuilder(page).analyze();

    expect(
      results.violations,
      `Accessibility violations found:\n${JSON.stringify(formatViolations(results.violations), null, 2)}`
    ).toEqual([]);
  });
});
