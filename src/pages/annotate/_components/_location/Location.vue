<template>
  <div>
    <p>Location: {{ location?.display_name }}</p>
    <p>Location ID: {{ location?.id }}</p>
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
import SearchForm from '@/pages/annotate/_components/_location/SearchLocationForm.vue';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';
import { computed, PropType, ref } from 'vue';
import { getEndorsementString } from '@/pages/annotate/_components/_shared/helpers';
import { LocationSuggestionType } from '@/pages/annotate/_components/_location/types';
import {
  AgencyLocationSelectionType,
  AgencyLocationSuggestionType,
  RadioOptionType
} from '@/pages/annotate/_components/_shared/types';

//====================
//Props, Models, Emits
//====================
const props = defineProps({
  suggestions: {
    type: Array as PropType<AgencyLocationSuggestionType[] | null> ,
    default: null
  }
});

const location = defineModel<AgencyLocationSelectionType>({ default: null });

//====================
//     Variables
//====================
const selectedRadioLocation = ref<RadioOptionType | null>(null);

//====================
// Computed Variables
//====================
const radioOptions = computed((): RadioOptionType[] => {
  return props.suggestions.map((s) => ({
    value: s.id,
    display_name: s.display_name,
    label: getEndorsementString(s)
  }));
});

//===================
//  Control Logic
//===================
const resetRadio = () => {
  selectedRadioLocation.value = null;
};

//===================
//     Handlers
//===================
function handleRadioFormSelect(option: RadioOptionType) {
  location.value = {
    id: Number(option.value), // option.value is typed as String | Number
    display_name: option.display_name
  };
}

function handleSearchLocationSelect(loc: LocationSuggestionType) {
  if (loc === undefined) {
    return;
  }

  resetRadio();
  location.value = {
    id: Number(loc.location_id),
    display_name: loc.display_name
  };
}
</script>

<style scoped></style>
