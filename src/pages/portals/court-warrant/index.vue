<template>
  <main class="max-w-[1800px] mx-auto px-4 md:px-8 py-8 grid gap-8">
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-semibold">Court and Warrant Data Sources</h1>
        <p class="text-lg text-wineneutral-600">
          Explore public record sources related to court activity and wanted
          persons. This view focuses on jurisdictions with relevant records.
        </p>
      </div>

      <div
        v-if="showFollowControls"
        :class="{
          'loading-shimmer': isFollowedNationalFetching
        }"
        class="flex flex-col gap-2 max-w-md"
      >
        <div v-if="!isFollowedNational">
          <Button
            :disabled="
              !auth.isAuthenticated() ||
              followNationalPending ||
              isFollowedNationalPending
            "
            intent="primary"
            class="w-full sm:w-auto"
            @click="handleFollowNational"
          >
            <span v-if="!followNationalPending">Follow this search</span>
            <span v-else>Following…</span>
          </Button>
          <p
            v-if="!auth.isAuthenticated()"
            class="text-med text-wineneutral-500"
          >
            <RouterLink to="/sign-in">Sign in</RouterLink>
            to follow this search.
          </p>
        </div>
        <p v-else class="text-med text-wineneutral-500">
          You're following this search. See
          <RouterLink to="/profile">your profile</RouterLink>
          for updates.
        </p>
      </div>
    </section>

    <section class="grid gap-4">
      <div class="relative w-full">
        <div class="h-0 md:h-[70vh] w-full">
          <DataSourceMap
            v-if="mapBindings"
            v-bind="mapBindings"
            class="h-full w-full"
            :sidebar-component="CourtWarrantMapSidebar"
            :sidebar-props="sidebarExtraProps"
            :show-locality-markers="false"
            :use-dynamic-breakpoints="true"
            :show-sidebar="showSidebar"
            hide-sidebar-without-selection
            @on-select-location="handleSelectLocation"
            @on-follow="handleFollowLocation"
            @has-active-location-change="handleActiveLocationChange"
          />

          <div
            v-else
            class="h-full w-full bg-wineneutral-100 dark:bg-wineneutral-800"
          />
        </div>

        <Spinner
          :show="isMapLoading || !mapBindings"
          :size="64"
          class="absolute inset-0 z-10 flex items-center justify-center bg-goldneutral-500/30 dark:bg-wineneutral-700/30"
        />
      </div>
    </section>

    <section class="grid gap-4">
      <header class="flex flex-col gap-1">
        <h2 class="text-2xl font-semibold">Filtered Data Sources</h2>
        <p class="text-med text-wineneutral-600">
          Results are grouped by geography and agency. Scroll or use the map to
          focus on a specific area.
        </p>
      </header>

      <nav
        v-if="filteredGroupedResults"
        class="flex flex-wrap gap-2 items-center text-sm md:text-med"
      >
        <span class="font-semibold text-wineneutral-600">
          Geographic level:
        </span>
        <button
          v-for="locale in geographicLevels"
          :key="`locale-nav-${locale}`"
          type="button"
          class="capitalize border-2 border-transparent px-2 py-1"
          :class="{
            'text-goldneutral-500 pointer-events-none cursor-auto':
              !filteredGroupedResults?.[locale]?.count
          }"
          @click="() => applyLocaleFilter(locale)"
        >
          {{ locale === 'locality' ? 'local' : locale }}
          <span v-if="filteredGroupedResults?.[locale]?.count">
            ({{ filteredGroupedResults[locale].count }})
          </span>
        </button>
      </nav>

      <div class="relative min-h-[320px]">
        <Spinner
          :show="isResultsLoading"
          :size="48"
          text="Loading results..."
        />
        <SearchResults
          v-if="filteredGroupedResults"
          ref="searchResultsRef"
          :results="filteredGroupedResults"
          :is-loading="isResultsLoading"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button, Spinner } from 'pdap-design-system';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue3-toastify';

import DataSourceMap from '@/components/maps/DataSourceMap.vue';
import SearchResults from '@/pages/search/_components/SearchResults.vue';
import { getMapLocations } from '@/api/map';
import {
  search,
  followNationalSearch,
  getFollowedNationalSearch
} from '@/api/search';
import { groupResultsByAgency } from '@/pages/search/_util';
import { ALL_LOCATION_TYPES } from '@/util/constants';
import { getIsV2FeatureEnabled } from '@/util/featureFlagV2';
import { SEARCH_FOLLOWED_NATIONAL, PROFILE } from '@/util/queryKeys';
import { useAuthStore } from '@/stores/auth';
import CourtWarrantMapSidebar from './_CourtWarrantMapSidebar.vue';
import { COURT_WARRANT_RECORD_TYPES } from '@/util/constants';

const auth = useAuthStore();
const queryClient = useQueryClient();
const searchResultsRef = ref(null);
const selectedFilter = ref(null);
const showSidebar = ref(false);
const route = useRoute();
const router = useRouter();

const followFeatureEnabled = computed(() =>
  getIsV2FeatureEnabled('ENHANCED_SEARCH')
);

const mapQuery = useQuery({
  queryKey: ['courtWarrantMap', COURT_WARRANT_RECORD_TYPES],
  queryFn: async () => {
    const response = await getMapLocations({
      record_types: COURT_WARRANT_RECORD_TYPES.join(',')
    });
    return response.data;
  },
  staleTime: 5 * 60 * 1000
});

const resultsQuery = useQuery({
  queryKey: ['courtWarrantResults', COURT_WARRANT_RECORD_TYPES],
  queryFn: async () => {
    const response = await search({
      record_types: COURT_WARRANT_RECORD_TYPES.join(',')
    });
    const raw = response.data;

    return {
      raw,
      grouped: groupResultsByAgency(raw)
    };
  },
  staleTime: 5 * 60 * 1000
});

const nationalFollowQuery = useQuery({
  queryKey: [
    SEARCH_FOLLOWED_NATIONAL,
    { record_types: COURT_WARRANT_RECORD_TYPES }
  ],
  queryFn: () =>
    getFollowedNationalSearch({
      record_types: COURT_WARRANT_RECORD_TYPES.join(',')
    }),
  staleTime: 5 * 60 * 1000,
  enabled: followFeatureEnabled
});

const followNationalMutation = useMutation({
  mutationFn: async () =>
    followNationalSearch({
      record_types: COURT_WARRANT_RECORD_TYPES.join(',')
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: [SEARCH_FOLLOWED_NATIONAL]
    });
    queryClient.invalidateQueries({
      queryKey: [PROFILE]
    });
    toast.success('Following Court and Warrant data sources.');
  },
  onError: () => {
    toast.error('Error following this search. Please try again.');
  }
});

const isFollowedNational = computed(
  () => nationalFollowQuery.data.value ?? false
);
const isFollowedNationalPending = computed(
  () => nationalFollowQuery.isLoading.value
);
const isFollowedNationalFetching = computed(
  () => nationalFollowQuery.isFetching.value
);
const followNationalPending = computed(
  () => followNationalMutation.isPending.value
);
const showFollowControls = computed(() => followFeatureEnabled.value);

const isMapLoading = computed(() => mapQuery.isLoading.value);
const isResultsLoading = computed(() => resultsQuery.isLoading.value);

const geographicLevels = computed(() =>
  ALL_LOCATION_TYPES.filter((type) => type !== 'federal')
);

function normalizeName(value) {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .replace(/county|parish|city|township|borough/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

const mapData = computed(() => mapQuery.data.value ?? null);

function matchesCountyLocation(source, location) {
  if (!source || !location) return false;
  const sourceState = (source.state_iso ?? source.stateIso ?? '').toUpperCase();
  const locationState = (location.state_iso ?? '').toUpperCase();
  if (!sourceState || !locationState || sourceState !== locationState)
    return false;

  const sourceFips = source.county_fips ?? source.countyFips;
  if (sourceFips && location.fips && sourceFips === location.fips) {
    return true;
  }

  const locationName = normalizeName(location.name);
  if (!locationName) return false;

  const candidateStrings = [
    source.county_name,
    source.countyName,
    source.municipality,
    source.agency_name,
    source.data_source_name
  ];

  return candidateStrings.some((value) =>
    normalizeName(value).includes(locationName)
  );
}

function matchesLocalityLocation(source, location) {
  if (!source || !location) return false;
  const sourceState = (source.state_iso ?? source.stateIso ?? '').toUpperCase();
  const locationState = (location.state_iso ?? '').toUpperCase();
  if (!sourceState || !locationState || sourceState !== locationState)
    return false;

  const sourceLocalityName = normalizeName(
    source.municipality ?? source.agency_name ?? source.data_source_name
  );
  const locationName = normalizeName(location.name);
  if (!sourceLocalityName || !locationName) return false;

  if (!sourceLocalityName.includes(locationName)) return false;

  const sourceCountyFips = source.county_fips ?? source.countyFips;
  if (location.county_fips && sourceCountyFips) {
    return sourceCountyFips === location.county_fips;
  }

  return true;
}

const mapLocationMetadata = computed(() => {
  const metadata = new Map();
  const data = mapData.value;
  if (!data?.locations) return metadata;

  (data.locations.states ?? []).forEach((state) => {
    if (state?.location_id !== undefined && state?.location_id !== null) {
      metadata.set(String(state.location_id), { ...state, type: 'state' });
    }
  });

  (data.locations.counties ?? []).forEach((county) => {
    if (county?.location_id !== undefined && county?.location_id !== null) {
      metadata.set(String(county.location_id), { ...county, type: 'county' });
    }
  });

  (data.locations.localities ?? []).forEach((locality) => {
    if (locality?.location_id !== undefined && locality?.location_id !== null) {
      metadata.set(String(locality.location_id), {
        ...locality,
        type: 'locality'
      });
    }
  });

  return metadata;
});

const mapBindings = computed(() => {
  const mapResponse = mapData.value;
  const rawSearchData = resultsQuery.data.value?.raw?.data;

  if (!mapResponse || !rawSearchData) return null;

  const stateSourcesByIso = new Map();
  const pushToState = (iso, source) => {
    if (!iso) return;
    const normalized = iso.toUpperCase();
    if (!stateSourcesByIso.has(normalized)) {
      stateSourcesByIso.set(normalized, []);
    }
    stateSourcesByIso.get(normalized).push(source);
  };

  (rawSearchData.state?.results ?? []).forEach((source) => {
    pushToState(source.state_iso ?? source.stateIso, source);
  });

  const countySourcesById = new Map();
  (mapResponse.locations?.counties ?? []).forEach((county) => {
    countySourcesById.set(String(county.location_id), []);
  });

  (rawSearchData.county?.results ?? []).forEach((source) => {
    const match = (mapResponse.locations?.counties ?? []).find((county) =>
      matchesCountyLocation(source, county)
    );
    if (!match) return;
    const key = String(match.location_id);
    if (!countySourcesById.has(key)) countySourcesById.set(key, []);
    countySourcesById.get(key).push(source);
    pushToState(match.state_iso, source);
  });

  const localitySourcesById = new Map();
  (mapResponse.locations?.localities ?? []).forEach((locality) => {
    localitySourcesById.set(String(locality.location_id), []);
  });

  (rawSearchData.locality?.results ?? []).forEach((source) => {
    const match = (mapResponse.locations?.localities ?? []).find((locality) =>
      matchesLocalityLocation(source, locality)
    );
    if (!match) return;
    const key = String(match.location_id);
    if (!localitySourcesById.has(key)) localitySourcesById.set(key, []);
    localitySourcesById.get(key).push(source);
    pushToState(match.state_iso, source);
  });

  const filteredStates = (mapResponse.locations?.states ?? [])
    .map((state) => {
      const iso = (state.state_iso ?? '').toUpperCase();
      const sources = stateSourcesByIso.get(iso) ?? [];
      if (!sources.length) return null;
      return {
        ...state,
        source_count: sources.length
      };
    })
    .filter(Boolean);

  const filteredCounties = (mapResponse.locations?.counties ?? [])
    .map((county) => {
      const sources = countySourcesById.get(String(county.location_id)) ?? [];
      if (!sources.length) return null;
      return {
        ...county,
        source_count: sources.length
      };
    })
    .filter(Boolean);

  const filteredLocalities = (mapResponse.locations?.localities ?? [])
    .map((locality) => {
      const sources =
        localitySourcesById.get(String(locality.location_id)) ?? [];
      if (!sources.length) return null;
      return {
        ...locality,
        source_count: sources.length
      };
    })
    .filter(Boolean);

  const locationSourcesMap = new Map();

  filteredStates.forEach((state) => {
    const key = String(state.location_id);
    const iso = (state.state_iso ?? '').toUpperCase();
    locationSourcesMap.set(key, stateSourcesByIso.get(iso) ?? []);
  });

  filteredCounties.forEach((county) => {
    const key = String(county.location_id);
    locationSourcesMap.set(key, countySourcesById.get(key) ?? []);
  });

  filteredLocalities.forEach((locality) => {
    const key = String(locality.location_id);
    locationSourcesMap.set(key, localitySourcesById.get(key) ?? []);
  });

  return {
    states: filteredStates,
    counties: filteredCounties,
    localities: filteredLocalities,
    federal: [],
    locationSources: Object.fromEntries(locationSourcesMap.entries())
  };
});

const sidebarExtraProps = computed(() => ({
  mapMetadata: Object.fromEntries(mapLocationMetadata.value.entries()),
  locationSources: mapBindings.value?.locationSources ?? {},
  isLoading: isResultsLoading.value
}));

function ensureAllLocationBuckets(results) {
  if (!results) return null;

  const enriched = { ...results };
  delete enriched.federal;
  enriched.count = results.count ?? 0;

  geographicLevels.value.forEach((locale) => {
    if (!enriched[locale]) {
      enriched[locale] = { count: 0, sourcesByAgency: {} };
    }
  });

  return enriched;
}

const groupedResults = computed(() =>
  ensureAllLocationBuckets(resultsQuery.data.value?.grouped)
);

const filteredRawResults = computed(() => {
  const raw = resultsQuery.data.value?.raw;
  if (!raw?.data) return null;

  const filter = selectedFilter.value;
  if (!filter) return raw;

  const createBucket = () => ({ results: [], count: 0 });
  const filtered = {
    count: 0,
    data: {
      federal: createBucket(),
      state: createBucket(),
      county: createBucket(),
      locality: createBucket()
    }
  };

  const push = (level, source) => {
    filtered.data[level].results.push(source);
    filtered.data[level].count++;
    filtered.count++;
  };

  const toUpper = (value) => (value ?? '').toString().toUpperCase();

  if (filter.type === 'state') {
    const stateIso = toUpper(filter.stateIso);
    if (!stateIso) return raw;

    (raw.data.state?.results ?? []).forEach((source) => {
      if (toUpper(source.state_iso ?? source.stateIso) === stateIso) {
        push('state', source);
      }
    });

    (raw.data.county?.results ?? []).forEach((source) => {
      if (toUpper(source.state_iso ?? source.stateIso) === stateIso) {
        push('county', source);
      }
    });

    (raw.data.locality?.results ?? []).forEach((source) => {
      if (toUpper(source.state_iso ?? source.stateIso) === stateIso) {
        push('locality', source);
      }
    });
  } else if (filter.type === 'county') {
    const stateIso = toUpper(filter.stateIso);
    const countyFips =
      filter.countyFips != null ? String(filter.countyFips) : null;
    const countyName = normalizeName(filter.countyName);
    if (!stateIso || (!countyFips && !countyName)) return raw;

    const countyMatches = (source) => {
      if (toUpper(source.state_iso ?? source.stateIso) !== stateIso)
        return false;

      const sourceFips =
        source.county_fips ?? source.countyFips ?? source.fips ?? null;
      if (countyFips && sourceFips != null) {
        if (String(sourceFips) === countyFips) return true;
      }

      if (!countyName) return false;

      const sourceCountyName = normalizeName(
        source.county_name ??
          source.countyName ??
          source.agency_name ??
          source.data_source_name
      );

      return sourceCountyName && sourceCountyName.includes(countyName);
    };

    (raw.data.state?.results ?? []).forEach((source) => {
      if (toUpper(source.state_iso ?? source.stateIso) === stateIso) {
        push('state', source);
      }
    });

    (raw.data.county?.results ?? []).forEach((source) => {
      if (countyMatches(source)) {
        push('county', source);
      }
    });

    (raw.data.locality?.results ?? []).forEach((source) => {
      if (countyMatches(source)) {
        push('locality', source);
      }
    });
  } else if (filter.type === 'locality') {
    const localityId = filter.localityId;
    const stateIso = toUpper(filter.stateIso);
    const countyFips =
      filter.countyFips != null ? String(filter.countyFips) : null;
    const countyName = normalizeName(filter.countyName);
    if (!localityId || !stateIso) return raw;

    (raw.data.locality?.results ?? []).forEach((source) => {
      if (
        String(source.location_id ?? source.locationId) === String(localityId)
      ) {
        push('locality', source);
      }
    });

    (raw.data.county?.results ?? []).forEach((source) => {
      const sameState =
        toUpper(source.state_iso ?? source.stateIso) === stateIso;
      if (!sameState) return;
      const sourceFips =
        source.county_fips ?? source.countyFips ?? source.fips ?? null;
      if (countyFips && sourceFips != null) {
        if (String(sourceFips) === countyFips) {
          push('county', source);
          return;
        }
      }

      if (!countyName) {
        push('county', source);
        return;
      }

      const sourceCountyName = normalizeName(
        source.county_name ??
          source.countyName ??
          source.agency_name ??
          source.data_source_name
      );
      if (sourceCountyName && sourceCountyName.includes(countyName)) {
        push('county', source);
      }
    });

    (raw.data.state?.results ?? []).forEach((source) => {
      if (toUpper(source.state_iso ?? source.stateIso) === stateIso) {
        push('state', source);
      }
    });
  } else {
    return raw;
  }

  return filtered;
});

const filteredGroupedResults = computed(() => {
  const filteredRaw = filteredRawResults.value;
  if (!filteredRaw) return null;
  const grouped = groupResultsByAgency(filteredRaw);
  return ensureAllLocationBuckets(grouped);
});

function clearFilterAndScroll() {
  selectedFilter.value = null;
  showSidebar.value = false;
  nextTick(() => {
    searchResultsRef.value?.handleScrollTo?.();
  });
}

async function handleSelectLocation(location) {
  if (!location?.type) {
    clearFilterAndScroll();
    return;
  }

  const { type, data } = location;

  if (type === 'state') {
    const stateIso = (data?.state_iso ?? data?.stateIso ?? '').toUpperCase();
    if (!stateIso) {
      clearFilterAndScroll();
      return;
    }

    selectedFilter.value = {
      type: 'state',
      stateIso
    };
    nextTick(() => {
      searchResultsRef.value?.handleScrollTo?.();
    });
    return;
  }

  if (type === 'county') {
    const stateIso = (data?.state_iso ?? data?.stateIso ?? '').toUpperCase();
    const countyFipsRaw = data?.fips ?? data?.county_fips ?? data?.countyFips;
    const countyFips = countyFipsRaw != null ? String(countyFipsRaw) : null;
    const countyName = normalizeName(data?.name);
    if (!stateIso || (!countyFips && !countyName)) {
      clearFilterAndScroll();
      return;
    }

    selectedFilter.value = {
      type: 'county',
      stateIso,
      countyFips,
      countyName
    };
    nextTick(() => {
      searchResultsRef.value?.handleScrollTo?.();
    });
    return;
  }

  if (type === 'locality') {
    const localityId =
      data?.location_id ?? data?.id ?? data?.location?.location_id;
    const stateIso = (data?.state_iso ?? data?.stateIso ?? '').toUpperCase();
    const countyFipsRaw = data?.county_fips ?? data?.countyFips;
    const countyFips = countyFipsRaw != null ? String(countyFipsRaw) : null;
    const countyName = normalizeName(data?.county_name ?? data?.countyName);

    if (!localityId || !stateIso) {
      clearFilterAndScroll();
      return;
    }

    selectedFilter.value = {
      type: 'locality',
      localityId,
      stateIso,
      countyFips,
      countyName
    };
    nextTick(() => {
      searchResultsRef.value?.handleScrollTo?.();
    });
  }
}

function applyLocaleFilter(locale) {
  if (!filteredGroupedResults.value?.[locale]?.count) {
    clearFilterAndScroll();
    return;
  }

  const hasActiveLocationFilter = Boolean(selectedFilter.value);
  if (!hasActiveLocationFilter) {
    showSidebar.value = false;
  }

  const targetHash = `#${locale}`;

  if (route.hash === targetHash) {
    nextTick(() => {
      searchResultsRef.value?.handleScrollTo?.();
    });
    return;
  }

  router.replace({ ...route, hash: targetHash });
}

function handleActiveLocationChange(isActive) {
  if (!isActive) {
    clearFilterAndScroll();
  } else {
    showSidebar.value = true;
  }
}

watch(
  () => mapBindings.value?.states,
  (states) => {
    if (!selectedFilter.value) return;
    if (!Array.isArray(states) || !states.length) {
      clearFilterAndScroll();
    }
  }
);

function handleFollowLocation() {
  handleFollowNational();
}

function handleFollowNational() {
  if (!auth.isAuthenticated() || followNationalPending.value) return;
  followNationalMutation.mutate();
}
</script>
