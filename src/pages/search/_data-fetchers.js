import { getLocation, getLocationDataRequests } from '@/api/locations';
import { getFollowedSearch, search } from '../../api/search';
import { getMostNarrowSearchLocationWithResults } from '@/util/locationFormatters';
import { normalizeLocaleForHash } from './_util';

export async function getSearchResults(route) {
  const searchLocation = await getLocation(route.query.location_id);
  const searched = getMostNarrowSearchLocationWithResults(searchLocation.data);
  const response = await search(route.query);

  return {
    response: response.data,
    searched,
    location: searchLocation.data,
    hash: normalizeLocaleForHash(searched, response.data)
  };
}

export async function getIsFollowed(route) {
  const isFollowed = await getFollowedSearch(route.query.location_id);
  return isFollowed;
}

export async function getLocationRequests(route) {
  const requests = await getLocationDataRequests(route.query.location_id);

  return requests.data.data;
}
