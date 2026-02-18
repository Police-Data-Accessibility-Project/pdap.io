<template>
  <div class="search-form">
    <Typeahead
      :id="TYPEAHEAD_ID"
      ref="typeaheadRef"
      :format-item-for-display="(item) => item.display_name"
      :items="items"
      :placeholder="placeholder ?? 'Enter a place'"
      @select-item="handleSelectRecord"
      @on-input="fetchTypeaheadResults"
    >
      <!-- Pass label as slot to typeahead -->
      <template #label>
        <h4
          class="text-xs font-bold text-wineneutral-500 uppercase tracking-wider"
        >
          Search location
        </h4>
      </template>

      <!-- Item to render passed as scoped slot -->
      <template #item="item">
        <!-- eslint-disable-next-line vue/no-v-html This data is coming from our API, so we can trust it-->
        <span v-html="typeaheadRef?.boldMatchText(item.display_name)" />
        <span
          class="border border-wineneutral-300 rounded-full text-wineneutral-600 text-xs px-2 py-0.5 ml-2"
        >
          {{ item.type }}
        </span>
      </template>

      <template #not-found>
        <span class="text-sm text-wineneutral-600">
          We don't have agencies in the place you're looking for. Is it spelled
          correctly? If our database is missing something, please reach us at
          <a href="mailto:contact@pdap.io" class="font-semibold underline">
            contact@pdap.io
          </a>
        </span>
      </template>
    </Typeahead>
  </div>
</template>

<script setup lang="ts">
import Typeahead from '@/components/TypeaheadInput.vue';
import { computed, onMounted, ref } from 'vue';
import _debounce from 'lodash/debounce';
import { useRoute } from 'vue-router';
import { getTypeaheadLocations } from '@/api/typeahead';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { TYPEAHEAD_LOCATIONS } from '@/util/queryKeys';

//====================
//Props, Models, Emits
//====================
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

//====================
//     Constants
//====================
const TYPEAHEAD_ID = 'pdap-search-typeahead';

//====================
//     Variables
//====================
const items = ref<Array>([]);
const selectedRecord = ref();
const typeaheadRef = ref();
const initiallySearchedRecord = ref();

//====================
// Computed Variables
//====================
const queryKey = computed<string>(() => [
  TYPEAHEAD_LOCATIONS,
  typeaheadRef.value?.value.toLowerCase()
]);

//===================
//  Request Logic
//===================
const { query: params } = useRoute();

const queryClient = useQueryClient();

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

//===================
//   Control Logic
//===================
onMounted(() => {
  // Set up selected state based on params
  if (params.location_id) {
    selectedRecord.value = params;
    initiallySearchedRecord.value = params;
  }
});

//===================
//     Handlers
//===================
function handleSelectRecord(item) {
  emit('update:modelValue', item);
}
</script>

<style scoped>
.search-form {
  @apply rounded-lg border border-wineneutral-200 bg-wineneutral-50 p-4 min-h-[200px];
}
</style>
