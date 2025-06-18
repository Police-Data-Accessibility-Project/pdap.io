<template>
  <div class="map-sidebar" :class="{ visible: locations.length > 0 }">
    <!-- 1. Header with back button, title, top-level actions -->
    <div class="flex items-start content-between w-full p-4">
      <Button
        class="p-2 mr-3 flex items-center justify-center text-wineneutral-950 bg-wineneutral-300 hover:bg-wineneutral-300/90 focus:bg-wineneutral-300/90 dark:bg-neutral-400 dark:hover:bg-neutral-400/90 dark:focus:bg-neutral-400/90"
        intent="tertiary"
        @click="handleBackClick">
        <FontAwesomeIcon :icon="faChevronLeft" />
      </Button>
      <div>
        <h3 class="mb-0 mt-0 w-full">
          {{ headerTitle }}
        </h3>
        <p class="text-lg italic mb-0">
          {{ activeLocation?.data.source_count }}
          {{ pluralize('Data Source', activeLocation?.data.source_count) }}
        </p>
      </div>
    </div>
    <div class="action-block mb-6 px-4">
      <router-link
        :to="`/search/results?location_id=${activeLocation?.data?.location_id || ''}`"
        class="pdap-button-secondary mb-2 w-full max-w-full text-center gap-2">
        View all
        <FontAwesomeIcon :icon="faArrowRight" />
      </router-link>
      <Button
        variant="primary"
        class="w-full max-w-full"
        @click="$emit('on-follow', activeLocation?.data?.location_id)">
        Follow for updates
      </Button>
    </div>

    <hr class="mb-4 border-neutral-500/50" />

    <!-- 2. Content section -->
    <!-- State level: show counties -->
    <div>
      <div
        v-if="activeLocationType === 'state' && countiesInState.length"
        class="flex flex-col w-full">
        <h3 class="px-4 font-medium text-wineneutral-700">Counties</h3>
        <button
          v-for="county in countiesInState.toSorted(
            (a, b) => b.source_count - a.source_count
          )"
          :key="county.fips"
          class="w-full max-w-full flex flex-col items-start gap-0 mb-0 hover:bg-goldneutral-200/75 focus:bg-goldneutral-200/75 px-4 py-1"
          @click="selectLocation('county', county)">
          <h4 class="capitalize tracking-normal mb-0">{{ county.name }}</h4>
          <router-link
            :to="`/search/results?location_id<>${county.location_id}`"
            class="flex justify-between items-center w-full text-med text-wineneutral-800 hover:text-wineneutral-950"
            @click.stop>
            <span>
              <strong>{{ county.source_count }}</strong>
              Data Sources
            </span>
            <FontAwesomeIcon :icon="faArrowRight" />
          </router-link>
        </button>
      </div>

      <!-- County level: show localities -->
      <div
        v-if="activeLocationType === 'county' && localitiesInCounty.length"
        class="flex flex-col w-full">
        <h3 class="px-4 font-medium text-wineneutral-700">Localities</h3>
        <button
          v-for="locality in localitiesInCounty.toSorted(
            (a, b) => b.source_count - a.source_count
          )"
          :key="locality.id"
          class="w-full max-w-full flex flex-col items-start gap-0 mb-0 hover:bg-goldneutral-200/75 focus:bg-goldneutral-200/75 px-4 py-2"
          @click="selectLocation('locality', locality)">
          <h4 class="capitalize tracking-normal mb-0">{{ locality.name }}</h4>
          <router-link
            :to="`/search/results?location_id=${locality.location_id}`"
            class="flex justify-between items-center w-full text-med text-wineneutral-800 hover:text-wineneutral-950"
            @click.stop>
            <span>
              <strong>{{ locality.source_count }}</strong>
              Data Sources
            </span>
            <FontAwesomeIcon :icon="faArrowRight" />
          </router-link>
        </button>
      </div>
    </div>
    <!-- 3. Second action block (pinned to bottom) -->
    <div
      class="border-t-wineneutral-500 sticky bottom-0 left-0 w-full p-4 bg-wineneutral-100 flex items-center justify-center">
      <router-link
        to="/data-request/create"
        class="pdap-button-secondary block w-full text-center">
        Request missing data
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Button } from 'pdap-design-system';
import { ABBREVIATIONS_TO_STATES } from '@/util/constants';
import pluralize from '@/util/pluralize';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

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
  }
});

const emit = defineEmits([
  'on-follow',
  'update-active-location',
  'zoom-to-location'
]);

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
  if (!activeLocation.value) return '';

  if (activeLocationType.value === 'state') {
    return ABBREVIATIONS_TO_STATES.get(activeLocation.value.data.state_iso);
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
    // Reset zoom
    emit('zoom-to-location', { type: 'reset' });
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
