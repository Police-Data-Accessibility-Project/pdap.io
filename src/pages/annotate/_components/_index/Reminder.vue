<template>
  <div v-if="showReminder" class="notice notice--muted">
    <button
      @click="handleClose"
      class="notice-close"
      aria-label="Dismiss reminder"
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <p class="text-sm">
      <slot />
    </p>
  </div>
</template>

<script setup lang="ts">
//====================
//Props, Models, Emits
//====================
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'closed'): boolean;
}>();

//====================
//    Variables
//====================
const showReminder = ref(true);

//====================
//  Control Logic
//====================
function handleClose(): void {
  emit('closed');
  showReminder.value = false;
}
</script>

<style scoped>
.notice {
  @apply relative rounded-lg border p-4 pr-10;
}

.notice--muted {
  @apply border-wineneutral-200 bg-wineneutral-50 text-wineneutral-700;
}

.notice-close {
  @apply absolute right-3 top-3 text-wineneutral-400 hover:text-wineneutral-700 transition-colors;
}
</style>
