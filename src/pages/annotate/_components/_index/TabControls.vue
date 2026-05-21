<template>
  <div
    data-test="annotate-tab-controls"
    class="mt-4 flex justify-between items-center gap-3"
  >
    <button
      data-test="annotate-prev-button"
      class="pdap-button-secondary inline-flex items-center gap-2"
      :disabled="currentIndex === 0"
      @click="emit('prev')"
    >
      <FontAwesomeIcon :icon="faChevronLeft" class="w-4 h-4" />
      Previous
    </button>

    <button
      data-test="annotate-next-button"
      class="pdap-button-primary inline-flex items-center gap-2"
      :disabled="isNextDisabled"
      @click="emit('next')"
    >
      {{ nextTextModel }}
      <FontAwesomeIcon :icon="faChevronRight" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

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
