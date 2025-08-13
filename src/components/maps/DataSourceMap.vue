<template>
  <div class="relative h-auto">
    <div
      id="map-container"
      ref="mapContainer"
      class="hidden md:block relative w-full lg:w-[calc(100%-320px)] h-full overflow-hidden"
      :data-test="TEST_IDS.data_source_map" />
    <!-- <span class="loading"></span> -->
    <Spinner
      :show="layers.states.status === STATUSES.LOADING"
      :size="100"
      class="h-full w-full absolute left-0 top-0 bg-goldneutral-500/70 dark:bg-wineneutral-500/70" />
    <!-- Sidebar that appears when a location is selected -->
    <MapSidebar
      :locations="activeLocationStack"
      :counties="props.counties"
      :localities="props.localities"
      :states="props.states"
      :federal="props.federal"
      @update-active-location="updateActiveLocationStack"
      @on-follow="handleFollow"
      @on-reset-zoom="() => mapDeps.resetZoom()"
      @zoom-to-location="handleZoomToLocation" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as d3 from 'd3';
import { scaleThreshold } from 'd3-scale';
import { Spinner } from 'pdap-design-system';
import MapSidebar from './DataSourceMapSidebar.vue';
import { TEST_IDS } from '../../../e2e/fixtures/test-ids';

import { FILL_COLORS, handleTheme } from './utils/theme';
import {
  setupZoom,
  updateLayerVisibility,
  addZoomControls,
  updateIconSize,
  updateZoomLevel,
  handleOverlaysOnZoom
} from './utils/zoom';
import { renderStatesLayer } from './renderers/states';
import { renderStateOverlay } from './renderers/state-overlay';
import { renderCountiesLayer } from './renderers/counties';
import { renderStateBoundariesLayer } from './renderers/state-boundaries';
import { renderCountyOverlay } from './renderers/county-overlay';
import { renderLocalityMarkers } from './renderers/localities';
import { createTooltip } from './renderers/tooltip';
import { createLegend } from './renderers/legend';
import {
  handleStateClick,
  handleCountyClick,
  handleLocalityClick,
  resetZoom
} from './utils/interaction';
import { updateDynamicLayers } from './utils/overlay';

import * as topojson from 'topojson-client';
import countiesJSON from './topoJSON/counties.json';
import statesJSON from './topoJSON/states.json';

const STATUSES = {
  LOADING: 'loading',
  IDLE: 'idle',
  ERROR: 'error',
  HIDDEN: 'hidden'
};
const MIN_ZOOM = 1;
const MAX_ZOOM = 50;
// Define separate breakpoints for counties and states
const countyColorBreakpoints = [1, 5, 10, 15, 25, 40, 60, 100];
const stateColorBreakpoints = [1, 10, 25, 50, 100, 200, 500];

// Props definition
const props = defineProps({
  counties: {
    type: Array,
    required: false,
    default: undefined
  },
  localities: {
    type: Array,
    required: false,
    default: undefined
  },
  states: {
    type: Array,
    required: false,
    default: undefined
  },
  federal: {
    type: Array,
    required: false,
    default: undefined
  }
});

// Define emits
const emit = defineEmits(['on-follow', 'on-select-location']);

// Get route for query parameters
const route = useRoute();
const router = useRouter();

// Reactive state
const mapContainer = ref(null);
const width = ref(960);
const height = ref(600);
const svg = ref(null);
const path = ref(null);
const projection = ref(null);
const tooltip = ref(null);
const countyColorScale = ref(null);
const stateColorScale = ref(null);
const currentTheme = ref(null);
const activeLocationStack = ref([]); // Stack to track selected locations

// Zoom-related state
const currentZoom = ref(1);
const zoomTransform = ref(null);

// Computed property for county data map
const countyDataMap = computed(() => {
  const map = {};
  if (props.counties && props.counties.length > 0) {
    props.counties.forEach((county) => {
      if (county.fips) {
        map[county.fips] = county?.source_count ?? 0;
      }
    });
  }
  return map;
});

const stateDataMap = computed(() => {
  const map = {};
  if (props.states && props.states.length > 0) {
    props.states.forEach((state) => {
      if (state.name) {
        map[state.name] = state.source_count;
      }
    });
  }
  return map;
});

// Organize localities by county FIPS code for faster lookup
const localitiesByCounty = computed(() => {
  const map = {};
  if (props.localities && props.localities.length > 0) {
    props.localities.forEach((locality) => {
      if (locality.county_fips) {
        if (!map[locality.county_fips]) {
          map[locality.county_fips] = [];
        }
        map[locality.county_fips].push(locality);
      }
    });
  }
  return map;
});

const locations = computed(() => [
  ...(props.states ?? []),
  ...(props.counties ?? []),
  ...(props.localities ?? [])
]);

const activeLocationAggregated = computed(() => {
  return {
    stack: activeLocationStack.value,
    loc_id: route.query.location_id,
    locations
  };
});

// Convert TopoJSON to GeoJSON
const countiesGeoJSON = computed(() => {
  // Get the first object key which should be the counties layer
  const objectName = Object.keys(countiesJSON.objects)[0];
  return topojson.feature(countiesJSON, countiesJSON.objects[objectName]);
});

const statesGeoJSON = computed(() => {
  // Get the first object key which should be the states layer
  const objectName = Object.keys(statesJSON.objects)[0];
  return topojson.feature(statesJSON, statesJSON.objects[objectName]);
});

const layers = computed(() => ({
  counties: {
    data: countiesGeoJSON.value,
    status: Object.keys(countyDataMap.value).length
      ? STATUSES.IDLE
      : STATUSES.LOADING,
    minZoom: 3,
    maxZoom: Infinity
  },
  localities: {
    status: Object.keys(localitiesByCounty.value).length
      ? STATUSES.IDLE
      : STATUSES.LOADING,
    minZoom: 3,
    maxZoom: Infinity
  },
  states: {
    data: statesGeoJSON.value,
    status: Object.keys(stateDataMap.value).length
      ? STATUSES.IDLE
      : STATUSES.LOADING,
    minZoom: 0,
    maxZoom: 3
  },
  stateBoundaries: {
    data: statesGeoJSON.value,
    status: Object.keys(stateDataMap.value).length
      ? STATUSES.IDLE
      : STATUSES.LOADING,
    minZoom: 3,
    maxZoom: Infinity
  },
  countyOverlay: {
    data: countiesGeoJSON.value,
    status: STATUSES.HIDDEN,
    minZoom: 3,
    maxZoom: Infinity
  },
  stateOverlay: {
    data: statesGeoJSON.value,
    status: STATUSES.HIDDEN,
    minZoom: 0,
    maxZoom: Infinity
  }
}));

// Initialize map when component is mounted
onMounted(() => {
  currentTheme.value = handleTheme();
  initMap();

  // Listen for changes in color scheme preference
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    currentTheme.value = handleTheme();
    if (svg.value) updateMap(); // Redraw the map with new theme
  });
});

watch(
  () => activeLocationAggregated.value,
  (locAgg, prevLocAgg) => {
    const priority = ['state', 'county', 'locality'];
    if (!locAgg.locations.value.length) return;
    if (!locAgg?.loc_id && prevLocAgg?.loc_id && !locAgg?.stack.length) return;
    const activeLocation = locAgg?.stack[locAgg?.stack.length - 1];
    if (locAgg?.loc_id === prevLocAgg?.loc_id && activeLocation) return;

    if (activeLocation?.data?.location_id === locAgg.loc_id) return;
    const oldActiveLocation = prevLocAgg?.stack[prevLocAgg?.stack.length - 1];

    if (
      priority.indexOf(activeLocation?.type) <
      priority.indexOf(oldActiveLocation?.type)
    ) {
      return;
    }

    updateOnParamChange(locAgg.loc_id, locAgg.stack);
  },
  { immediate: true, deep: true }
);

// Watch for changes in counties data
watch(
  () => props.states,
  (newStates) => {
    if (newStates.length) {
      updateMap();
    }
  },
  { deep: true }
);
watch(
  () => activeLocationStack.value,
  (newStack) => {
    if (newStack.length > 0) {
      const activeLocation = newStack[newStack.length - 1];
      if (activeLocation) emit('on-select-location', activeLocation);
      // updateOnParamChange(route.query.location_id, newStack);
    }
  },
  { deep: true }
);

function updateOnParamChange(loc_id, stack) {
  if (!loc_id || !stack) return;

  const activeLoc = stack[stack.length - 1];
  const activeLocID = activeLoc?.data?.location_id;
  if (activeLocID === loc_id) return;

  setTimeout(() => {
    if (svg.value && loc_id) zoomToLocationById(loc_id);

    updateDynamicLayers({
      renderStateOverlay,
      renderCountyOverlay,
      renderLocalityMarkers,
      deps: mapDeps.value
    });
  }, 250);
}
// Initialize the map
function initMap() {
  const container = mapContainer.value;

  // Get container dimensions for responsive sizing
  const containerRect = container.getBoundingClientRect();
  if (containerRect.width && containerRect.height) {
    width.value = containerRect.width;
    height.value = containerRect.height;
  }

  // Ensure minimum dimensions
  if (width.value < 100) width.value = 960;
  if (height.value < 100) height.value = 600;

  // Create SVG with responsive attributes
  svg.value = d3
    .select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width.value} ${height.value}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  createTooltip(tooltip, currentTheme);

  const padding = { top: 10, right: 10, bottom: 80, left: 10 };
  projection.value = d3
    .geoAlbersUsa()
    .fitSize(
      [
        width.value - padding.left - padding.right,
        height.value - padding.top - padding.bottom
      ],
      layers.value.counties.data
    );

  path.value = d3.geoPath().projection(projection.value);

  // Create color scales with specific thresholds for counties and states
  countyColorScale.value = scaleThreshold()
    .domain(countyColorBreakpoints) // County-specific breakpoints
    .range(FILL_COLORS); // Use all custom colors

  stateColorScale.value = scaleThreshold()
    .domain(stateColorBreakpoints) // State-specific breakpoints
    .range(FILL_COLORS); // Use all custom colors

  // Setup zoom behavior
  setupZoom({
    svg: svg.value,
    MIN_ZOOM,
    MAX_ZOOM,
    onZoom: (event) => {
      const url = new URL(window.location.href);

      // Check if we're zooming out below a threshold
      if (
        event.transform.k < currentZoom.value &&
        event.transform.k < 1.125 &&
        route.query.location_id
      ) {
        // We're zooming out (current zoom < previous zoom) and below threshold
        // Clear location_id from URL directly using window.history
        url.searchParams.delete('location_id');
        window.history.replaceState({}, '', url);
      }

      // Update overlay visibility before overwriting current zoom
      const newStack = handleOverlaysOnZoom({
        event,
        currentZoom: currentZoom.value,
        layers: layers.value,
        activeLocationStack: activeLocationStack.value,
        props,
        svg: svg.value,
        STATUSES
      });

      if (
        !newStack.length &&
        activeLocationStack.value.length &&
        route.query.location_id
      )
        router.replace({ query: {} });
      activeLocationStack.value = newStack;

      // Store current zoom transform
      zoomTransform.value = event.transform;
      currentZoom.value = event.transform.k;
      updateIconSize(currentZoom.value, MAX_ZOOM);
      updateZoomLevel(currentZoom.value, MAX_ZOOM);

      // Apply transform to all layers
      const mapContainer = svg.value.select('.map-container');
      if (!mapContainer.empty()) {
        mapContainer.attr('transform', event.transform);
      } else {
        console.error('Map container not found for zoom transform');
      }

      // Update layer visibility based on zoom level
      updateLayerVisibility({
        layers: layers.value,
        currentZoom: currentZoom.value,
        svg: svg.value,
        createLegend: () => createLegend(mapDeps.value),
        STATUSES
      });
    }
  });

  updateMap();
}

// Create a computed property for the master dependencies object
// This will be passed to all render functions and handlers
const mapDeps = computed(() => {
  return {
    // Core map properties
    container: svg.value.select('.map-container'),
    svg: svg.value,
    width: width.value,
    height: height.value,
    path: path.value,
    projection: projection.value,
    tooltip: tooltip.value,

    // Data and state
    props,
    layers: layers.value,
    activeLocationStack: activeLocationStack.value,
    currentZoom: currentZoom.value,
    zoomTransform: zoomTransform.value,

    // Color scales and theme
    countyColorScale: countyColorScale.value,
    stateColorScale: stateColorScale.value,
    currentTheme: currentTheme.value,

    // Data maps
    countyDataMap: countyDataMap.value,
    stateDataMap: stateDataMap.value,
    localitiesByCounty: localitiesByCounty.value,

    // Constants
    MIN_ZOOM,
    MAX_ZOOM,
    FILL_COLORS,
    STATUSES,
    countyColorBreakpoints,
    stateColorBreakpoints,

    // Handler functions
    handleStateClick: (event, d) => {
      activeLocationStack.value = handleStateClick({
        STATUSES,
        event,
        d,
        path: path.value,
        width: width.value,
        height: height.value,
        props,
        activeLocationStack: activeLocationStack.value,
        layers: layers.value,
        svg: svg.value,
        updateDynamicLayers: () =>
          updateDynamicLayers({
            renderStateOverlay,
            renderCountyOverlay,
            renderLocalityMarkers,
            deps: mapDeps.value
          })
      });
    },

    handleCountyClick: (event, d) => {
      activeLocationStack.value = handleCountyClick({
        STATUSES,
        event,
        d,
        path: path.value,
        width: width.value,
        height: height.value,
        props,
        activeLocationStack: activeLocationStack.value,
        layers: layers.value,
        svg: svg.value,
        updateDynamicLayers: () =>
          updateDynamicLayers({
            renderStateOverlay,
            renderCountyOverlay,
            renderLocalityMarkers,
            deps: mapDeps.value
          })
      });
    },

    handleLocalityClick: (event, locality) => {
      activeLocationStack.value = handleLocalityClick({
        STATUSES,
        event,
        locality,
        projection: projection.value,
        width: width.value,
        height: height.value,
        activeLocationStack: activeLocationStack.value,
        updateDynamicLayers: () =>
          updateDynamicLayers({
            renderStateOverlay,
            renderCountyOverlay,
            renderLocalityMarkers,
            deps: mapDeps.value
          }),
        svg: svg.value
      });
    },

    resetZoom: () => {
      // Clear the location_id from URL
      if (route.query.location_id) {
        const query = { ...route.query };
        delete query.location_id;

        // Store current scroll position
        const scrollPosition = window.pageYOffset;

        // Update URL without the location_id
        router.replace({
          query,
          // Preserve scroll position
          state: { fromMap: true, scrollPosition }
        });
      }

      activeLocationStack.value = resetZoom({
        activeLocationStack: [...activeLocationStack.value],
        layers: layers.value,
        svg: svg.value,
        STATUSES
      });
    },

    // Utility functions
    updateDynamicLayers: () => {
      return updateDynamicLayers({
        renderStateOverlay,
        renderCountyOverlay,
        renderLocalityMarkers,
        deps: mapDeps.value
      });
    }
  };
});

// Update the map with current data
function updateMap() {
  // Clear previous map if any
  svg.value.selectAll('*').remove();

  // Create container for all layers with zoom transform
  const mapContainer = svg.value.append('g').attr('class', 'map-container');

  if (zoomTransform.value) {
    mapContainer.attr('transform', zoomTransform.value);
  }

  const deps = mapDeps.value;

  // Render static layers in the correct order:
  renderStatesLayer(mapContainer, deps);
  renderCountiesLayer(mapContainer, deps);
  renderStateBoundariesLayer(mapContainer, deps);

  // Render dynamic layers based on active location
  updateDynamicLayers({
    renderStateOverlay,
    renderCountyOverlay,
    renderLocalityMarkers,
    deps
  });

  // Update layer visibility based on current zoom
  updateLayerVisibility({
    layers: layers.value,
    currentZoom: currentZoom.value,
    svg: svg.value,
    createLegend: () => createLegend(deps),
    STATUSES
  });

  // Add zoom controls
  addZoomControls({
    svg: svg.value,
    resetZoom: deps.resetZoom
  });

  // Add legend - ensure it has all required properties
  try {
    createLegend(deps);
  } catch (error) {
    console.error('Error creating legend:', error);
  }
}

// Handle follow event from sidebar
function handleFollow(locationId) {
  console.log('Follow location:', locationId);
  // Emit event to parent component
  emit('on-follow', locationId);
}

// Update active location stack from sidebar
function updateActiveLocationStack(newStack) {
  activeLocationStack.value = newStack;
}

// Handle zoom to location from sidebar
function handleZoomToLocation(location) {
  if (location.type === 'state') {
    // Find the state in the GeoJSON
    const stateName = location.data.name;
    let stateFeature = statesGeoJSON.value.features.find(
      (f) => f.properties.NAME.toLowerCase() === stateName.toLowerCase()
    );

    // If not found, try partial match
    if (!stateFeature) {
      stateFeature = statesGeoJSON.value.features.find((f) =>
        f.properties.NAME.toLowerCase().includes(stateName.toLowerCase())
      );
    }

    if (stateFeature) {
      zoomToFeature(stateFeature, 0.9);
    }
  } else if (location.type === 'county') {
    // Find the county in the GeoJSON
    const countyFips = location.fips;
    const countyFeature = countiesGeoJSON.value.features.find((f) => {
      const fips = f.properties.STATE + f.properties.COUNTY;
      return fips === countyFips;
    });

    if (countyFeature) {
      zoomToFeature(countyFeature, 0.5);
    }
  }
}

// Helper function to zoom to a feature
function zoomToFeature(feature, scaleFactor) {
  const bounds = path.value.bounds(feature);
  const dx = bounds[1][0] - bounds[0][0];
  const dy = bounds[1][1] - bounds[0][1];
  const x = (bounds[0][0] + bounds[1][0]) / 2;
  const y = (bounds[0][1] + bounds[1][1]) / 2;

  // Calculate appropriate zoom level
  const scale = scaleFactor / Math.max(dx / width.value, dy / height.value);

  // Calculate offset for sidebar
  const sidebarOffset = activeLocationStack.value.length > 0 ? 150 : 0;
  const translate = [
    width.value / 2 - scale * x - sidebarOffset,
    height.value / 2 - scale * y
  ];

  // Get the stored zoom behavior
  const zoom = svg.value.__zoom__ || d3.zoom();

  // Animate zoom transition
  svg.value
    .transition()
    .duration(750)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
}

function zoomToLocationById(locationId) {
  if (!locationId || !svg.value) return;

  if (locations.value.length) {
    const location = locations.value.find((s) => {
      return s.location_id == locationId;
    });

    if (!location) return;

    // Determine location type
    const locationType =
      'fips' in location
        ? 'county'
        : 'county_fips' in location
          ? 'locality'
          : 'state';

    const newLocation = {
      type: locationType,
      data: location,
      name: location.name,
      fips: location.fips // Include fips for county
    };

    // Build proper location hierarchy
    const stack = [];

    if (locationType === 'locality' && location.county_fips) {
      // Find the county and state for this locality
      const county = props.counties.find(
        (c) => c.fips === location.county_fips
      );

      if (county) {
        // Find the state for this county
        const state = props.states.find(
          (s) => s.state_iso === county.state_iso
        );

        if (state) {
          stack.push({
            type: 'state',
            data: state,
            name: state.name
          });
        }

        stack.push({
          type: 'county',
          data: county,
          name: county.name,
          fips: county.fips
        });
      }
    } else if (locationType === 'county') {
      // Find the state for this county
      const state = props.states.find(
        (s) => s.state_iso === location.state_iso
      );

      if (state) {
        stack.push({
          type: 'state',
          data: state,
          name: state.name
        });
      }
    }

    // Add the target location
    stack.push(newLocation);

    // Set the complete stack
    activeLocationStack.value = stack;

    // Use setTimeout to ensure the DOM is ready
    setTimeout(() => {
      // If locality, zoom to county
      if (locationType === 'locality' && location.county_fips) {
        const county = props.counties.find(
          (c) => c.fips === location.county_fips
        );

        if (county) {
          // Create location objects for both county and locality
          const countyLocation = {
            type: 'county',
            data: county,
            name: county.name,
            fips: county.fips
          };
          // Zoom to the county
          handleZoomToLocation(countyLocation);
          return;
        }
      }

      // Otherwise zoom to location
      handleZoomToLocation(newLocation);
    }, 50);
  }
}

// Clean up when component is unmounted
onUnmounted(() => {
  if (tooltip.value) {
    tooltip.value.remove();
  }
});
</script>

<style scoped>
@import './styles.css';
</style>
