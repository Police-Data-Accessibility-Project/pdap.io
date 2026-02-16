<template>
  <div>
    <h3 class="view-heading">Select an agency</h3>

    <div v-if="agencyModel" class="view-current">
      <span class="view-current-label">Selected:</span>
      <strong>{{ agencyModel.display_name }}</strong>
    </div>

    <div v-if="radioOptions.length" class="view-suggestions">
      <RadioForm
        v-model="selectedRadioAgency"
        :options="radioOptions"
        header="Suggestions"
        @update:model-value="handleRadioFormSelect"
      />
    </div>

    <div class="view-search">
      <h4 class="view-search-label">Or search for an agency</h4>
      <SearchForm @update:model-value="handleAgencySelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Agency Annotation Component
 *
 * Handles logic for selecting agency annotations.
 * Allows user to select agency from user- or robo-provided suggestions
 * OR to select a new agency entirely from a typeahead search.
 */
import SearchForm from '@/pages/annotate/_components/_agency/SearchAgencyForm.vue';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';
import { getEndorsementLabels } from '@/pages/annotate/_components/_shared/helpers';

import { computed, type PropType, ref, watch } from 'vue';
import {
  AgencyLocationSelection,
  AgencyLocationSuggestion,
  RadioOption
} from '@/pages/annotate/_components/_shared/types';

//====================
//Props, Models, Emits
//====================
const props = defineProps({
  suggestions: {
    type: Array as PropType<AgencyLocationSuggestion[] | null>,
    default: null
  }
});

const agencyModel = defineModel<AgencyLocationSelection | null>({
  default: null
});
const resetKey = defineModel<number>('resetKey', { default: 0 });

const emit = defineEmits<{
  (e: 'select', v: null): void;
}>();

//====================
//     Variables
//====================
const selectedRadioAgency = ref<RadioOption | null>(null);

//====================
// Computed Variables
//====================
const radioOptions = computed<RadioOption[]>(() => {
  const raw = props.suggestions ?? [];

  return raw.map(
    (s): RadioOption => ({
      value: s.id,
      display_name: s.display_name,
      label: s.display_name,
      anno_labels: getEndorsementLabels(s)
    })
  );
});

//===================
//  Control Logic
//===================
const resetRadio = () => {
  selectedRadioAgency.value = null;
};

watch(resetKey, () => {
  resetRadio();
});

//===================
//     Handlers
//===================
function handleRadioFormSelect(option: RadioOption) {
  agencyModel.value = {
    id: Number(option.value),
    display_name: option.display_name
  };
  emit('select', null);
}

function handleAgencySelect(ag: AgencyLocationSelection | null) {
  if (ag == null) {
    return;
  }
  resetRadio();
  agencyModel.value = ag;
  emit('select', null);
}
</script>

<style scoped>
.view-heading {
  @apply text-sm font-semibold text-wineneutral-600 uppercase tracking-wider mb-4;
}

.view-current {
  @apply mb-4 text-sm bg-amber-900/20 border border-amber-600 rounded-lg px-3 py-2 text-amber-100;
}

.view-current-label {
  @apply text-wineneutral-500 mr-1;
}

.view-suggestions {
  @apply mb-5 pb-5 border-b border-wineneutral-200;
}

.view-search {
  @apply mt-2;
}

.view-search-label {
  @apply text-xs font-bold text-wineneutral-500 uppercase tracking-wider mb-2;
}
</style>
