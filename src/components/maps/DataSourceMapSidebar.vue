<template>
  <div
    class="map-sidebar relative bg-wineneutral-50 w-full h-auto max-h-[80vh] overflow-y-auto grid grid-cols-1 grid-rows-[auto,auto,auto,1fr,auto] mt-4 lg:mt-0 lg:absolute lg:top-0 lg:right-0 lg:w-[320px] lg:h-[calc(100%)] lg:max-h-none"
    :class="{ visible: activeLocation || federal.length }"
  >
    <!-- 1. Header with back button, title, top-level actions -->
    <div class="flex items-center content-between w-full p-4">
      <Button
        v-if="activeLocation"
        class="p-2 mr-3 flex items-center justify-center text-wineneutral-950 bg-wineneutral-300 hover:bg-wineneutral-300/90 focus:bg-wineneutral-300/90 dark:bg-goldneutral-400 dark:hover:bg-goldneutral-400/90 dark:focus:bg-goldneutral-400/90"
        intent="tertiary"
        @click="handleBackClick"
      >
        <FontAwesomeIcon :icon="faChevronLeft" />
      </Button>
      <div>
        <h3 class="mb-0 mt-0 w-full">
          {{ headerTitle }}
        </h3>
        <p v-show="!activeLocation" class="text-med pt-2 mb-0">
          Aggregated sources cover multiple local agencies, others cover
          federal-level agencies. Search or select a state to find local
          sources.
        </p>
      </div>
    </div>
    <div class="action-block mb-2 px-4">
      <router-link
        v-if="activeLocation"
        :to="`/search/results?location_id=${activeLocation?.data?.location_id || ''}#${activeLocationType}`"
        class="pdap-button-primary mb-2 w-full max-w-full text-center gap-2"
      >
        View
        {{
          activeLocation ? activeLocation.data.source_count : federalSourceCount
        }}
        {{ pluralize('Data Source', activeLocation?.data.source_count) }}
      </router-link>
      <!-- Follow -->
      <div
        v-if="
          !isFollowedPending &&
          !isFollowedError &&
          activeLocation &&
          getIsV2FeatureEnabled('ENHANCED_SEARCH')
        "
        :class="{
          'loading-shimmer': isFollowedFetching
        }"
      >
        <div
          v-if="!isFollowed"
          class="flex flex-col md:items-end md:row-start-1 md:row-span-2 md:col-start-2 md:col-span-1"
        >
          <Button
            v-if="auth.isAuthenticated()"
            variant="primary"
            class="w-full max-w-full"
            @click="$emit('on-follow', activeLocation?.data?.location_id)"
          >
            Follow for updates
          </Button>
        </div>
        <div v-else class="flex flex-col md:items-end md:max-w-80">
          <p
            v-if="auth.isAuthenticated()"
            class="text-med text-wineneutral-500 max-w-full md:text-right"
          >
            <FontAwesomeIcon class="[&>svg]:m-0" :icon="faUserCheck" />
            Following this location
            <br />
            See
            <RouterLink to="/profile">your profile</RouterLink>
            for more.
          </p>
        </div>
      </div>
    </div>

    <hr class="mb-4 border-wineneutral-400" />

    <!-- 2. Content section -->
    <!-- State level: show counties -->
    <div>
      <div
        v-if="activeLocationType === 'state' && countiesInState.length"
        class="flex flex-col w-full"
      >
        <h3 class="px-4 font-medium text-wineneutral-700">Counties</h3>
        <div
          v-for="county in countiesInState.toSorted(
            (a, b) => b.source_count - a.source_count
          )"
          :key="county.fips"
          class="w-full max-w-full flex flex-col items-start gap-0 mb-0 px-4 py-1 text-med"
        >
          <h4 class="grow capitalize text-med font-bold tracking-normal mb-0">
            {{ county.name }}
          </h4>
          <span class="flex items-center gap-2 flex-wrap mt-1 mb-3">
            <button
              class="w-auto max-w-full flex items-center gap-1 px-1 py-0.5 rounded-sm text-sm text-goldneutral-950 bg-goldneutral-100 hover:bg-goldneutral-200 focus:bg-goldneutral-200 dark:text-goldneutral-950 dark:bg-goldneutral-100 dark:hover:bg-goldneutral-200 dark:focus:bg-goldneutral-200"
              @click="selectLocation('county', county)"
            >
              <FontAwesomeIcon :icon="faMagnifyingGlass" />
              Explore localities
            </button>
            <router-link
              :to="`/search/results?location_id=${county.location_id}#county`"
              :class="[
                'flex gap-2 items-center px-1 py-0.5 rounded-sm text-sm w-auto',
                county?.source_count > 0
                  ? 'text-goldneutral-950 bg-brand-gold-100 dark:text-goldneutral-950 dark:bg-brand-gold-800'
                  : 'text-goldneutral-950 bg-goldneutral-100 dark:text-goldneutral-950 dark:bg-goldneutral-100'
              ]"
              @click.stop
            >
              <span v-show="county">
                {{ county?.source_count }}
                {{ pluralize('Source', county?.source_count ?? 0) }}
              </span>
              <FontAwesomeIcon :icon="faArrowRight" />
            </router-link>
          </span>
          <hr class="border-solid border-wineneutral-400 w-full" />
        </div>
      </div>

      <!-- County level: show localities -->
      <div
        v-if="activeLocationType === 'county' && localitiesInCounty.length"
        class="flex flex-col w-full"
      >
        <h3 class="px-4 font-medium text-wineneutral-700">Localities</h3>
        <div
          v-for="locality in localitiesInCounty.toSorted(
            (a, b) => b.source_count - a.source_count
          )"
          :key="locality.location_id"
          class="w-full max-w-full flex flex-col items-start gap-0 mb-0 px-4 py-1 text-med"
        >
          <h4 class="capitalize tracking-normal mb-0 text-med">
            {{ locality.name }}
          </h4>
          <router-link
            :to="`/search/results?location_id=${locality.location_id}#locality`"
            :class="[
              'flex gap-2 items-center px-1 py-0.5 mt-1 mb-2 rounded-sm text-sm',
              locality?.source_count > 0
                ? 'text-goldneutral-950 bg-brand-gold-100 dark:text-goldneutral-950 dark:bg-brand-gold-800'
                : 'text-goldneutral-950 bg-goldneutral-100 dark:text-goldneutral-950 dark:bg-goldneutral-100'
            ]"
            @click.stop
          >
            <span v-show="locality">
              View {{ locality?.source_count }}
              {{ pluralize('Data Source', locality?.source_count ?? 0) }}
            </span>
            <FontAwesomeIcon :icon="faArrowRight" />
          </router-link>
          <hr class="border-solid border-wineneutral-400 w-full" />
        </div>
      </div>

      <!-- Federal level: show agencies and sources -->
      <div
        v-if="!activeLocation && Object.keys(federalSourcesByAgency).length"
        class="flex flex-col w-full"
      >
        <div
          v-for="(sources, agency) in federalSourcesByAgency"
          :key="agency"
          class="mb-4"
        >
          <h3
            class="capitalize text-xl tracking-normal font-medium text-wineneutral-500 mb-2 px-4"
          >
            {{ agency }}
          </h3>
          <ul class="px-4 space-y-4">
            <li
              v-for="source in sources"
              :key="source.source_id"
              class="text-sm mb-2"
            >
              <h4
                class="font-semibold text-lg text-wineneutral-950 capitalize tracking-normal mb-1"
              >
                {{ source.data_source_name }}
              </h4>
              <span class="flex gap-2">
                <a
                  v-if="source.source_url"
                  :href="source.source_url"
                  class="flex gap-2 items-center flex-initial px-1 py-0.5 rounded-sm text-goldneutral-950 bg-brand-gold-100 dark:text-wineneutral-950 dark:bg-brand-gold-800"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                >
                  <span>Visit</span>
                  <FontAwesomeIcon :icon="faArrowUpRightFromSquare" />
                </a>
                <router-link
                  v-if="source.source_id && source.source_id.toString().trim()"
                  :to="`/data-source/${source.source_id}`"
                  class="flex gap-2 items-center flex-initial px-1 py-0.5 rounded-sm text-goldneutral-950 bg-goldneutral-100 dark:text-wineneutral-950 dark:bg-goldneutral-100"
                  @click.stop
                >
                  Details
                  <FontAwesomeIcon :icon="faCircleInfo" />
                </router-link>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 3. Second action block (pinned to bottom) -->
    <div
      class="sticky bottom-0 left-0 w-full p-2 bg-goldneutral-100 dark:bg-goldneutral-50 hidden md:flex h-auto"
    >
      <router-link
        to="/data-request/create"
        class="pdap-button-secondary block w-full text-center"
      >
        Request missing data
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Button } from 'pdap-design-system';
import { ABBREVIATIONS_TO_STATES } from '@/util/constants';
import pluralize from '@/util/pluralize';
import { getFollowedSearch } from '@/api/search';
import { useAuthStore } from '@/stores/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowRight,
  faChevronLeft,
  faMagnifyingGlass,
  faArrowUpRightFromSquare,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/vue-query';
import { SEARCH_FOLLOWED } from '@/util/queryKeys';
import { getIsV2FeatureEnabled } from '@/util/featureFlagV2';

const route = useRoute();
const auth = useAuthStore();
const props = defineProps({
  locations: {
    type: Array,
    required: true,
    default: () => []
  },
  counties: {
    type: Array,
    required: false,
    default: () => []
  },
  localities: {
    type: Array,
    required: false,
    default: () => []
  },
  states: {
    type: Array,
    required: false,
    default: () => []
  },
  federal: {
    type: Array,
    required: false,
    default: () => []
  }
});

const emit = defineEmits([
  'on-follow',
  'update-active-location',
  'zoom-to-location',
  'on-reset-zoom'
]);

const {
  isLoading: isFollowedPending,
  isFetching: isFollowedFetching,
  data: isFollowed,
  isError: isFollowedError
} = useQuery({
  queryKey: [SEARCH_FOLLOWED],
  queryFn: async () => !!(await getFollowedSearch(route.query.location_id)),
  staleTime: 5 * 60 * 1000 // 5 minutes
});

// Get the active location (last item in the stack)
const activeLocation = computed(() => {
  return props.locations.length
    ? props.locations[props.locations.length - 1]
    : null;
});

// Determine the type of active location
const activeLocationType = computed(() => {
  if (!activeLocation.value) return null;
  return activeLocation.value.type;
});

// Generate header title based on active location
const headerTitle = computed(() => {
  if (!activeLocation.value) return 'Federal Data Sources';

  if (activeLocationType.value === 'state') {
    // Special case for Maine which might have issues
    if (
      activeLocation.value.data.state_iso === 'ME' ||
      (activeLocation.value.name &&
        activeLocation.value.name.toLowerCase() === 'maine')
    ) {
      return 'Maine';
    }

    const stateName = ABBREVIATIONS_TO_STATES.get(
      activeLocation.value.data.state_iso
    );
    return stateName || activeLocation.value.data.name || 'Unknown State';
  } else if (activeLocationType.value === 'county') {
    // Check if Louisiana for Parish vs County
    const isLouisiana = activeLocation.value.data.state_iso === 'LA';
    return `${activeLocation.value.data.name} ${isLouisiana ? 'Parish' : 'County'}, ${activeLocation.value.data.state_iso.toUpperCase()}`;
  } else if (activeLocationType.value === 'locality') {
    return `${activeLocation.value.data.name}, ${activeLocation.value.data.state_iso.toUpperCase()}`;
  }

  return '';
});

// Get counties in the active state
const countiesInState = computed(() => {
  if (activeLocationType.value !== 'state' || !activeLocation.value) return [];

  return props.counties.filter(
    (county) => county.state_iso === activeLocation.value.data.state_iso
  );
});

// Get localities in the active county
const localitiesInCounty = computed(() => {
  if (activeLocationType.value !== 'county' || !activeLocation.value) return [];

  return props.localities.filter(
    (locality) =>
      locality.county_fips === activeLocation.value.fips &&
      locality.state_iso === activeLocation.value.data.state_iso
  );
});

// Group federal sources by agency
const federalSourcesByAgency = computed(() => {
  console.log(
    'federalSourcesByAgency computed - props.federal:',
    props.federal
  );
  if (!props.federal || !props.federal.length) {
    console.log('No federal data available');
    return {};
  }

  const grouped = {};
  props.federal.forEach((source) => {
    // Skip sources with missing required properties
    if (!source || !source.source_id || !source.data_source_name) {
      console.warn('Skipping federal source with missing properties:', source);
      return;
    }

    const agency = source.agency_name || 'Unknown Agency';
    if (!grouped[agency]) {
      grouped[agency] = [];
    }
    grouped[agency].push(source);
  });

  // Sort agencies alphabetically
  return Object.keys(grouped)
    .sort((a, b) => {
      // Put "United States Aggregated" first
      if (a === 'United States Aggregated') return -1;
      if (b === 'United States Aggregated') return 1;

      // Then sort everything else alphabetically
      return a.localeCompare(b);
    })
    .reduce((sorted, key) => {
      sorted[key] = grouped[key];
      return sorted;
    }, {});
});

// Calculate total federal source count
const federalSourceCount = computed(() => {
  return props.federal ? props.federal.length : 0;
});

// Handle selecting a location from the list
function selectLocation(type, item) {
  let newStack = [...props.locations];

  if (type === 'county') {
    // Create county location object
    const countyLocation = {
      type: 'county',
      fips: item.fips,
      data: item
    };

    // If we're at state level, add the county to the stack
    if (activeLocationType.value === 'state') {
      newStack.push(countyLocation);
    } else {
      // Otherwise replace the stack with current state + new county
      const stateIndex = newStack.findIndex((loc) => loc.type === 'state');
      if (stateIndex >= 0) {
        newStack = [newStack[stateIndex], countyLocation];
      } else {
        newStack = [countyLocation];
      }
    }

    // Update the stack and zoom to the county
    emit('update-active-location', newStack);
    emit('zoom-to-location', { type: 'county', data: item, fips: item.fips });
  } else if (type === 'locality') {
    // Create locality location object
    const localityLocation = {
      type: 'locality',
      name: item.name,
      data: item,
      fips: item.county_fips
    };

    // If we're at county level, add the locality to the stack
    if (activeLocationType.value === 'county') {
      newStack.push(localityLocation);
    } else {
      // This shouldn't happen, but handle it anyway
      newStack = [localityLocation];
    }

    // Update the stack
    emit('update-active-location', newStack);
    // No need to zoom for localities as they don't have geographic boundaries
  }
}

// Handle back button click based on active location type
function handleBackClick() {
  if (!activeLocation.value) return;

  if (activeLocationType.value === 'state') {
    // Reset map and clear location stack
    emit('update-active-location', []);
    // // Reset zoom
    emit('on-reset-zoom');
  } else if (activeLocationType.value === 'county') {
    const county = activeLocation.value;
    const state = props.states.find(
      (s) => s.state_iso === county.data.state_iso
    );
    if (state) {
      // Create a new stack with just the state
      const newState = {
        type: 'state',
        name: state.name,
        data: state
      };
      emit('update-active-location', [newState]);
      // Zoom to state
      emit('zoom-to-location', { type: 'state', data: state });
    }
  } else if (activeLocationType.value === 'locality') {
    // Find the most recent county in the stack
    const countyIndex = props.locations.findIndex(
      (loc) => loc.type === 'county'
    );
    console.debug('locality back button pressed', {
      countyIndex,
      locationStack: props.locations
    });
    if (countyIndex >= 0) {
      // Create a new stack with just the county
      const county = props.locations[countyIndex];
      emit('update-active-location', [county]);
      // Zoom to county
      emit('zoom-to-location', {
        type: 'county',
        data: county.data,
        fips: county.fips
      });
    }
  }
}
</script>
