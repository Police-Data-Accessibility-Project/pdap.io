const BASE_API_URL_TEST = 'https://data-sources.pdap.dev/api';
const BASE_API_URL_PROD = 'https://data-sources.pdap.io/api';
export const BASE_API_URL =
  process.env.E2E_TESTING_URL !== 'https://pdap.io'
    ? BASE_API_URL_TEST
    : BASE_API_URL_PROD;
export const OAUTH_BASE_URL = BASE_API_URL + '/oauth';
