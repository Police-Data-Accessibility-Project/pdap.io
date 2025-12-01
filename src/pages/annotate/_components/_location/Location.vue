<template>
  <div>
    <p>Location: {{ location?.display_name }}</p>
    <p>Location ID: {{ location?.location_id }}</p>
    <div class="grid grid-cols-2 gap-4">
      <div class="col-auto">
        <RadioForm :options="userOptions" header="👥" />
      </div>
      <div class="col-auto">
        <RadioForm :options="roboOptions" header="🤖" />
      </div>
    </div>
    <SearchForm v-model="location" @update:model-value="handleLocationSelect" />
  </div>
</template>

<script setup>
import SearchForm from '@/pages/annotate/_components/_location/SearchLocationForm.vue';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';
import { ref } from 'vue';

const location = defineModel({ type: Number, default: null });
const emit = defineEmits(['update:modelValue']);

function handleLocationSelect(loc) {
  emit('update:modelValue', location);
}

// TODO: Dynamically populate user options from annotation info
const userOptions = ref([
  { value: -1, label: 'Location Display Name' },
  { value: -2, label: 'Another Location Display Name' },
  { value: -3, label: 'Also A Location Display Name' }
]);

// TODO: Dynamically populate robo options from annotation info
const roboOptions = ref([
  { value: -4, label: 'Location 1' },
  { value: -5, label: 'Location 2' },
  { value: -6, label: 'Location 3' }
]);
</script>

<style scoped></style>
