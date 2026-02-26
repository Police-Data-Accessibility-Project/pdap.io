import dotenv from 'dotenv';
dotenv.config();

export const AUTH_BASE_URL = process.env.VITE_API_URL + '/auth';
export const OAUTH_BASE_URL = process.env.VITE_API_URL + '/oauth';
