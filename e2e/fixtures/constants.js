import dotenv from 'dotenv';
dotenv.config();

export const AUTH_BASE_URL = process.env.VITE_API_URL + '/auth';
export const OAUTH_BASE_URL = process.env.VITE_API_URL + '/oauth';
export const DATA_REQUESTS_BASE_URL =
  process.env.VITE_API_URL + '/data-requests';
export const USER_BASE_V3_URL = process.env.VITE_API_URL_V3 + '/user';

export const TEST_USER = {
  id: 'test-user-id',
  email: 'test_user@example.com'
};
