import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const REQUESTS_BASE = `${import.meta.env.VITE_API_URL}/data-requests`;
const HEADERS_BASE = {
  'Content-Type': 'application/json'
};

const HEADERS_BASIC = {
  ...HEADERS_BASE,
  authorization: `Basic ${import.meta.env.VITE_API_KEY}`
};

/**
 * Do not use this unless we need to get literally all of the requests in the database.
 */
export async function getAllRequests(params = {}) {
  let page = 0;
  const totalRequests = [];

  while (totalRequests.length % 100 === 0) {
    page += 1;
    const response = await axios.get(REQUESTS_BASE, {
      headers: HEADERS_BASIC,
      params: {
        ...params,
        page
      }
    });

    response.data.data.forEach((obj) => totalRequests.push(obj));
  }

  return totalRequests;
}

export async function getDataRequest(id) {
  return await axios.get(`${REQUESTS_BASE}/${id}`, {
    headers: HEADERS_BASIC
  });
}

export async function createRequest(data) {
  const auth = useAuthStore();

  return await axios.post(REQUESTS_BASE, data, {
    headers: {
      ...HEADERS_BASE,
      authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });
}

export async function getRecentRequests() {
  const params = {
    sort_by: 'date_created',
    sort_order: 'DESC'
    // requested_columns: 'id,title', // Was not working, see data-sources-app/issues/581
    // request_statuses: 'Intake', // Used for testing, should be 'Ready to start'
    // limit: 3, // Not supported, see data-sources-app/issues/579
  };

  const response = await axios.get(REQUESTS_BASE, {
    headers: HEADERS_BASIC,
    params
  });

  const recentRequests = response.data.data.slice(0, 3).map((item) => ({
    id: item.id,
    title: item.title,
    status: item.request_status,
    locationDisplayName:
      item.locations?.[0]?.display_name || 'Unknown location',
    route: `/data-request/${item.id}`
  }));

  return recentRequests;
}
