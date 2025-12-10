<template>
  <div>
    <p>Agency: {{ agency?.display_name }}</p>
    <p>Agency ID: {{ agency?.id }}</p>
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
import SearchForm from '@/pages/annotate/_components/_agency/SearchAgencyForm.vue';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';
import { getEndorsementString } from '@/pages/annotate/_components/_shared/helpers';

import { computed, type PropType, ref } from 'vue';
import {
  AgencyLocationSelectionType,
  AgencyLocationSuggestionType,
  RadioOptionType
} from '@/pages/annotate/_components/_shared/types';

// ─────────────────────────────────────
// Props
// ─────────────────────────────────────

const props = defineProps({
  suggestions: {
    type: Array as PropType<AgencyLocationSuggestionType[] | null>,
    default: null
  }
});


// ─────────────────────────────────────
// State
// ─────────────────────────────────────

const selectedRadioAgency = ref<RadioOptionType | null>(null);
const agency = defineModel<AgencyLocationSelectionType | null>({ default: null });

// ─────────────────────────────────────
// Helpers
// ─────────────────────────────────────

const resetRadio = () => {
  selectedRadioAgency.value = null;
};


const radioOptions = computed<RadioOptionType[]>(() => {
  const raw = props.suggestions ?? [];

  return raw.map((s): RadioOptionType => ({
    value: s.id,
    display_name: s.display_name,
    label: getEndorsementString(s)
  }));
});


// ─────────────────────────────────────
// Event handlers
// ─────────────────────────────────────

function handleRadioFormSelect(option: RadioOptionType) {

  agency.value = {
    id: Number(option.value), // option.value is typed as String | Number
    display_name: option.display_name
  };
}

function handleAgencySelect(ag: AgencyLocationSelectionType | null) {
  if (ag == null) {
    return;
  }
  resetRadio();
  agency.value = ag;
}


</script>

<style scoped></style>
