import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
  state: () => ({
    /** Needed for `NEXT` / `BACK` functionality in data source id view */
    mostRecentSearchIds: [],
    /** Needed for `NEXT` / `BACK` functionality in data requests id view */
    mostRecentRequestIds: []
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
    }
  }
});
