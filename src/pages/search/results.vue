<template>
  <main
    class="grid grid-cols-1 grid-rows-[auto_1fr] xl:grid-cols-[1fr_340px] gap-4 max-w-[1800px] mx-auto">
    <!-- Search form -->
    <aside
      class="w-full row-start-0 row-end-1 xl:col-start-2 xl:col-end-3 relative">
      <Button
        class="mb-2 w-full xl:hidden"
        :data-test="TEST_IDS.search_toggle"
        intent="primary"
        @click="isSearchShown = !isSearchShown">
        {{ isSearchShown ? 'Hide search' : 'Show search' }}
      </Button>

      <transition>
        <div v-if="isSearchShown" class="max-h-[900px] overflow-hidden mb-8">
          <div class="@container">
            <SearchForm
              :placeholder="
                searchData?.location
                  ? getFullLocationText(searchData.location)
                  : 'Enter a place'
              "
              button-copy="Update search"
              @searched="onSearchSetIsSearchShown" />
          </div>
        </div>
      </transition>
    </aside>

    <!-- Search results -->
    <section class="w-full h-full">
      <div
        class="grid grid-cols-1 md:grid-cols-[1fr,auto] md:grid-rows-[repeat(3,35px)]">
        <h1 class="text-3xl mb-4">
          Data
          {{
            searchData?.location &&
            !pendingSearch &&
            'about ' + getFullLocationText(searchData.location)
          }}
        </h1>

        <!-- Follow -->
        <div
          v-if="
            !isFollowedPending &&
            !isFollowedError &&
            getIsV2FeatureEnabled('ENHANCED_SEARCH')
          "
          :class="{
            'loading-shimmer': isFollowedFetching
          }">
          <div
            v-if="!isFollowed"
            class="flex flex-col md:items-end md:row-start-1 md:row-span-2 md:col-start-2 md:col-span-1">
            <Button
              :disabled="!auth.isAuthenticated()"
              class="sm:block max-h-12"
              intent="primary"
              @click="
                () => {
                  followMutation.mutate();
                }
              ">
              <FontAwesomeIcon class="[&>svg]:m-0" :icon="faUserPlus" />
              Follow
            </Button>
            <p v-if="!auth.isAuthenticated()" class="text-med text-neutral-500">
              <RouterLink to="/sign-in">Sign in</RouterLink>
              to follow this location
            </p>
          </div>
          <div v-else class="flex flex-col md:items-end md:max-w-80">
            <p
              v-if="auth.isAuthenticated()"
              class="text-med text-neutral-500 max-w-full md:text-right">
              <FontAwesomeIcon class="[&>svg]:m-0" :icon="faUserCheck" />
              Following this location
              <br />
              See
              <RouterLink to="/profile">your profile</RouterLink>
              for more.
            </p>
          </div>
        </div>

        <!-- Nav -->
        <nav
          v-if="!errorSearch && searchDataCombined"
          class="flex gap-2 mb-4 [&>*]:text-[.72rem] [&>*]:xs:text-med [&>*]:sm:text-lg md:col-start-1 md:col-span-1 md:row-start-2 md:row-span-2 justify-baseline mt-2">
          <span
            class="font-semibold text-neutral-600 dark:text-neutral-300 border-2 border-transparent px-0 py-2">
            Geographic level:
          </span>
          <RouterLink
            v-for="locale in ALL_LOCATION_TYPES"
            :key="`${locale} anchor`"
            :class="{
              'text-goldneutral-500 pointer-events-none cursor-auto':
                !searchDataCombined?.[locale]?.count
            }"
            class="capitalize border-2 border-transparent p-2"
            :to="{ ...route, hash: `#${locale}` }"
            replace
            @click="
              () =>
                // If route hash already includes locale, handle scroll manually
                route.hash.includes(locale) && searchResultsRef.handleScrollTo()
            ">
            {{ getAnchorLinkText(locale) }}
            <span v-if="searchDataCombined?.[locale]?.count">
              ({{ searchDataCombined?.[locale].count }})
            </span>
          </RouterLink>
        </nav>
      </div>

      <Suspense>
        <template #default>
          <SearchResults
            ref="searchResultsRef"
            :results="searchDataCombined"
            :is-loading="pendingSearch || fetchingSearch" />
        </template>
        <template #fallback>
          <LoadingSpinner />
        </template>
      </Suspense>
      <div
        v-if="getIsV2FeatureEnabled('SHOW_REQUESTS') && searchData?.location">
        <h2 v-if="searchData" class="like-h4">
          Data requested about {{ getFullLocationText(searchData.location) }}
        </h2>
        <Requests
          :class="{
            'loading-shimmer': dataRequestsFetching || dataRequestsPending
          }"
          :requests="requestData"
          :error="!!dataRequestsError" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { Button } from 'pdap-design-system';
import SearchForm from '@/components/SearchForm.vue';
import SearchResults from './_components/SearchResults.vue';
import Requests from './_components/Requests.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUserPlus, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import { getIsV2FeatureEnabled } from '@/util/featureFlagV2';
// import _isUndefined from 'lodash/isUndefined';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import {
  getSearchResults,
  getIsFollowed,
  getLocationRequests
} from './_data-fetchers';
import { searchFederal, followSearch } from '@/api/search';
import { useSearchStore } from '@/stores/search';
import {
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
  watch,
  computed
} from 'vue';
import { ALL_LOCATION_TYPES } from '@/util/constants';
import {
  getAnchorLinkText,
  getAllIdsSearched,
  groupResultsByAgency,
  getDefaultHashForResults
} from './_util';
import {
  getFullLocationText,
  getMinimalLocationText
} from '@/util/locationFormatters';
import {
  SEARCH,
  SEARCH_FOLLOWED,
  DATA_REQUEST,
  SEARCH_FEDERAL,
  PROFILE
} from '@/util/queryKeys';
import { TEST_IDS } from '../../../e2e/fixtures/test-ids';

const searchStore = useSearchStore();

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const searchResultsRef = ref();
const isSearchShown = ref(false);
const dims = reactive({ width: window.innerWidth, height: window.innerHeight });
const hasDisplayedErrorByRouteParams = ref(new Map());

const queryClient = useQueryClient();

const reactiveQuery = computed(() => ({
  location_id: route.query.location_id,
  record_categories: route.query.record_categories
}));

const queryKeySearch = computed(() => [SEARCH, reactiveQuery.value]);
const queryKeyFollowed = computed(() => [SEARCH_FOLLOWED, reactiveQuery.value]);
const queryKeyRequests = computed(() => [DATA_REQUEST, reactiveQuery.value]);

const {
  isLoading: isSearchPending,
  isFetching: isSearchFetching,
  // isError,
  data: searchData,
  error: searchError
} = useQuery({
  queryKey: queryKeySearch,
  queryFn: async () => {
    const results = await getSearchResults(route);
    queryClient.invalidateQueries({
      queryKey: [PROFILE]
    });

    return results;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  onError: (error) => {
    if (error) {
      toast.error(
        `Error fetching search results for ${getMinimalLocationText(searchData?.value?.location)}. Please try again!`,
        {
          autoClose: false,
          onClose() {
            isSearchShown.value = true;
          }
        }
      );

      hasDisplayedErrorByRouteParams.value.set(
        JSON.stringify(searchData?.value?.location),
        true
      );
    }
  }
});

const {
  isLoading: isFedSearchPending,
  isFetching: isFedSearchFetching,
  // isError,
  data: fedSearchData,
  error: fedSearchError
} = useQuery({
  queryKey: [SEARCH_FEDERAL],
  queryFn: () => searchFederal(),
  staleTime: 15 * 60 * 1000 // 15 minutes
});

const {
  isLoading: isFollowedPending,
  isFetching: isFollowedFetching,
  data: isFollowed,
  isError: isFollowedError
} = useQuery({
  queryKey: queryKeyFollowed,
  queryFn: () => getIsFollowed(route),
  staleTime: 5 * 60 * 1000 // 5 minutes
});

const {
  isLoading: dataRequestsPending,
  isFetching: dataRequestsFetching,
  // isError,
  data: requestData,
  error: dataRequestsError
} = useQuery({
  queryKey: queryKeyRequests,
  queryFn: () => getLocationRequests(route),
  staleTime: 5 * 60 * 1000, // 5 minutes
  onSuccess: (data) => {
    if (data?.length) {
      searchStore.setMostRecentRequestIds(data.map((req) => req.id));
    }
  }
});

const followMutation = useMutation({
  mutationFn: async () => {
    await followSearch(route.query.location_id);
    toast.success(
      `Search followed for ${getMinimalLocationText(searchData?.value?.location)}.`
    );
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: [SEARCH_FOLLOWED]
    });
    queryClient.invalidateQueries({
      queryKey: [PROFILE]
    });
  },
  onError: () => {
    toast.error(
      `Error following search for ${getMinimalLocationText(searchData?.value?.location)}. Please try again.`
    );
  }
});

const pendingSearch = computed(
  () => isSearchPending.value || isFedSearchPending.value
);
const fetchingSearch = computed(
  () => isSearchFetching.value || isFedSearchFetching.value
);
const errorSearch = computed(() => searchError.value || fedSearchError.value);

const searchDataCombined = computed(() => {
  if (!searchData.value || !fedSearchData.value) return;

  const copy = JSON.parse(JSON.stringify(searchData.value.response));

  copy.count = copy.count + (fedSearchData.value.data?.count || 0);
  copy.data.federal = JSON.parse(
    JSON.stringify(fedSearchData.value.data || {})
  );

  return groupResultsByAgency(copy);
});

watch(searchDataCombined, (newValue) => {
  searchStore.setMostRecentSearchIds(getAllIdsSearched(newValue));
});

// Sync activeLocationId when route.query.location_id changes
watch(
  () => route.query.location_id,
  (newLocationId) => {
    if (newLocationId !== searchStore.activeLocationId) {
      searchStore.setActiveLocationId(newLocationId);
    }
  },
  { immediate: true }
);

// Set default hash on initial page load if no hash is present
watch(
  () => searchDataCombined.value,
  (newResults) => {
    if (newResults && !route.hash) {
      const defaultHash = getDefaultHashForResults(newResults);
      if (defaultHash) {
        router.replace({ ...route, hash: defaultHash });
      }
    }
  },
  { immediate: true }
);

// lifecycle methods
onMounted(() => {
  if (window.innerWidth > 1280) isSearchShown.value = true;

  if (searchDataCombined?.value) {
    searchStore.setMostRecentSearchIds(
      getAllIdsSearched(searchDataCombined.value)
    );
  }

  if (requestData?.value) {
    searchStore.setMostRecentRequestIds(requestData.value.map((req) => req.id));
  }

  window.addEventListener('resize', onWindowWidthSetIsSearchShown);
});

onUpdated(async () => {
  if (searchError.value) {
    toast.error(
      `Error fetching search results for ${getMinimalLocationText(searchData?.value?.location)}. Please try again!`,
      {
        autoClose: false,
        onClose() {
          isSearchShown.value = true;
        }
      }
    );
    hasDisplayedErrorByRouteParams.value.set(
      JSON.stringify(searchData?.value?.location),
      true
    );
  }

  if (searchDataCombined.value)
    searchStore.setMostRecentSearchIds(
      getAllIdsSearched(searchDataCombined.value)
    );

  if (requestData?.value) {
    searchStore.setMostRecentRequestIds(requestData.value.map((req) => req.id));
  }
});

onUnmounted(() => {
  hasDisplayedErrorByRouteParams.value.clear();
  window.removeEventListener('resize', onWindowWidthSetIsSearchShown);
});

function onWindowWidthSetIsSearchShown() {
  if (window.innerWidth === dims.width) {
    return;
  }

  if (window.innerWidth > 1280) isSearchShown.value = true;
  else isSearchShown.value = false;

  dims.value = { width: window.innerWidth, height: window.innerHeight };
}

function onSearchSetIsSearchShown() {
  if (window.innerWidth < 1280) isSearchShown.value = false;
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition:
    opacity 0.5s ease,
    max-height 0.5s ease-in;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
