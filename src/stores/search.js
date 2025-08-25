import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
  state: () => ({
    /** Needed for `NEXT` / `BACK` functionality in data source id view */
    mostRecentSearchIds: [],
    /** Needed for `NEXT` / `BACK` functionality in data requests id view */
    mostRecentRequestIds: [],
    /** Active location ID - source of truth for current location selection */
    activeLocationId: null
  }),
  persist: {
    storage: sessionStorage,
    pick: ['mostRecentSearchIds']
  },
  actions: {
    setMostRecentSearchIds(ids) {
      this.$patch({
        mostRecentSearchIds: ids
      });
    },

    setMostRecentRequestIds(ids) {
      this.$patch({
        mostRecentRequestIds: ids
      });
    },

    setActiveLocationId(locationId) {
      this.$patch({
        activeLocationId: locationId
      });
    }
  }
});
