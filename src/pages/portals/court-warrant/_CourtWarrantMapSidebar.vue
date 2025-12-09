<template>
  <div
    class="map-sidebar hidden md:grid relative bg-wineneutral-50 w-full h-auto max-h-[80vh] overflow-y-auto grid-cols-1 grid-rows-[auto,1fr] mt-4 lg:mt-0 lg:absolute lg:top-0 lg:right-0 lg:w-[320px] lg:h-[calc(100%)] lg:max-h-none"
    :class="{ visible: sections.length }"
  >
    <div class="flex items-center w-full p-4 border-b border-wineneutral-300">
      <Button
        v-if="activeLocation"
        class="p-2 mr-3 flex items-center justify-center text-wineneutral-950 bg-wineneutral-300 hover:bg-wineneutral-300/90 focus:bg-wineneutral-300/90 dark:bg-goldneutral-400 dark:hover:bg-goldneutral-400/90 dark:focus:bg-goldneutral-400/90"
        intent="tertiary"
        @click="handleBackClick"
      >
        <FontAwesomeIcon :icon="faChevronLeft" />
      </Button>
      <div class="flex flex-col gap-1">
        <h3 class="m-0">{{ headerTitle }}</h3>
        <p v-if="!activeLocation" class="text-med text-wineneutral-600 m-0">
          Select a state or county on the map to focus this list, or browse all
          matching sources below.
        </p>
      </div>
    </div>

    <div class="px-4 py-3 flex flex-col gap-4 overflow-y-auto">
      <template v-if="sections.length">
        <div
          v-for="section in sections"
          :key="section.key"
          class="flex flex-col gap-3"
        >
          <h3 class="text-lg font-medium text-wineneutral-700 m-0">
            {{ section.title }}
          </h3>
          <div
            v-for="row in section.rows"
            :key="row.key"
            class="border-b border-wineneutral-300 pb-3 last:border-b-0"
          >
            <h4 class="text-med font-semibold text-wineneutral-800 mb-2">
              {{ row.label }}
            </h4>
            <ul class="space-y-3">
              <li
                v-for="source in row.sources"
                :key="source.id ?? source.source_id"
                class="flex flex-col gap-2"
              >
                <RouterLink
                  v-if="source.id ?? source.source_id"
                  :to="`/data-source/${source.id ?? source.source_id}`"
                  class="text-lg font-semibold text-wineneutral-950 hover:underline"
                >
                  {{ source.data_source_name ?? source.name ?? 'Data source' }}
                </RouterLink>
                <span v-else class="text-lg font-semibold text-wineneutral-950">
                  {{ source.data_source_name ?? source.name ?? 'Data source' }}
                </span>
                <div class="flex flex-wrap items-center gap-2 text-sm">
                  <span class="uppercase tracking-wide text-wineneutral-500">
                    {{ source.record_type }}
                  </span>
                  <a
                    v-if="source.source_url"
                    :href="source.source_url"
                    class="flex items-center gap-1 px-1 py-0.5 rounded-sm text-sm text-goldneutral-950 bg-brand-gold-100 dark:text-wineneutral-950 dark:bg-brand-gold-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit
                    <FontAwesomeIcon :icon="faArrowUpRightFromSquare" />
                  </a>
                </div>
                <p
                  v-if="source.description"
                  class="text-sm text-wineneutral-600 m-0"
                >
                  {{ source.description }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <p v-else-if="isLoading" class="text-med text-wineneutral-600">
        Loading matching data sources…
      </p>
      <p v-else class="text-med text-wineneutral-600">
        No data sources match this selection.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Button } from 'pdap-design-system';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronLeft,
  faArrowUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  locations: {
    type: Array,
    default: () => []
  },
  mapMetadata: {
    type: Object,
    default: () => ({})
  },
  locationSources: {
    type: Object,
    default: () => ({})
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'update-active-location',
  'zoom-to-location',
  'on-reset-zoom'
]);

const activeLocation = computed(() =>
  props.locations.length ? props.locations[props.locations.length - 1] : null
);

const activeLocationType = computed(() => activeLocation.value?.type ?? null);
const isLoading = computed(() => props.isLoading);

const metadataById = computed(() => props.mapMetadata ?? {});
const sourcesById = computed(() => props.locationSources ?? {});

const entries = computed(() =>
  Object.entries(sourcesById.value)
    .map(([id, sources]) => {
      const metadata = metadataById.value[id];
      if (!metadata || !Array.isArray(sources) || sources.length === 0)
        return null;
      return { id, metadata, sources };
    })
    .filter(Boolean)
);

const entriesMap = computed(
  () => new Map(entries.value.map((entry) => [entry.id, entry]))
);

const entriesByType = computed(() => ({
  state: entries.value.filter((entry) => entry.metadata.type === 'state'),
  county: entries.value.filter((entry) => entry.metadata.type === 'county'),
  locality: entries.value.filter((entry) => entry.metadata.type === 'locality')
}));

const activeLocationId = computed(() => {
  const target = activeLocation.value?.data ?? activeLocation.value;
  const id = target?.location_id ?? target?.id ?? target?.location?.location_id;
  return id !== undefined && id !== null ? String(id) : null;
});

const activeLocationMetadata = computed(() => {
  if (!activeLocation.value) return null;
  const id = activeLocationId.value;
  if (id && metadataById.value[id]) {
    return metadataById.value[id];
  }
  return activeLocation.value.data ?? null;
});

function formatCountyName(metadata) {
  if (!metadata) return '';
  const isLouisiana = metadata.state_iso === 'LA';
  const suffix = isLouisiana ? 'Parish' : 'County';
  return `${metadata.name} ${suffix}`;
}

function formatLocality(metadata) {
  if (!metadata) return '';
  if (metadata.county_name) {
    return `${metadata.name}, ${metadata.county_name}, ${metadata.state_iso}`;
  }
  return `${metadata.name}, ${metadata.state_iso}`;
}

function formatRowLabel(metadata) {
  if (!metadata) return 'Data sources';
  if (metadata.type === 'state') return metadata.name ?? 'Statewide sources';
  if (metadata.type === 'county') {
    return metadata.state_iso
      ? `${formatCountyName(metadata)}, ${metadata.state_iso}`
      : formatCountyName(metadata);
  }
  if (metadata.type === 'locality') return formatLocality(metadata);
  return metadata.name ?? 'Data sources';
}

function createRow(entry) {
  return {
    key: `${entry.metadata.type}-${entry.id}`,
    label: formatRowLabel(entry.metadata),
    sources: entry.sources
  };
}

function buildOverviewSections() {
  const sections = [];

  const stateRows = entriesByType.value.state.map(createRow);
  if (stateRows.length) {
    sections.push({
      key: 'overview-state',
      title: 'Statewide sources',
      rows: stateRows
    });
  }

  const countyRows = entriesByType.value.county.map(createRow);
  if (countyRows.length) {
    sections.push({
      key: 'overview-county',
      title: 'County sources',
      rows: countyRows
    });
  }

  const localityRows = entriesByType.value.locality.map(createRow);
  if (localityRows.length) {
    sections.push({
      key: 'overview-locality',
      title: 'Local sources',
      rows: localityRows
    });
  }

  return sections;
}

function buildStateSections(metadata) {
  if (!metadata) return [];

  const sections = [];
  const locationId = String(metadata.location_id);

  const stateEntry = entriesMap.value.get(locationId);
  if (stateEntry) {
    sections.push({
      key: `state-${metadata.state_iso}-statewide`,
      title: `${metadata.name} statewide sources`,
      rows: [createRow(stateEntry)]
    });
  }

  const countyRows = entriesByType.value.county
    .filter((entry) => entry.metadata.state_iso === metadata.state_iso)
    .map(createRow);
  if (countyRows.length) {
    sections.push({
      key: `state-${metadata.state_iso}-counties`,
      title: 'County sources',
      rows: countyRows
    });
  }

  const localityRows = entriesByType.value.locality
    .filter((entry) => entry.metadata.state_iso === metadata.state_iso)
    .map(createRow);
  if (localityRows.length) {
    sections.push({
      key: `state-${metadata.state_iso}-local`,
      title: 'Local sources',
      rows: localityRows
    });
  }

  return sections;
}

function buildCountySections(metadata) {
  if (!metadata) return [];

  const sections = [];
  const countyId = String(metadata.location_id);

  const countyEntry = entriesMap.value.get(countyId);
  if (countyEntry) {
    sections.push({
      key: `county-${metadata.fips}`,
      title: `${formatCountyName(metadata)} sources`,
      rows: [createRow(countyEntry)]
    });
  }

  const localityRows = entriesByType.value.locality
    .filter(
      (entry) =>
        entry.metadata.state_iso === metadata.state_iso &&
        entry.metadata.county_fips === metadata.fips
    )
    .map(createRow);
  if (localityRows.length) {
    sections.push({
      key: `county-${metadata.fips}-local`,
      title: 'Local sources',
      rows: localityRows
    });
  }

  return sections;
}

function buildLocalitySections(metadata) {
  if (!metadata) return [];

  const sections = [];
  const localityId = String(metadata.location_id);

  const stateEntry = entriesByType.value.state.find(
    (entry) => entry.metadata.state_iso === metadata.state_iso
  );
  if (stateEntry) {
    sections.push({
      key: `locality-${localityId}-statewide`,
      title: `${metadata.name}, ${metadata.state_iso} statewide sources`,
      rows: [createRow(stateEntry)]
    });
  }

  if (metadata.county_fips) {
    const countyEntry = entriesByType.value.county.find(
      (entry) =>
        entry.metadata.state_iso === metadata.state_iso &&
        entry.metadata.county_fips === metadata.county_fips
    );
    if (countyEntry) {
      sections.push({
        key: `locality-${localityId}-county`,
        title: `${formatCountyName(countyEntry.metadata)} sources`,
        rows: [createRow(countyEntry)]
      });
    }
  }

  const localityEntry = entriesMap.value.get(localityId);
  if (localityEntry) {
    sections.push({
      key: `locality-${localityId}`,
      title: 'Local sources',
      rows: [createRow(localityEntry)]
    });
  }

  return sections;
}

const sections = computed(() => {
  if (!entries.value.length) return [];

  if (!activeLocation.value) {
    return buildOverviewSections();
  }

  const metadata = activeLocationMetadata.value;

  if (activeLocationType.value === 'state') {
    return buildStateSections(metadata);
  }
  if (activeLocationType.value === 'county') {
    return buildCountySections(metadata);
  }
  if (activeLocationType.value === 'locality') {
    return buildLocalitySections(metadata);
  }

  return buildOverviewSections();
});

const headerTitle = computed(() => {
  if (!activeLocation.value) {
    return 'All matching sources';
  }

  const metadata = activeLocationMetadata.value;
  if (!metadata) return '';

  if (metadata.type === 'state') {
    return metadata.name ?? 'State';
  }
  if (metadata.type === 'county') {
    return `${formatCountyName(metadata)}, ${metadata.state_iso}`;
  }
  if (metadata.type === 'locality') {
    return `${metadata.name}, ${metadata.state_iso}`;
  }
  return metadata.name ?? '';
});

function handleBackClick() {
  if (!activeLocation.value) return;

  if (activeLocationType.value === 'state') {
    emit('update-active-location', []);
    emit('on-reset-zoom');
    return;
  }

  if (activeLocationType.value === 'county') {
    const stateInStack = props.locations.find((loc) => loc.type === 'state');
    if (stateInStack) {
      emit('update-active-location', [stateInStack]);
      emit('zoom-to-location', { type: 'state', data: stateInStack.data });
      return;
    }
    emit('update-active-location', []);
    emit('on-reset-zoom');
    return;
  }

  if (activeLocationType.value === 'locality') {
    const countyInStack = props.locations.find((loc) => loc.type === 'county');
    if (countyInStack) {
      emit('update-active-location', [countyInStack]);
      emit('zoom-to-location', {
        type: 'county',
        data: countyInStack.data,
        fips: countyInStack.fips ?? countyInStack.data?.fips
      });
      return;
    }

    const stateInStack = props.locations.find((loc) => loc.type === 'state');
    if (stateInStack) {
      emit('update-active-location', [stateInStack]);
      emit('zoom-to-location', { type: 'state', data: stateInStack.data });
      return;
    }

    emit('update-active-location', []);
    emit('on-reset-zoom');
  }
}
</script>
