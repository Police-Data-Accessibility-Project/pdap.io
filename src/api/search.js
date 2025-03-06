import axios from 'axios';
import { ENDPOINTS } from './constants';
import { useAuthStore } from '@/stores/auth';

const SEARCH_BASE = `${import.meta.env.VITE_API_URL}/search`;
const HEADERS = {
  'Content-Type': 'application/json'
};
const HEADERS_BASIC = {
  ...HEADERS,
  authorization: `Basic ${import.meta.env.VITE_API_KEY}`
};

export async function search(params) {
  const authStore = useAuthStore();

  return await axios.get(`${SEARCH_BASE}/${ENDPOINTS.SEARCH.RESULTS}`, {
    params,
    headers: {
      ...HEADERS_BASIC,
      ...(authStore.isAuthenticated()
        ? {
            Authorization: `Bearer ${authStore.$state.tokens.accessToken.value}`
          }
        : {})
    }
  });
}

export async function searchFederal() {
  const authStore = useAuthStore();

  return await axios.get(`${SEARCH_BASE}/${ENDPOINTS.SEARCH.FEDERAL}`, {
    headers: {
      ...HEADERS_BASIC,
      ...(authStore.isAuthenticated()
        ? {
            Authorization: `Bearer ${authStore.$state.tokens.accessToken.value}`
          }
        : {})
    }
  });
}

export async function followSearch(location_id) {
  const auth = useAuthStore();

  return await axios.post(`${SEARCH_BASE}/${ENDPOINTS.SEARCH.FOLLOW}`, null, {
    params: {
      location_id
    },
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });
}
export async function getFollowedSearches() {
  const auth = useAuthStore();

  const response = await axios.get(
    `${SEARCH_BASE}/${ENDPOINTS.SEARCH.FOLLOW}`,
    {
      headers: {
        ...HEADERS,
        Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
      }
    }
  );

  response.data.data.map((followed) => {
    Object.entries(followed).forEach(([key, value]) => {
      if (!value) {
        delete followed[key];
      }
    });
    return followed;
  });

  return response;
}
export async function getFollowedSearch(location_id) {
  const auth = useAuthStore();

  if (!auth.isAuthenticated()) return false;

  try {
    const response = await getFollowedSearches();

    const found = response.data.data.find(
      ({ location_id: followed_id }) =>
        Number(followed_id) === Number(location_id)
    );
    return found;
  } catch (error) {
    return null;
  }
}
export async function deleteFollowedSearch(location_id) {
  const auth = useAuthStore();

  return await axios.delete(`${SEARCH_BASE}/${ENDPOINTS.SEARCH.FOLLOW}`, {
    params: {
      location_id
    },
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });
}
