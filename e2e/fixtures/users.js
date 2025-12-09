import dotenv from 'dotenv';

// Load env twice: base .env first, then mode-specific file (e.g. .env.development)
const mode = process.env.E2E_TESTING_ENV || 'development';
dotenv.config();
dotenv.config({ path: `.env.${mode}`, override: true });

export const PASSWORD_AUTH = {
  email:
    process.env.E2E_TESTING_ENV === 'production'
      ? process.env.E2E_PASSWORD_AUTH_EMAIL_PROD || 'prod_user@example.com'
      : process.env.E2E_PASSWORD_AUTH_EMAIL_TEST || 'test_user@example.com',
  password:
    process.env.E2E_TESTING_ENV === 'production'
      ? process.env.E2E_PASSWORD_AUTH_PASSWORD_PROD || 'prod_password'
      : process.env.E2E_PASSWORD_AUTH_PASSWORD_TEST || 'test_password'
};

export const TEST_RESET_EMAIL =
  process.env.E2E_TESTING_ENV === 'production'
    ? process.env.E2E_PW_RESET_EMAIL_PROD
    : process.env.E2E_PW_RESET_EMAIL_TEST;

export const SIGNUP_EMAIL =
  process.env.E2E_TESTING_ENV === 'production'
    ? process.env.E2E_SIGNUP_EMAIL_PROD
    : process.env.E2E_SIGNUP_EMAIL_TEST;
