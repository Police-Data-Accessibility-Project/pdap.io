import dotenv from 'dotenv';

dotenv.config();

export const PASSWORD_AUTH = {
  email:
    process.env.E2E_TESTING_ENV === 'production'
      ? process.env.E2E_PASSWORD_AUTH_EMAIL_PROD
      : process.env.E2E_PASSWORD_AUTH_EMAIL_TEST,
  password:
    process.env.E2E_TESTING_ENV === 'production'
      ? process.env.E2E_PASSWORD_AUTH_PASSWORD_PROD
      : process.env.E2E_PASSWORD_AUTH_PASSWORD_TEST
};
