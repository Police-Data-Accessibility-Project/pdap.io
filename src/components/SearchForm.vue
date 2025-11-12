<template>
  <div class="px-4 mb-4 border-wineneutral-300 bg-wineneutral-50 border-2">
    <div
      class="col-span-1 flex flex-col mt-4 gap-4 @md:col-span-2 @lg:col-span-3 @md:flex-row @md:gap-0"
    >
      <Typeahead
        :id="TYPEAHEAD_ID"
        ref="typeaheadRef"
        :data-test="TEST_IDS.search_typeahead"
        :format-item-for-display="
          (item) =>
            item?.display_name || item?.name || getFullLocationText(item)
        "
        :items="items"
        :placeholder="placeholder ?? 'Enter a place'"
        @select-item="onSelectRecord"
        @on-input="fetchTypeaheadResults"
      >
        <!-- Pass label as slot to typeahead -->
        <template #label>
          <h4 class="uppercase">Search location</h4>
        </template>

        <!-- Item to render passed as scoped slot -->
        <template #item="item">
          <!-- eslint-disable-next-line vue/no-v-html This data is coming from our API, so we can trust it-->
          <span v-html="typeaheadRef?.boldMatchText(item.display_name)" />
          <span class="locale-type">
            {{ item.type }}
          </span>
          <span class="select">Select</span>
        </template>
        <template #not-found>
          <span>
            We don't have agencies in the place you're looking for. Is it
            spelled correctly? If our database is missing something, please
            reach us at
            <a href="mailto:contat@pdap.io">contact@pdap.io</a>
          </span>
        </template>
      </Typeahead>
    </div>

    <h4 class="w-full mt-6 like-h4">Types of data</h4>
    <FormV2
      id="pdap-data-sources-search"
      ref="formRef"
      :data-test="TEST_IDS.search_form"
      class="grid grid-cols-1 auto-rows-auto max-w-full gap-0.5 @md:gap-1 @md:grid-cols-2 @lg:grid-cols-3"
      @change="onChange"
      @submit="submit"
    >
      <InputCheckbox
        v-for="{ id, name, label } in CHECKBOXES"
        :id="id"
        :key="name"
        :name="name"
      >
        <template #label>
          <RecordTypeIcon :record-type="label" />
          {{ label }}
        </template>
      </InputCheckbox>

      <Button
        :disabled="isButtonDisabled"
        intent="primary"
        type="submit"
        :data-test="TEST_IDS.search_submit"
        class="mt-4 max-w-full col-span-full"
      >
        {{ buttonCopy ?? 'Search' }}
      </Button>
    </FormV2>
  </div>
</template>

<script setup>
import {
  Button,
  FormV2,
  InputCheckbox,
  RecordTypeIcon
} from 'pdap-design-system';
import Typeahead from '@/components/TypeaheadInput.vue';
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import _debounce from 'lodash/debounce';
import _isEqual from 'lodash/isEqual';
import { useRouter, useRoute } from 'vue-router';
import { getTypeaheadLocations } from '@/api/typeahead';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { TYPEAHEAD_LOCATIONS } from '@/util/queryKeys';
import { TEST_IDS } from '../../e2e/fixtures/test-ids';
import { useSearchStore } from '@/stores/search';
import { normalizeParamsForSearch } from '@/util/searchParams';
import { getFullLocationText } from '@/util/locationFormatters';

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();

const { buttonCopy } = defineProps({
  buttonCopy: String,
  placeholder: String
});

const emit = defineEmits(['searched']);

/* constants */
const TYPEAHEAD_ID = 'pdap-search-typeahead';
const CHECKBOXES = [
  { id: 'all-data-types', name: 'all-data-types', label: 'All data types' },
  {
    id: 'interactions',
    name: 'police-and-public-interactions',
    label: 'Police & public interactions'
  },
  {
    id: 'info-officers',
    name: 'info-about-officers',
    label: 'Info about officers'
  },
  {
    id: 'info-agencies',
    name: 'info-about-agencies',
    label: 'Info about agencies'
  },
  {
    id: 'agency-published-resources',
    name: 'agency-published-resources',
    label: 'Agency-published resources'
  },
  {
    id: 'jails-and-courts',
    name: 'jails-and-courts',
    label: 'Jails & Courts'
  }
];

function normalizeCategory(value) {
  if (!value) return '';
  try {
    return decodeURIComponent(value.replace(/\+/g, ' ')).trim().toLowerCase();
  } catch (error) {
    return value.replace(/\+/g, ' ').trim().toLowerCase();
  }
}

const routeCategories = computed(() => {
  const raw = route.query.record_categories;
  if (!raw) return [];
  const entries = Array.isArray(raw) ? raw : raw.split(',');
  return entries
    .flatMap((entry) => entry.split(','))
    .map(normalizeCategory)
    .filter(Boolean);
});

const items = ref([]);
const selectedRecord = ref();
const formRef = ref();
const typeaheadRef = ref();
const initiallySearchedRecord = ref();
const isEditingLocation = ref(false);
const hasUpdatedCategories = ref(false);
const hasLocation = computed(() =>
  Boolean(
    selectedRecord.value ||
      initiallySearchedRecord.value ||
      searchStore.activeLocation?.location_id ||
      route.query.location_id
  )
);

const isButtonDisabled = computed(() => {
  if (!hasLocation.value) return true;

  const selectedRecordEqualsInitiallySearched = _isEqual(
    selectedRecord.value,
    initiallySearchedRecord.value
  );

  const isSelectedAndDifferent =
    selectedRecord.value && !selectedRecordEqualsInitiallySearched;
  const isSelectedAndSameAndHomePage =
    selectedRecord.value &&
    selectedRecordEqualsInitiallySearched &&
    route.path === '/';

  if (isSelectedAndDifferent || isSelectedAndSameAndHomePage) return false;

  if (
    selectedRecordEqualsInitiallySearched &&
    initiallySearchedRecord.value &&
    !hasUpdatedCategories.value
  )
    return true;

  return false;
});
const queryClient = useQueryClient();
const activeLocationId = computed(
  () => searchStore.activeLocation?.location_id ?? route.query.location_id ?? null
);
const queryKeyTypeahead = computed(() => [
  TYPEAHEAD_LOCATIONS,
  typeaheadRef.value?.value.toLowerCase()
]);

const typeaheadMutation = useMutation({
  mutationFn: async (searchValue) => {
    if (!searchValue || searchValue.length <= 1) {
      return queryClient.getQueryData(queryKeyTypeahead.value) || [];
    }
    const response = await getTypeaheadLocations(searchValue);
    return response.length ? response : undefined;
  },
  onSuccess: (data) => {
    items.value = data;
    // Update the query cache with the new data
    queryClient.setQueryData(queryKeyTypeahead, data, {
      staleTime: 5 * 60 * 1000
    });
  }
});

const fetchTypeaheadResults = _debounce(
  async () => {
    const searchValue = typeaheadRef.value?.value;
    // Check cache
    const cached = queryClient.getQueryData(queryKeyTypeahead);
    if (cached) {
      items.value = cached;
      return;
    }

    // Otherwise refresh data
    typeaheadMutation.mutate(searchValue);
  },
  200,
  { leading: true, trailing: true }
);

watch(
  () => searchStore.activeLocation,
  (location) => {
    if (!location) {
      if (!route.query.location_id) {
        clearSelectedLocation();
      }
      return;
    }

    applyLocationToForm(location);
  },
  { immediate: true }
);

// We rely entirely on the search store to supply the active location.
// Other parts of the app (maps, results pages, typeahead) are responsible
// for hydrating the store when needed.

function normalizeLocationRecord(location) {
  if (!location) return null;
  const locationId =
    location.location_id ?? location.id ?? location.data?.location_id;
  if (!locationId) return null;

  return {
    ...location,
    location_id: String(locationId)
  };
}

function applyLocationToForm(location) {
  const normalized = normalizeLocationRecord(location);
  if (!normalized) return;

  const locationChanged =
    normalized.location_id !== selectedRecord.value?.location_id;

  if (isEditingLocation.value && !locationChanged) {
    return;
  }

  items.value = [];
  initiallySearchedRecord.value = normalized;
  selectedRecord.value = normalized;
  hasUpdatedCategories.value = false;
  isEditingLocation.value = false;

  if (typeaheadRef.value) {
    typeaheadRef.value.selectItem(normalized);
  }
}

function clearSelectedLocation() {
  items.value = [];
  selectedRecord.value = null;
  initiallySearchedRecord.value = null;
  hasUpdatedCategories.value = false;
  isEditingLocation.value = false;
  typeaheadRef.value?.clearInput();
}

onMounted(syncCategoriesFromRoute);

watch(() => route.query.record_categories, syncCategoriesFromRoute);

async function syncCategoriesFromRoute() {
  await nextTick();
  if (!formRef.value) return;
  const formEl = document.getElementById('pdap-data-sources-search');
  if (!formEl) return;

  const normalized = routeCategories.value;
  CHECKBOXES.forEach(({ name, label }) => {
    const input = formEl.querySelector(`input[name="${name}"]`);
    if (!input) return;
    if (name === 'all-data-types') {
      input.checked = normalized.length === 0;
    } else {
      input.checked = normalized.includes(normalizeCategory(label));
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  hasUpdatedCategories.value = false;
}

function submit() {
  // Build values from actual DOM state to avoid any partial value issues
  // NOTE: this indicates that we need better form/input components. TODO @joshuagraber research this
  const effectiveValues = getCheckboxValues();
  const built = buildParams(effectiveValues);

  const params = new URLSearchParams(
    normalizeParamsForSearch({
      location_id: built.location_id,
      record_categories: built.record_categories,
      record_types: route.query.record_types
    })
  );

  const path = `/search/results?${params.toString()}`;
  router.push(path);
  emit('searched');
}

function getCheckboxValues() {
  const values = {};
  const formEl = document.getElementById('pdap-data-sources-search');
  if (!formEl) return values;

  const inputs = formEl.querySelectorAll('input[type="checkbox"][name]');
  inputs.forEach((input) => {
    values[input.name] = !!input.checked;
  });
  return values;
}

function buildParams(values) {
  const obj = {};

  /* Handle record from typeahead input */
  const selected =
    selectedRecord.value ??
    initiallySearchedRecord.value ??
    (activeLocationId.value
      ? { location_id: activeLocationId.value }
      : null);

  if (!selected) return obj;

  obj.location_id = selected.location_id ?? activeLocationId.value;

  /* Handle form values from checkboxes */
  // Return obj without setting record_types if 'all-data-types' is true or no checkboxes checked
  if (
    values['all-data-types'] ||
    Object.values(values).every((val) => !val || !val)
  ) {
    return obj;
  }
  // Otherwise set record_types array
  const inputIdsToRecordTypes = new Map(
    CHECKBOXES.map(({ name, label }) => [name, label])
  );
  obj.record_categories = Object.entries(values)
    .map(([key, val]) => val && inputIdsToRecordTypes.get(key))
    .filter(Boolean);

  return obj;
}

function onChange(values, event) {
  if (event.target.name === 'all-data-types') {
    if (event.target.checked) {
      const update = {};
      CHECKBOXES.map(({ name }) => name).forEach((key) => {
        if (key !== 'all-data-types') {
          update[key] = false;
          const checkbox = document.querySelector(`input[name=${key}]`);
          checkbox.checked = false;
        }
      });
      formRef.value.setValues({ ...values, ...update });
    }
  } else {
    const allTypesCheckbox = document.querySelector(
      'input[name="all-data-types"]'
    );
    if (allTypesCheckbox.checked && event.target.checked) {
      formRef.value.setValues({ ...values, ['all-data-types']: false });
      allTypesCheckbox.checked = false;
    }

    if (
      // All other checkboxes are unchecked, default the all checkbox to checked
      CHECKBOXES.filter(({ name }) => name !== 'all-data-types').every(
        ({ name }) => {
          const checkbox = document.querySelector(`input[name=${name}]`);
          return !checkbox?.checked;
        }
      )
    ) {
      formRef.value.setValues({ ...values, ['all-data-types']: true });
      allTypesCheckbox.checked = true;
    }
  }

  if (event.target.type === 'checkbox') hasUpdatedCategories.value = true;
}

function onSelectRecord(item) {
  const normalized = normalizeLocationRecord(item);
  selectedRecord.value = normalized;
  items.value = [];
  isEditingLocation.value = true;
  if (normalized) {
    searchStore.setActiveLocation(normalized);
  }
}
</script>

<style scoped>
.select {
  @apply ml-auto;
}

.locale-type {
  @apply border-solid border-2 border-neutral-700 dark:border-neutral-400 rounded-full text-neutral-700 dark:text-neutral-400 text-xs @md:text-sm px-2 py-1;
}
</style>
