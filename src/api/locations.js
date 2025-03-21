import axios from 'axios';
import { ENDPOINTS } from './constants';

const LOCATIONS_BASE = `${import.meta.env.VITE_API_URL}/locations`;
const HEADERS = {
  'Content-Type': 'application/json'
};
const HEADERS_BASIC = {
  ...HEADERS,
  authorization: `Basic ${import.meta.env.VITE_API_KEY}`
};

export async function getLocation(id) {
  return await axios.get(`${LOCATIONS_BASE}/${id}`, {
    headers: HEADERS_BASIC
  });
}

export async function getLocationDataRequests(id) {
  return await axios.get(
    `${LOCATIONS_BASE}/${id}/${ENDPOINTS.LOCATIONS.ID.DATA_REQUESTS}`,
    {
      headers: HEADERS_BASIC
    }
  );
}
