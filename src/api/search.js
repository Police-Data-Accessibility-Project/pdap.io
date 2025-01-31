import axios from 'axios';
import { ENDPOINTS } from './constants';
import { useAuthStore } from '@/stores/auth';
import { useSearchStore } from '@/stores/search';
import { isCachedResponseValid } from '@/api/util';

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
  const searchStore = useSearchStore();
  const baseSearchCached = searchStore.getSearchFromCache(
    JSON.stringify(params)
  );
  const federalSearchCached = searchStore.getSearchFromCache(
    // Hardcoding key as the federal response won't require parameters, and we return with all locations
    'federalSearch'
  );

  let searchResponse;
  // Handle base response
  if (
    baseSearchCached &&
    isCachedResponseValid({
      cacheTime: baseSearchCached.timestamp,
      // Cache for 5 minutes
      intervalBeforeInvalidation: 1000 * 60 * 5
    })
  ) {
    searchResponse = baseSearchCached.data;
  } else {
    const response = await axios.get(
      `${SEARCH_BASE}/${ENDPOINTS.SEARCH.RESULTS}`,
      {
        params,
        headers: {
          ...HEADERS_BASIC,
          ...(authStore.isAuthenticated()
            ? {
                Authorization: `Bearer ${authStore.$state.tokens.accessToken.value}`
              }
            : {})
        }
      }
    );

    searchResponse = response;

    searchStore.setSearchToCache(JSON.stringify(params), response);
  }

  // Handle federal response and merge with base response object
  if (
    federalSearchCached &&
    isCachedResponseValid({
      cacheTime: federalSearchCached.timestamp,
      // Cache for 15 minutes
      intervalBeforeInvalidation: 1000 * 60 * 15
    })
  ) {
    searchResponse.data.count =
      searchResponse.data.count + federalSearchCached.data.count;
    searchResponse.data.data.federal = federalSearchCached.data.data;
  } else {
    const response = await axios.get(
      `${SEARCH_BASE}/${ENDPOINTS.SEARCH.FEDERAL}`,
      {
        headers: {
          ...HEADERS_BASIC,
          ...(authStore.isAuthenticated()
            ? {
                Authorization: `Bearer ${authStore.$state.tokens.accessToken.value}`
              }
            : {})
        }
      }
    );

    searchStore.setSearchToCache('federalSearch', response);

    searchResponse.data.data.federal = response.data;
    searchResponse.data.count = searchResponse.data.count + response.data.count;
  }

  return searchResponse;
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
