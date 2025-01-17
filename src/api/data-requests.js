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
  const requestsStore = useDataRequestsStore();

  const cached = requestsStore.getDataRequestFromCache('recent-requests');

  if (
    cached &&
    isCachedResponseValid({
      cacheTime: cached.timestamp,
      intervalBeforeInvalidation: 1000 * 60 * 3, // 3 minutes
    })
  ) {
    return cached.data;
  }

  const params = {
    sort_by: 'date_created',
    sort_order: 'DESC',
    // requested_columns: 'id,title', // Was not working, see data-sources-app/issues/581
    // request_statuses: 'Intake', // Used for testing, should be 'Ready to start'
    // limit: 3, // Not supported, see data-sources-app/issues/579
  };

  const response = await axios.get(REQUESTS_BASE, {
    headers: HEADERS_BASIC,
    params,
  });

  // Limit results to 3 items on the front end and process the data
  const recentRequests = response.data.data
    .slice(0, 3) // Limit to 3 items
    .map((item) => ({
      id: item.id,
      title: item.title,
      status: item.request_status,
      locationDisplayName:
        item.locations?.[0]?.display_name || 'Unknown location',
      route: `/data-request/${item.id}`,
    }));

  // Cache the processed data
  requestsStore.setDataRequestToCache('recent-requests', recentRequests);

  return recentRequests;
}