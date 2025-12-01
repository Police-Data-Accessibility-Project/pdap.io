<template>
  <div>
    <p>Agency: {{ agency?.display_name }}</p>
    <p>Agency ID: {{ agency?.id }}</p>
    <div class="grid grid-cols-2 gap-4">
      <div class="col-auto">
        <RadioForm :options="userOptions" header="👥" />
      </div>
      <div class="col-auto">
        <RadioForm :options="roboOptions" header="🤖" />
      </div>
    </div>
    <SearchForm v-model="agency" @update:model-value="handleAgencySelect" />
  </div>
</template>

<script setup>
import SearchForm from '@/pages/annotate/_components/_agency/SearchAgencyForm.vue';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';

import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
});


const agency = ref(null);
const emit = defineEmits(['update:modelValue']);

function handleAgencySelect(ag) {
  emit('update:modelValue', { ...ag });
}

// TODO: Dynamically populate user options from annotation info
const userOptions = ref([
  { value: -1, label: 'Agency Display Name' },
  { value: -2, label: 'Another Agency Display Name' },
  { value: -3, label: 'Also A Agency Display Name' }
]);

// TODO: Dynamically populate robo options from annotation info
const roboOptions = ref([
  { value: -4, label: 'Agency 1' },
  { value: -5, label: 'Agency 2' },
  { value: -6, label: 'Agency 3' }
]);
</script>

<style scoped></style>
