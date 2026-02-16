<template>
  <div class="tab-controls">
    <button
      class="tab-controls-btn tab-controls-btn--secondary"
      :disabled="currentIndex === 0"
      @click="emit('prev')"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
      Previous
    </button>

    <button
      class="tab-controls-btn tab-controls-btn--primary"
      :disabled="isNextDisabled"
      @click="emit('next')"
    >
      {{ nextTextModel }}
      <svg
        class="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
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

<style scoped>
.tab-controls {
  @apply mt-4 flex justify-between items-center gap-3;
}

.tab-controls-btn {
  @apply inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150;
}

.tab-controls-btn:disabled {
  @apply opacity-40 cursor-not-allowed;
}

.tab-controls-btn--secondary {
  @apply bg-wineneutral-800 text-wineneutral-100 border border-wineneutral-600;
}

.tab-controls-btn--secondary:not(:disabled):hover {
  @apply bg-wineneutral-700 border-wineneutral-500;
}

.tab-controls-btn--primary {
  @apply bg-amber-600 text-white border border-amber-700;
}

.tab-controls-btn--primary:not(:disabled):hover {
  @apply bg-amber-500;
}
</style>
