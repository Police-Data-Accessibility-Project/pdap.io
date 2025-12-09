import { STATES_TO_ABBREVIATIONS } from './constants';

export function getFullLocationText(location) {
  if (!location) return '';

  switch (location.type) {
    case 'locality': {
      const locality = location.locality_name || location.name || '';
      const county = location.county_name || location.name || '';
      const stateAbbr = location.state_iso;
      return [locality, county, stateAbbr].filter(Boolean).join(', ');
    }
    case 'county': {
      const isLA = location.state_iso === 'LA';
      const county = location.county_name || location.name;
      const countyLabel = county
        ? `${county} ${isLA ? 'Parish' : 'County'}`
        : '';
      const state = location.state_name ?? location.state_iso ?? '';
      return [countyLabel, state].filter(Boolean).join(', ');
    }
    case 'state':
      return location.state_name ?? location.state_iso ?? '';
    default:
      return 'United States'; // Assumes federal as fallback in case no location data or display name
  }
}

export function getLocationCityState(location) {
  if (!location) return '';

  const locality = location.locality_name;
  const stateAbbr = STATES_TO_ABBREVIATIONS.get(location.state_name);
  const state = location.state_name;
  const displayName = location?.display_name;

  if (location.type === 'locality') {
    if (locality && !state && !stateAbbr) return locality;
    else if (locality && stateAbbr) return `${locality}, ${stateAbbr}`;
    else if (locality && state) return `${locality}, ${state}`;
  } else if (location.type === 'county' || location.type === 'state') {
    return state ?? '';
  }
  return displayName ?? '';
}

export function getMinimalLocationText(location) {
  return getLocationCityState(location) || location?.display_name || '';
}

export function getMostNarrowSearchLocationWithResults(location) {
  if (!location) return null;
  if (location?.type) return location.type.toLowerCase();
  if (location?.locality_name) return 'locality';
  if (location?.county_name) return 'county';
  if (location?.state_name) return 'state';
  if (location?.federal) return 'federal';
  // return 'federal';
  return null;
}
