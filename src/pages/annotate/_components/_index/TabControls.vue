<!-- src/components/StepControls.vue -->
<template>
  <div class="mt-2 flex justify-between items-center">
    <button
      class="px-4 py-2 pdap-button-secondary text-sm"
      :disabled="currentIndex === 0"
      @click="emit('prev')"
    >
      Previous
    </button>

    <button
      class="px-4 py-2 pdap-button-primary text-sm"
      :disabled="isNextDisabled"
      @click="emit('next')"
    >
      {{ nextTextModel }}
    </button>
  </div>
</template>

<script setup lang="ts">
//====================
//Props, Models, Emits
//====================
const props = defineProps<{
  currentIndex: number;
  total: number;
  isNextDisabled: boolean;
}>();

const nextTextModel = defineModel({
  type: String,
  default: 'Next'
});

const emit = defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
}>();
</script>
