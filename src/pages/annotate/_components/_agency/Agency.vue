<template>
  <div>
    <p>Agency: {{ agency?.display_name }}</p>
    <p>Agency ID: {{ agency?.id }}</p>
    <div class="grid grid-cols-1 gap-4">
      <div class="col-auto">
        <RadioForm
          :options="radioOptions"
          header="Suggestions"
          @update:model-value="handleRadioFormSelect" />
      </div>
    </div>
    <SearchForm v-model="agency" @update:model-value="handleAgencySelect" />
  </div>
</template>

<script setup>
import SearchForm from '@/pages/annotate/_components/_agency/SearchAgencyForm.vue';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';
import { getEndorsementString } from '@/pages/annotate/_components/_shared/helpers';

import { computed } from 'vue';

const props = defineProps({
  suggestions: {
    type: Array,
    default: null
  }
});

const resetSelection = () => {
  agency.value = null;
};

const agency = defineModel({ type: Object, default: null });

function handleRadioFormSelect(option) {
  agency.value = {
    id: option.value,
    display_name: option.display_name
  };
}

function handleAgencySelect(ag) {
  if (ag === undefined) {
    return;
  }
  resetSelection();
  agency.value = {
    id: ag.id,
    display_name: ag.display_name
  };
}

const radioOptions = computed(() => {
  return props.suggestions.map((s) => ({
    value: s.id,
    display_name: s.display_name,
    label: getEndorsementString(s)
  }));
});
</script>

<style scoped></style>
