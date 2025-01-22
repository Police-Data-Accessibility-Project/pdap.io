import axios from 'axios';
import { isCachedResponseValid } from '@/api/util';
import { useAuthStore } from '@/stores/auth';
import { useDataSourceStore } from '@/stores/data-source';
import { useSearchStore } from '@/stores/search';

const DATA_SOURCES_BASE = `${import.meta.env.VITE_API_URL}/data-sources`;
const HEADERS_BASE = {
  'Content-Type': 'application/json'
};
const HEADERS_BASIC = {
  ...HEADERS_BASE,
  authorization: `Basic ${import.meta.env.VITE_API_KEY}`
};

export async function createDataSource(data) {
  const auth = useAuthStore();
  const dataSourceStore = useDataSourceStore();
  const searchStore = useSearchStore();

  const response = await axios.post(DATA_SOURCES_BASE, data, {
    headers: {
      ...HEADERS_BASE,
      authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });

  dataSourceStore.clearCache();
  searchStore.clearCache();
  return response;
}

export async function getDataSource(id) {
  const dataSourceStore = useDataSourceStore();

  const cached = dataSourceStore.getDataSourceFromCache(id);

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

  const response = await axios.get(`${DATA_SOURCES_BASE}/${id}`, {
    headers: HEADERS_BASIC
  });

  dataSourceStore.setDataSourceToCache(id, response);

  return response;
}

export async function getRecentSources() {
  const dataSourceStore = useDataSourceStore();
  const cached = dataSourceStore.getDataSourceFromCache('recent-sources');

  if (
    cached &&
    isCachedResponseValid({
      cacheTime: cached.timestamp,
      // Cache for 3 minutes
      intervalBeforeInvalidation: 1000 * 60 * 3,
    })
  ) {
    return cached.data;
  }

  const params = {
    sort_by: 'created_at',
    sort_order: 'DESC',
    // requested_columns: 'id,name,created_at,source_url',  // Was not working, see data-sources-app/issues/581
    approval_status: 'approved',
  };

  try {
    const response = await axios.get(DATA_SOURCES_BASE, {
      headers: HEADERS_BASIC,
      params,
    });

    const recentSources = response.data.data
      .slice(0, 3)
      .map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: item.created_at,
      sourceUrl: item.source_url,
      route: `/data-source/${item.id}`,
    }));

    dataSourceStore.setDataSourceToCache('recent-sources', recentSources);

    return recentSources;
  } catch (error) {
    console.error('Error fetching recent sources:', error.response?.data || error.message);
    throw error;
  }
}