import { defineStore } from 'pinia';

export const useDataRequestsStore = defineStore('data-requests', {
  state: () => ({
    /** Previous route visited - useful for determining whether we are incrementing or decrementing pages in data request by id */
    previousDataRequestRoute: null
  }),
  actions: {
    setPreviousDataRequestRoute(route) {
      this.$patch({
        previousDataSourceRoute: route
      });
    }
  }
});
