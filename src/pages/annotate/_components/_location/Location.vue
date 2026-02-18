<template>
  <div>
    <h3 class="view-heading">Select a location</h3>

    <div v-if="locationModel" class="view-current">
      <span class="view-current-label">Selected:</span>
      <strong>{{ locationModel.display_name }}</strong>
    </div>

    <div v-if="radioOptions.length" class="view-suggestions">
      <RadioForm
        v-model="selectedRadioLocation"
        :options="radioOptions"
        header="Suggestions"
        @update:model-value="handleRadioFormSelect"
      />
    </div>

    <div class="view-search">
      <h4 class="view-search-label">Or search for a location</h4>
      <SearchForm @update:model-value="handleSearchLocationSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Location Annotation Component
 *
 * Handles logic for selecting location annotations.
 * Allows user to select location from user- or robo- provided suggestions
 * OR to select a new location entirely from a typeahead search.
 */
import SearchForm from '@/pages/annotate/_components/_location/SearchLocationForm.vue';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';
import { computed, PropType, ref, watch } from 'vue';
import { getEndorsementLabels } from '@/pages/annotate/_components/_shared/helpers';
import { LocationSuggestion } from '@/pages/annotate/_components/_location/types';
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

const locationModel = defineModel<AgencyLocationSelection>({ default: null });
const resetKey = defineModel<number>('resetKey');

const emit = defineEmits<{
  (e: 'select', v: null): void;
}>();

//====================
//     Variables
//====================
const selectedRadioLocation = ref<RadioOption | null>(null);

//====================
// Computed Variables
//====================
const radioOptions = computed((): RadioOption[] => {
  return props.suggestions.map((s) => ({
    value: s.id,
    display_name: s.display_name,
    label: s.display_name,
    anno_labels: getEndorsementLabels(s)
  }));
});

//===================
//  Control Logic
//===================
const resetRadio = () => {
  selectedRadioLocation.value = null;
};

watch(resetKey, () => {
  resetRadio();
});

//===================
//     Handlers
//===================
function handleRadioFormSelect(option: RadioOption) {
  locationModel.value = {
    id: Number(option.value),
    display_name: option.display_name
  };
  emit('select', null);
}

function handleSearchLocationSelect(loc: LocationSuggestion) {
  if (loc === undefined) {
    return;
  }

  resetRadio();
  locationModel.value = {
    id: Number(loc.location_id),
    display_name: loc.display_name
  };
  emit('select', null);
}
</script>

<style scoped>
.view-heading {
  @apply text-sm font-semibold text-wineneutral-600 uppercase tracking-wider mb-4;
}

.view-current {
  @apply mb-4 text-sm bg-goldneutral-900/20 border border-goldneutral-600 rounded-lg px-3 py-2 text-goldneutral-100;
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
