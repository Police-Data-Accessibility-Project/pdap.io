import { getLocation, getLocationDataRequests } from '@/api/locations';
import { getFollowedSearch, search } from '../../api/search';
import { getMostNarrowSearchLocationWithResults } from '@/util/locationFormatters';
import { normalizeLocaleForHash } from './_util';

export async function getSearchResults(route) {
  const searchLocation = route.query.location_id
    ? await getLocation(route.query.location_id)
    : undefined;
  const resolvedLocation = searchLocation?.data?.data ?? null;
  const searched = getMostNarrowSearchLocationWithResults(resolvedLocation);
  const response = await search(route.query);

  return {
    response: response.data,
    searched,
    location: resolvedLocation,
    hash: normalizeLocaleForHash(searched, response.data)
  };
}

export async function getIsFollowed(route) {
  try {
    const isFollowed = await getFollowedSearch(route.query.location_id);
    return !!isFollowed;
  } catch {
    return false;
  }
}

export async function getLocationRequests(route) {
  if (route.query.location_id) {
    const requests = await getLocationDataRequests(route.query.location_id);

    return requests.data.data;
  }
  return null;
}
