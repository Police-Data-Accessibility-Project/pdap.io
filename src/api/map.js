import axios from 'axios';

import { ENDPOINTS } from './constants';

const MAP_BASE = `${import.meta.env.VITE_API_URL}/map`;
const HEADERS_BASE = {
  'Content-Type': 'application/json'
};
const HEADERS_BASIC = {
  ...HEADERS_BASE,
  authorization: `Basic ${import.meta.env.VITE_API_KEY}`
};

export async function getMapLocations(params = {}) {
  const hasParams = params && Object.keys(params).length > 0;

  return await axios.get(`${MAP_BASE}/${ENDPOINTS.MAP.DATA}`, {
    headers: HEADERS_BASIC,
    params: hasParams ? params : undefined
  });
}
