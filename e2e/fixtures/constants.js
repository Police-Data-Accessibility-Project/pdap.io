import dotenv from 'dotenv';
dotenv.config();

export const OAUTH_BASE_URL = process.env.VITE_API_URL + '/oauth';
