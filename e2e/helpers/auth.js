import { PASSWORD_AUTH } from '../fixtures/users';
import { TEST_IDS } from '../fixtures/test-ids';

export async function signInWithPassword(page) {
  await page.goto('/sign-in');

  await page.fill(
    `input[data-test="${TEST_IDS.email_input}"]`,
    PASSWORD_AUTH.email
  );
  await page.fill(
    `input[data-test="${TEST_IDS.password_input}"]`,
    PASSWORD_AUTH.password
  );

  const navigateAwayFromSignIn = page.waitForURL(
    (url) => !url.pathname.endsWith('/sign-in'),
    { timeout: 30000 }
  );

  await Promise.all([
    navigateAwayFromSignIn,
    page.click(`[data-test="${TEST_IDS.sign_in_submit}"]`)
  ]);

  await page.waitForLoadState('networkidle');
}
