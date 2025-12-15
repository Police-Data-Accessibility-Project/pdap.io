<template>
  <div>
    <p>Agency: {{ agencyModel?.display_name }}</p>
    <p>Agency ID: {{ agencyModel?.id }}</p>
    <div class="grid grid-cols-1 gap-4">
      <div class="col-auto">
        <RadioForm
          v-model="selectedRadioAgency"
          :options="radioOptions"
          header="Suggestions"
          @update:model-value="handleRadioFormSelect" />
      </div>
    </div>
    <SearchForm @update:model-value="handleAgencySelect" />
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
  AgencyLocationSelectionType,
  AgencyLocationSuggestionType,
  RadioOptionType
} from '@/pages/annotate/_components/_shared/types';

//====================
//Props, Models, Emits
//====================
const props = defineProps({
  suggestions: {
    type: Array as PropType<AgencyLocationSuggestionType[] | null>,
    default: null
  }
});

const agencyModel = defineModel<AgencyLocationSelectionType | null>({ default: null });
const resetKey = defineModel<number>('resetKey', { default: 0 });

const emit = defineEmits<{
  (e: 'select', v: null): void
}>()

//====================
//     Variables
//====================
const selectedRadioAgency = ref<RadioOptionType | null>(null);

//====================
// Computed Variables
//====================
const radioOptions = computed<RadioOptionType[]>(() => {
  const raw = props.suggestions ?? [];

  return raw.map((s): RadioOptionType => ({
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
  selectedRadioAgency.value = null;
};

watch(resetKey, () => {
  resetRadio();
})

//===================
//     Handlers
//===================
function handleRadioFormSelect(option: RadioOptionType) {

  agencyModel.value = {
    id: Number(option.value), // option.value is typed as String | Number
    display_name: option.display_name
  };
  emit('select', null);
}

function handleAgencySelect(ag: AgencyLocationSelectionType | null) {
  if (ag == null) {
    return;
  }
  resetRadio();
  agencyModel.value = ag;
  emit('select', null);
}

</script>

<style scoped></style>
