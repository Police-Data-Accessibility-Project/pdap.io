import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { test } from '../fixtures/base';

test.describe('Court & Warrant Portal', () => {
  test('displays landing content and follow prompt', async ({ page }) => {
    await page.goto('/portals/court-warrant');

    await expect(page).toHaveURL(/\/portals\/court-warrant$/);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Court and Warrant Data Sources'
      })
    ).toBeVisible();

    // Follow controls may be hidden by feature flag; assert presence only when rendered
    const followButton = page.getByRole('button', {
      name: 'Follow this search'
    });
    // if ((await followButton.count()) > 0) {
    await expect(followButton).toBeVisible();
    await expect(followButton).toBeDisabled();
    await expect(
      page.locator('p').filter({ hasText: 'Sign in to follow this search.' })
    ).toBeVisible();
    // }
  });

  test('renders map view and grouped results', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/portals/court-warrant');

    const mapLocator = page.locator(
      `div[data-test="${TEST_IDS.data_source_map}"]`
    );
    await mapLocator.waitFor({ state: 'visible' });
    await expect(mapLocator).toBeVisible();

    const geographyNav = page
      .locator('nav')
      .filter({ hasText: 'Geographic level:' });
    await geographyNav.waitFor({ state: 'visible' });
    await expect(
      geographyNav.locator('button', { hasText: 'local' })
    ).toBeVisible();
    await expect(
      geographyNav.locator('button', { hasText: 'county' })
    ).toBeVisible();
    await expect(
      geographyNav.locator('button', { hasText: 'state' })
    ).toBeVisible();

    const dataSourceLinks = page.locator(
      `[data-test="${TEST_IDS.data_source_link}"]`
    );
    const linkCount = await dataSourceLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});
