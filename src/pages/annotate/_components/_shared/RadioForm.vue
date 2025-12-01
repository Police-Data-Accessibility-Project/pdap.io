<script setup>
import { ref } from 'vue';

const selectedType = ref('');

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  header: {
    type: String,
    default: null
  }
});

// TODO: How to pass reset logic to radio form, deselecting all?
// TODO: Add emit for selection
</script>

<template>
  <h2>{{ props.header }}</h2>
  <div class="grid gap-4">
    <label
      v-for="option in options"
      :key="option.value"
      class="cursor-pointer rounded-xl p-4 border flex flex-col items-center transition hover:bg-gray-100"
      :class="{
        'bg-orange-600 text-white border-orange-700':
          selectedType === option.value,
        'bg-purple-600': selectedType !== option.value
      }">
      <input
        v-model="selectedType"
        type="radio"
        class="hidden"
        name="url-type"
        :value="option.value" />

      <div class="font-semibold">{{ option.label }}</div>
    </label>
  </div>
</template>
