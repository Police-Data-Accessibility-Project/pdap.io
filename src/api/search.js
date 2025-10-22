import axios from 'axios';

import { ENDPOINTS } from './constants';
import { useAuthStore } from '@/stores/auth';

const SEARCH_BASE = `${import.meta.env.VITE_API_URL}/search`;
const JSON_HEADERS = { 'Content-Type': 'application/json' };
const BASIC_HEADERS = {
  ...JSON_HEADERS,
  authorization: `Basic ${import.meta.env.VITE_API_KEY}`
};

function withAuthHeaders(baseHeaders = JSON_HEADERS) {
  const authStore = useAuthStore();
  return {
    ...baseHeaders,
    ...(authStore.isAuthenticated()
      ? { Authorization: `Bearer ${authStore.$state.tokens.accessToken.value}` }
      : {})
  };
}

export async function search(params = {}) {
  return axios.get(SEARCH_BASE, {
    params: { ...params },
    headers: withAuthHeaders(BASIC_HEADERS)
  });
}

export async function searchFederal(params = {}) {
  return axios.get(`${SEARCH_BASE}/${ENDPOINTS.SEARCH.FEDERAL}`, {
    params,
    headers: withAuthHeaders(BASIC_HEADERS)
  });
}

export async function followSearch(locationId) {
  const auth = useAuthStore();

  return axios.post(`${SEARCH_BASE}/${ENDPOINTS.SEARCH.FOLLOW}`, null, {
    params: { location_id: locationId },
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });
}

export async function followNationalSearch(params = {}) {
  const auth = useAuthStore();

  return axios.post(
    `${SEARCH_BASE}/${ENDPOINTS.SEARCH.FOLLOW_NATIONAL}`,
    null,
    {
      params,
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
      }
    }
  );
}

export async function getFollowedSearches() {
  const auth = useAuthStore();

  const response = await axios.get(
    `${SEARCH_BASE}/${ENDPOINTS.SEARCH.FOLLOW}`,
    {
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
      }
    }
  );

  response.data.data.forEach((followed) => {
    Object.entries(followed).forEach(([key, value]) => {
      if (!value) {
        delete followed[key];
      }
    });
  });

  return response;
}

export async function getFollowedNationalSearch(params = {}) {
  const auth = useAuthStore();

  if (!auth.isAuthenticated()) return false;

  const response = await axios.get(
    `${SEARCH_BASE}/${ENDPOINTS.SEARCH.FOLLOW_NATIONAL}`,
    {
      params,
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
      }
    }
  );

  const payload = response?.data;

  if (typeof payload === 'boolean') return payload;
  if (payload?.data === undefined) return Boolean(payload);
  if (typeof payload.data === 'boolean') return payload.data;
  if (typeof payload.data?.followed === 'boolean') return payload.data.followed;

  return Boolean(payload.data);
}

export async function getFollowedSearch(locationId) {
  const auth = useAuthStore();

  if (!auth.isAuthenticated()) return false;

  try {
    const response = await getFollowedSearches();

    return response.data.data.find(
      ({ location_id: followedId }) => Number(followedId) === Number(locationId)
    );
  } catch (error) {
    return null;
  }
}

export async function deleteFollowedSearch(locationId) {
  const auth = useAuthStore();

  return axios.delete(`${SEARCH_BASE}/${ENDPOINTS.SEARCH.FOLLOW}`, {
    params: { location_id: locationId },
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });
}
