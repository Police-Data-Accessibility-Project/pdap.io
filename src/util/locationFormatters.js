import { STATES_TO_ABBREVIATIONS } from './constants';

export function getFullLocationText(location) {
  if (!location) return '';
  if ('display_name' in location && location.display_name) {
    return location.display_name;
  }

  const searched = getMostNarrowSearchLocationWithResults(location);
  switch (searched) {
    case 'locality': {
      const locality = location.locality_name ?? '';
      const county = location.county_name ?? '';
      const stateAbbr =
        STATES_TO_ABBREVIATIONS.get(location.state_name) ??
        location.state_name ??
        '';
      return [locality, county, stateAbbr].filter(Boolean).join(', ');
    }
    case 'county': {
      const isLA =
        (STATES_TO_ABBREVIATIONS.get(location.state_name) ?? '') === 'LA';
      const countyLabel = location.county_name
        ? `${location.county_name} ${isLA ? 'Parish' : 'County'}`
        : '';
      const state = location.state_name ?? '';
      return [countyLabel, state].filter(Boolean).join(', ');
    }
    case 'state':
      return location.state_name ?? '';
    default:
      return location?.display_name ?? 'United States - All'; // Assumes federal as fallback in case no location data or display name
  }
}

export function getLocationCityState(location) {
  if (!location) return '';
  const searched = getMostNarrowSearchLocationWithResults(location);

  const locality = location.locality_name;
  const stateAbbr = STATES_TO_ABBREVIATIONS.get(location.state_name);
  const state = location.state_name;
  const displayName = location?.display_name;

  if (searched === 'locality') {
    if (locality && !state && !stateAbbr) return locality;
    else if (locality && stateAbbr) return `${locality}, ${stateAbbr}`;
    else if (locality && state) return `${locality}, ${state}`;
  } else if (searched === 'county' || searched === 'state') {
    return state ?? '';
  }
  return displayName ?? '';
}

export function getMinimalLocationText(location) {
  return getLocationCityState(location) || location?.display_name || '';
}

export function getMostNarrowSearchLocationWithResults(location) {
  if (!location) return null;
  if (location?.locality_name) return 'locality';
  if (location?.county_name) return 'county';
  if (location?.state_name) return 'state';
  if (location?.federal) return 'federal';
  return location?.type?.toLowerCase();
}
