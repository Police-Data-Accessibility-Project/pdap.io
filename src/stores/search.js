import { defineStore } from 'pinia';
import { getFullLocationText } from '@/util/locationFormatters';

function normalizeLocationId(raw) {
  if (raw === undefined || raw === null || raw === '') return null;
  return String(raw);
}

function ensureDisplayName(location) {
  if (!location) return location;

  const payload = { ...location };
  if (payload.type === 'state' && !payload.state_name && payload.name) {
    payload.state_name = payload.name;
  }
  if (payload.type === 'county' && !payload.county_name && payload.name) {
    payload.county_name = payload.name;
  }
  if (payload.type === 'locality' && !payload.locality_name && payload.name) {
    payload.locality_name = payload.name;
  }

  if (!payload.display_name) {
    payload.display_name = getFullLocationText(payload);
  }
  return payload;
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    mostRecentSearchIds: [],
    mostRecentRequestIds: [],
    activeLocationId: null,
    activeLocation: null
  }),
  persist: {
    storage: sessionStorage,
    pick: ['mostRecentSearchIds']
  },
  actions: {
    setMostRecentSearchIds(ids) {
      this.mostRecentSearchIds = ids;
    },

    setMostRecentRequestIds(ids) {
      this.mostRecentRequestIds = ids;
    },

    setActiveLocation(location) {
      if (!location) {
        this.activeLocation = null;
        this.activeLocationId = null;
        return;
      }

      const locationId = normalizeLocationId(
        location.location_id ?? location.id ?? location.data?.location_id
      );
      const payload = ensureDisplayName({
        ...location,
        location_id: locationId
      });

      this.activeLocation = payload;
      if (locationId) {
        this.activeLocationId = locationId;
      }
    },

    setActiveLocationId(locationId) {
      this.activeLocationId = normalizeLocationId(locationId);
    }
  }
});
