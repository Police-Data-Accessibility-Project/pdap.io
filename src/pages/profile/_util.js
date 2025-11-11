import { COURT_WARRANT_RECORD_TYPES } from '@/util/constants';
import { normalizeParamsForSearch } from '@/util/searchParams';
import _isEqual from 'lodash/isEqual';

export function makeRawParams(search = {}) {
  const categories = Array.isArray(search.record_categories)
    ? search.record_categories.filter(
        (category) => category && category !== 'All'
      )
    : [];

  return {
    location_id: search.location_id,
    record_types: search.record_types,
    record_categories: categories.length ? [...categories] : undefined
  };
}

/**
 *
 * @param {{location_id: string, record_categories: string[], record_types: string[] }} params
 *
 * @returns {string} search or portal path represented by recent/saved search data
 */
export function makeSearchPath(params) {
  if (_isEqual(params.record_types, COURT_WARRANT_RECORD_TYPES)) {
    return '/portals/court-warrant';
  }

  const searchQuery = new URLSearchParams(normalizeParamsForSearch(params));

  return `/search/results?${searchQuery.toString()}`;
}
