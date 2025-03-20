<template>
  <div class="px-4 mb-4 border-wineneutral-300 bg-wineneutral-50 border-2">
    <div
      class="col-span-1 flex flex-col mt-4 gap-4 @md:col-span-2 @lg:col-span-3 @md:flex-row @md:gap-0">
      <Typeahead
        :id="TYPEAHEAD_ID"
        ref="typeaheadRef"
        :format-item-for-display="(item) => item.display_name"
        :items="items"
        :placeholder="placeholder ?? 'Enter a place'"
        @select-item="onSelectRecord"
        @on-input="fetchTypeaheadResults">
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
      class="grid grid-cols-1 auto-rows-auto max-w-full gap-0.5 @md:gap-1 @md:grid-cols-2 @lg:grid-cols-3"
      @change="onChange"
      @submit="submit">
      <InputCheckbox
        v-for="{ id, defaultChecked, name, label } in CHECKBOXES"
        :id="id"
        :key="name"
        :default-checked="defaultChecked"
        :name="name">
        <template #label>
          <RecordTypeIcon :record-type="label" />
          {{ label }}
        </template>
      </InputCheckbox>

      <Button
        :disabled="isButtonDisabled"
        intent="primary"
        type="submit"
        class="mt-4 max-w-full col-span-full">
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
import { computed, onMounted, ref } from 'vue';
import _debounce from 'lodash/debounce';
import _isEqual from 'lodash/isEqual';
import { useRouter, useRoute } from 'vue-router';
import { getTypeaheadLocations } from '@/api/typeahead';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { TYPEAHEAD_LOCATIONS } from '@/util/queryKeys';

const router = useRouter();

const { buttonCopy } = defineProps({
  buttonCopy: String,
  placeholder: String
});

const emit = defineEmits(['searched']);
const { query: params } = useRoute();

/* constants */
const TYPEAHEAD_ID = 'pdap-search-typeahead';
const CHECKBOXES = [
  {
    id: 'all-data-types',
    get defaultChecked() {
      return (
        params.record_categories?.includes(this.label) ||
        !params.record_categories?.length
      );
    },
    name: 'all-data-types',
    label: 'All data types'
  },
  {
    id: 'interactions',
    get defaultChecked() {
      return params.record_categories?.includes(this.label);
    },
    name: 'police-and-public-interactions',
    label: 'Police & public interactions'
  },
  {
    id: 'info-officers',
    get defaultChecked() {
      return params.record_categories?.includes(this.label);
    },
    name: 'info-about-officers',
    label: 'Info about officers'
  },
  {
    id: 'info-agencies',
    get defaultChecked() {
      return params.record_categories?.includes(this.label);
    },
    name: 'info-about-agencies',
    label: 'Info about agencies'
  },
  {
    id: 'agency-published-resources',
    get defaultChecked() {
      return params.record_categories?.includes(this.label);
    },
    name: 'agency-published-resources',
    label: 'Agency-published resources'
  },
  {
    id: 'jails-and-courts',
    get defaultChecked() {
      return params.record_categories?.includes(this.label);
    },
    name: 'jails-and-courts',
    label: 'Jails & Courts'
  }
];

const items = ref([]);
const selectedRecord = ref();
const formRef = ref();
const typeaheadRef = ref();
const initiallySearchedRecord = ref();
const hasUpdatedCategories = ref(false);

const isButtonDisabled = computed(() => {
  if (!selectedRecord.value && !initiallySearchedRecord.value) return true;

  const selectedRecordEqualsInitiallySearched = _isEqual(
    selectedRecord.value,
    initiallySearchedRecord.value
  );

  // If there is a selected record, the button should be enabled
  if (selectedRecord.value && !selectedRecordEqualsInitiallySearched)
    return false;

  if (
    selectedRecordEqualsInitiallySearched &&
    initiallySearchedRecord.value &&
    !hasUpdatedCategories.value
  )
    return true;

  return false;
});
const queryClient = useQueryClient();
const queryKey = computed(() => [
  TYPEAHEAD_LOCATIONS,
  typeaheadRef.value?.value.toLowerCase()
]);

const typeaheadMutation = useMutation({
  mutationFn: async (searchValue) => {
    if (!searchValue || searchValue.length <= 1) {
      return queryClient.getQueryData(queryKey.value) || [];
    }
    const response = await getTypeaheadLocations(searchValue);
    return response.length ? response : undefined;
  },
  onSuccess: (data) => {
    items.value = data;
    // Update the query cache with the new data
    queryClient.setQueryData(queryKey, data, {
      staleTime: 5 * 60 * 1000
    });
  }
});

const fetchTypeaheadResults = _debounce(
  async () => {
    const searchValue = typeaheadRef.value?.value;
    // Check cache
    const cached = queryClient.getQueryData(queryKey);
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

onMounted(() => {
  // Set up selected state based on params
  if (params.location_id) {
    selectedRecord.value = params;
    initiallySearchedRecord.value = params;
  }

  // Sync values state with default checked state.
  const defaultChecked = {};
  CHECKBOXES.forEach(({ name, label }) => {
    if (params.record_categories?.includes(label)) {
      defaultChecked[name] = true;
    }
  });
  formRef.value.setValues(defaultChecked);
});

function submit(values) {
  const params = new URLSearchParams(buildParams(values));
  const path = `/search/results?${params.toString()}`;
  router.push(path);
  emit('searched');
}

function buildParams(values) {
  const obj = {};

  /* Handle record from typeahead input */
  const selected = selectedRecord.value ?? initiallySearchedRecord.value;

  if (!selected) return obj;

  obj.location_id = selected.location_id;

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
  }

  if (event.target.type === 'checkbox') hasUpdatedCategories.value = true;
}

function onSelectRecord(item) {
  selectedRecord.value = item;
  items.value = [];
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
