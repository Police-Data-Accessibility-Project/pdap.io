import { expect } from '@playwright/test';
import { TEST_IDS } from '../fixtures/test-ids';
import { test } from '../fixtures/base';

import '../msw-setup.js';

const COURT_WARRANT_SEARCH_FIXTURE = {
  count: 3,
  data: {
    federal: {
      count: 0,
      results: []
    },
    state: {
      count: 1,
      results: [
        {
          id: 5001,
          agency_name: 'California Judicial Branch',
          data_source_name: 'California Statewide Court Cases',
          record_type: 'Court cases',
          description: 'Statewide docket data.',
          state_iso: 'CA',
          coverage_start: '2020',
          coverage_end: '2024',
          source_url: 'https://example.com/statewide'
        }
      ]
    },
    county: {
      count: 1,
      results: [
        {
          id: 5002,
          agency_name: 'Los Angeles Superior Court',
          data_source_name: 'Los Angeles County Warrants',
          record_type: 'Wanted persons',
          description: 'Active warrant list.',
          state_iso: 'CA',
          county_name: 'Los Angeles County',
          county_fips: '06037',
          source_url: 'https://example.com/county'
        }
      ]
    },
    locality: {
      count: 1,
      results: [
        {
          id: 5003,
          agency_name: 'Los Angeles Police Department',
          data_source_name: 'LAPD Warrant Notices',
          record_type: 'Court cases',
          description: 'City level warrants.',
          state_iso: 'CA',
          municipality: 'Los Angeles',
          county_fips: '06037',
          source_url: 'https://example.com/local'
        }
      ]
    }
  }
};

const COURT_WARRANT_MAP_FIXTURE = {
  locations: {
    states: [
      {
        location_id: 100,
        name: 'California',
        state_iso: 'CA',
        fips: '06'
      }
    ],
    counties: [
      {
        location_id: 101,
        name: 'Los Angeles County',
        state_iso: 'CA',
        fips: '06037'
      }
    ],
    localities: [
      {
        location_id: 102,
        name: 'Los Angeles',
        state_iso: 'CA',
        county_name: 'Los Angeles County',
        county_fips: '06037'
      }
    ]
  }
};

async function mockCourtWarrantEndpoints(page) {
  await page.route('**/api/v2/map/data**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(COURT_WARRANT_MAP_FIXTURE)
    });
  });

  await page.route('**/api/v2/search**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(COURT_WARRANT_SEARCH_FIXTURE)
    });
  });
}

test.describe('Court & Warrant Portal', () => {
  test('displays landing content and follow prompt', async ({ page }) => {
    await mockCourtWarrantEndpoints(page);

    await page.goto('/portals/court-warrant');

    await expect(page).toHaveURL(/\/portals\/court-warrant$/);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Court and Warrant Data Sources'
      })
    ).toBeVisible();

    const followButton = page.getByRole('button', {
      name: 'Follow this search'
    });
    await expect(followButton).toBeVisible();
    await expect(followButton).toBeDisabled();

    await expect(
      page.locator('p').filter({ hasText: 'Sign in to follow this search.' })
    ).toBeVisible();
  });

  test('renders map view and grouped results', async ({ page }) => {
    await mockCourtWarrantEndpoints(page);

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
    await expect(dataSourceLinks).toHaveCount(3);
    await expect(
      dataSourceLinks.filter({
        hasText: 'California Statewide Court Cases'
      })
    ).toHaveCount(1);
    await expect(
      dataSourceLinks.filter({ hasText: 'Los Angeles County Warrants' })
    ).toHaveCount(1);
    await expect(
      dataSourceLinks.filter({ hasText: 'LAPD Warrant Notices' })
    ).toHaveCount(1);
  });
});
