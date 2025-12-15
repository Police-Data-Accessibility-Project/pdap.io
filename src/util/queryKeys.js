export const SEARCH = 'search';
export const SEARCH_FEDERAL = 'search_federal';
export const SEARCH_FOLLOWED = 'search_followed';
export const SEARCH_FOLLOWED_NATIONAL = 'search_followed_national';
export const DATA_REQUEST = 'data_request';
export const DATA_SOURCE = 'data_source';
export const GITHUB_AUTH = 'github_auth';
export const PROFILE = 'profile';
export const TYPEAHEAD_LOCATIONS = 'typeahead_locations';
export const TYPEAHEAD_AGENCIES = 'typeahead_agencies';
export const LOCATION = 'location';

export const ANNOTATE = 'annotate';
/**
 * Creates a predicate function to check if a query key includes a partial string.
 * Matches both array and string syntax
 *
 * @param {string} partial - The partial string to search for in the query key.
 * @returns {(query) => boolean} A function that takes a query object and returns a boolean indicating if the query key includes the partial string.
 */
export const makeQueryPredicate = (partial) => (query) =>
  (Array.isArray(query.queryKey) && query.queryKey.includes(partial)) ||
  (typeof query.queryKey === 'string' && query.queryKey.includes(partial));
