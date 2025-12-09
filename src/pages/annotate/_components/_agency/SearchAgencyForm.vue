<template>
  <div class="px-4 mb-4 border-wineneutral-300 bg-wineneutral-50 border-2">
    <div
      class="col-span-1 flex flex-col mt-4 gap-4 @md:col-span-2 @lg:col-span-3 @md:flex-row @md:gap-0">
      <Typeahead
        id="agencies"
        ref="typeaheadRef"
        class="md:col-span-2"
        :error="typeaheadError"
        :format-item-for-display="formatText"
        :items="items"
        placeholder="Enter an agency"
        @select-item="onSelectRecord"
        @on-input="fetchTypeaheadResults">
        <!-- Item to render passed as scoped slot -->
        <template #item="item">
          <!-- eslint-disable-next-line vue/no-v-html This data is coming from our API, so we can trust it-->
          <span v-html="typeaheadRef?.boldMatchText(formatText(item))" />
          <span class="select">Select</span>
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
              ">
              <strong>No results found.</strong>
              Would you like to suggest
              {{ typeaheadRef.value }}
              be added to our agencies database?
            </Button>
          </span>
        </template>
      </Typeahead>
      <!--TODO: This is a hacky fix to account for the fact that, without these, the suggestions disappear from the div-->
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  </div>
</template>

<script setup>
import _debounce from 'lodash/debounce';
import { computed, ref } from 'vue';
import { TYPEAHEAD_AGENCIES } from '@/util/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { formatText } from '@/pages/data-source/_util';
import Typeahead from '@/components/TypeaheadInput.vue';
import { Button } from 'pdap-design-system';
import { getTypeaheadAgencies } from '@/api/typeahead';

const agencyNotAvailable = ref('');
const queryClient = useQueryClient();
const typeaheadRef = ref();
const typeaheadError = ref();
const items = ref([]);
const emit = defineEmits(['selected', 'update:modelValue']);

const queryKey = computed(() => [
  TYPEAHEAD_AGENCIES,
  typeaheadRef.value?.value.toLowerCase()
]);

const typeaheadMutation = useMutation({
  mutationFn: async (searchValue) => {
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

function onSelectRecord(item) {
  emit('update:modelValue', item);
}
</script>

<style scoped></style>
