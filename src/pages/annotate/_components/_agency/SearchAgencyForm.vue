<template>
  <div
    data-test="annotate-agency-search"
    class="border border-wineneutral-200 bg-wineneutral-50 p-4 min-h-[200px]"
  >
    <Typeahead
      id="agencies"
      ref="typeaheadRef"
      :error="typeaheadError"
      :format-item-for-display="formatText"
      :items="items"
      placeholder="Enter an agency"
      @select-item="handleSelectRecord"
      @on-input="fetchTypeaheadResults"
    >
      <!-- Item to render passed as scoped slot -->
      <template #item="item">
        <!-- eslint-disable-next-line vue/no-v-html This data is coming from our API, so we can trust it-->
        <span v-html="typeaheadRef?.boldMatchText(formatText(item))" />
      </template>

      <template #not-found>
        <span>
          <Button
            class="text-left p-0"
            intent="tertiary"
            type="button"
            @click="
              () => {
                agencyNotAvailable = typeaheadRef.value;
                items = [];
                typeaheadRef.clearInput();
              }
            "
          >
            <strong>No results found.</strong>
            Would you like to suggest
            {{ typeaheadRef.value }}
            be added to our agencies database?
          </Button>
        </span>
      </template>
    </Typeahead>
  </div>
</template>

<script setup lang="ts">
import _debounce from 'lodash/debounce';
import { computed, ref } from 'vue';
import { TYPEAHEAD_AGENCIES } from '@/util/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { formatText } from '@/pages/data-sources/_util';
import Typeahead from '@/components/TypeaheadInput.vue';
import { Button } from 'pdap-design-system';
import {
  getTypeaheadAgencies,
  type TypeaheadAgencySuggestion
} from '@/api/typeahead';

//====================
//Props, Models, Emits
//====================
const emit = defineEmits<{
  (e: 'selected', value: TypeaheadAgencySuggestion): void;
  (e: 'update:modelValue', value: TypeaheadAgencySuggestion): void;
}>();

//====================
//     Variables
//====================
const agencyNotAvailable = ref('');
const typeaheadRef = ref();
const typeaheadError = ref();
const items = ref<TypeaheadAgencySuggestion[]>([]);

//====================
// Computed Variables
//====================
const queryKey = computed(() => [
  TYPEAHEAD_AGENCIES,
  typeaheadRef.value?.value.toLowerCase()
]);

//====================
//   Request Logic
//====================
const queryClient = useQueryClient();

const typeaheadMutation = useMutation<
  TypeaheadAgencySuggestion[] | undefined,
  Error,
  string
>({
  mutationFn: async (searchValue: string) => {
    if (!searchValue || searchValue.length <= 1) {
      return queryClient.getQueryData(queryKey.value) || [];
    }
    const response = await getTypeaheadAgencies(searchValue);
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
//     Handlers
//===================
function handleSelectRecord(item: TypeaheadAgencySuggestion) {
  emit('update:modelValue', item);
}
</script>
