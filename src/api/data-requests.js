import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useDataRequestsStore } from '@/stores/data-requests';
import { isCachedResponseValid } from '@/api/util';

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
  const requestsStore = useDataRequestsStore();

  const cached = requestsStore.getDataRequestFromCache('all-requests');

  let page = 0;
  const totalRequests = [];

  if (
    cached &&
    isCachedResponseValid({
      cacheTime: cached.timestamp,
      // Cache for 3 minutes
      intervalBeforeInvalidation: 1000 * 60 * 3
    })
  ) {
    return cached.data;
  }

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

  requestsStore.setDataRequestToCache('all-requests', totalRequests);

  return totalRequests;
}

export async function getDataRequest(id) {
  const requestsStore = useDataRequestsStore();

  const cached = requestsStore.getDataRequestFromCache(id);

  if (
    cached &&
    isCachedResponseValid({
      cacheTime: cached.timestamp,
      // Cache for 5 minutes
      intervalBeforeInvalidation: 1000 * 60 * 3
    })
  ) {
    return cached.data;
  }

  const response = await axios.get(`${REQUESTS_BASE}/${id}`, {
    headers: HEADERS_BASIC
  });

  requestsStore.setDataRequestToCache(id, response);

  return response;
}

export async function createRequest(data) {
  const requestsStore = useDataRequestsStore();

  const auth = useAuthStore();
  const response = await axios.post(REQUESTS_BASE, data, {
    headers: {
      ...HEADERS_BASE,
      authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });

  requestsStore.clearCache();
  return response.data;
}

export async function getRecentRequests() {
  const params = {
    sort_by: 'date_created',
    sort_order: 'DESC'
    // requested_columns: 'id,title', // was not working, see data-sources-app/issues/581
    // request_statuses: 'Intake', // used for testing, should be 'Ready to start'
    // limit: 3, // not supported, see data-sources-app/issues/579
  };

  try {
    const response = await axios.get(REQUESTS_BASE, {
      headers: HEADERS_BASIC,
      params
    });

    return response.data.data.map((item) => ({
      id: item.id,
      title: item.title,
      status: item.request_status,
      locationDisplayName:
        item.locations?.[0]?.display_name || 'Unknown location',
      route: `/data-request/${item.id}`
    }));
  } catch (error) {
    console.error(
      'Error fetching recent requests:',
      error.response?.data || error.message
    );
    throw error;
  }
}
