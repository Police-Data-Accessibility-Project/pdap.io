import { STATES_TO_ABBREVIATIONS } from './constants';

export function getFullLocationText(location) {
  if (Object.hasOwn(location, 'display_name')) {
    return location.display_name;
  }

  const searched = getMostNarrowSearchLocationWithResults(location);
  switch (searched) {
    case 'locality':
      return `${location.locality_name}, ${location.county_name}, ${STATES_TO_ABBREVIATIONS.get(location.state_name)}`;
    case 'county':
      return `${location.county_name} ${STATES_TO_ABBREVIATIONS.get(location.state_name) === 'LA' ? 'Parish' : 'County'}, ${location.state_name}`;
    case 'state':
      return location.state_name;
    default:
      return location.display_name ?? '';
  }
}

export function getLocationCityState(location) {
  const searched = getMostNarrowSearchLocationWithResults(location);

  const locality = location.locality_name;
  const stateAbbr = STATES_TO_ABBREVIATIONS.get(location.state_name);
  const state = location.state_name;
  const displayName = location.display_name;

  if (searched === 'locality') {
    if (locality && !state && !stateAbbr) return locality;
    else if (locality && stateAbbr) return `${locality}, ${stateAbbr}`;
    else if (locality && state) return `${locality}, ${state}`;
  } else if (searched === 'county' || searched === 'state') {
    return state;
  } else return displayName;
}

export function getMinimalLocationText(location) {
  return getLocationCityState(location) || location.display_name;
}

export function getMostNarrowSearchLocationWithResults(location) {
  if (!location) return null;
  if (location?.locality_name) return 'locality';
  if (location?.county_name) return 'county';
  if (location?.state_name) return 'state';
  if (location?.federal) return 'federal';
  return location?.type?.toLowerCase();
}
