<template>
  <div
    v-if="showReminder"
    class="relative border p-4 pr-10 border-wineneutral-200 bg-wineneutral-50 text-wineneutral-700"
  >
    <button
      @click="handleClose"
      class="absolute right-3 top-3 text-wineneutral-400 hover:text-wineneutral-700 transition-colors"
      aria-label="Dismiss reminder"
    >
      <FontAwesomeIcon :icon="faXmark" class="w-4 h-4" />
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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
