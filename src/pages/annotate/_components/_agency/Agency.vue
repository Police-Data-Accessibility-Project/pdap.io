<template>
  <div>
    <p>Agency: {{ agency?.display_name }}</p>
    <p>Agency ID: {{ agency?.id }}</p>
    <div class="grid grid-cols-1 gap-4">
      <div class="col-auto">
        <RadioForm :options="radioOptions" header="Suggestions" />
      </div>
    </div>
    <SearchForm v-model="agency" @update:model-value="handleAgencySelect" />
  </div>
</template>

<script setup>
import SearchForm from '@/pages/annotate/_components/_agency/SearchAgencyForm.vue';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';
import {getEndorsementString} from "@/pages/annotate/_components/_shared/helpers";

import {computed, ref} from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  suggestions: {
    type: Array,
    default: null
  }
});


const agency = ref(null);
const emit = defineEmits(['update:modelValue']);

function handleAgencySelect(ag) {
  emit('update:modelValue', { ...ag });
}



const radioOptions = computed(() => {
  return props.suggestions.map((s) => ({
    value: s.id,
    label: getEndorsementString(s)
  }));
});

</script>

<style scoped></style>
