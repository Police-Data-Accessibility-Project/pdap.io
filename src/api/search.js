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

function buildSearchParams(params) {
  const qs = new URLSearchParams();

  if (params?.location_id) qs.set('location_id', params.location_id);

  const cats = params?.record_categories;
  if (Array.isArray(cats) && cats.length) {
    qs.set('record_categories', cats.join(','));
  } else if (typeof cats === 'string' && cats.length) {
    // Already comma-separated string
    qs.set('record_categories', cats);
  }

  return qs;
}

export async function search(params) {
  const authStore = useAuthStore();

  return await axios.get(`${SEARCH_BASE}/${ENDPOINTS.SEARCH.RESULTS}`, {
    params: buildSearchParams(params),
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

    return response.data.data.find(
      ({ location_id: followed_id }) =>
        Number(followed_id) === Number(location_id)
    );
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
