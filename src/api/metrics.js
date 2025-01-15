import axios from 'axios';

const METRICS_BASE = `${import.meta.env.VITE_API_URL}/metrics`;
const HEADERS = {
  'Content-Type': 'application/json'
};
const HEADERS_BASIC = {
  ...HEADERS,
  authorization: `Basic ${import.meta.env.VITE_API_KEY}`
};

export async function getMetrics() {
    const response = await axios.get(`${METRICS_BASE}`, {
      headers: HEADERS_BASIC,
    });
    return response.data;
  }