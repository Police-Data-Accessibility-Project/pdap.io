<template>
  <div>
    <p>Location: {{ locationModel?.display_name }}</p>
    <p>Location ID: {{ locationModel?.id }}</p>
    <div class="grid grid-cols-1 gap-4">
      <div class="col-auto">
        <RadioForm
          v-model="selectedRadioLocation"
          :options="radioOptions"
          header="Suggestions"
          @update:model-value="handleRadioFormSelect" />
      </div>
    </div>
    <SearchForm @update:model-value="handleSearchLocationSelect" />
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
    type: Array as PropType<AgencyLocationSuggestion[] | null> ,
    default: null
  }
});

const locationModel = defineModel<AgencyLocationSelection>({ default: null });
const resetKey = defineModel<number>('resetKey');

const emit = defineEmits<{
  (e: 'select', v: null): void
}>()

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
})

//===================
//     Handlers
//===================
function handleRadioFormSelect(option: RadioOption) {
  locationModel.value = {
    id: Number(option.value), // option.value is typed as String | Number
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

<style scoped></style>
