import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const DATA_SOURCES_BASE = `${import.meta.env.VITE_API_URL}/data-sources`;
const HEADERS_BASE = {
  'Content-Type': 'application/json'
};
const HEADERS_BASIC = {
  ...HEADERS_BASE,
  authorization: `Basic ${import.meta.env.VITE_API_KEY}`
};

export async function getDataSource(id) {
  const result = await axios.get(`${DATA_SOURCES_BASE}/${id}`, {
    headers: HEADERS_BASIC
  });
  const unique_jurisdictions = [];
  const unique_agency_type = [];

  result.data.data.agencies.forEach((agency) => {
    if (!unique_jurisdictions.includes(agency.jurisdiction_type)) {
      unique_jurisdictions.push(agency.jurisdiction_type);
    }

    if (!unique_agency_type.includes(agency.agency_type)) {
      unique_agency_type.push(agency.agency_type);
    }
  });

  result.data.data.unique_jurisdictions = unique_jurisdictions;
  result.data.data.unique_agency_type = unique_agency_type;
  return result;
}

export async function createDataSource(data) {
  const auth = useAuthStore();
  return await axios.post(DATA_SOURCES_BASE, data, {
    headers: {
      ...HEADERS_BASE,
      authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });
}

export async function getRecentSources() {
  const params = {
    sort_by: 'created_at',
    sort_order: 'DESC',
    // requested_columns: 'id,name,created_at,source_url',  // Was not working, see data-sources-app/issues/581
    approval_status: 'approved'
  };

  const response = await axios.get(DATA_SOURCES_BASE, {
    headers: HEADERS_BASIC,
    params
  });

  const recentSources = response.data.data.slice(0, 3).map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.created_at,
    sourceUrl: item.source_url,
    route: `/data-source/${item.id}`
  }));

  return recentSources;
}
