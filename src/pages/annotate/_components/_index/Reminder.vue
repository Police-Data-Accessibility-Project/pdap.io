

<template>
  <div
    class="relative rounded-lg border border-amber-400 bg-amber-900 p-4 text-amber-50"
  >
    <button
      @click="handleClose"
      class="absolute right-3 top-3 text-amber-100 hover:text-amber-400"
      aria-label="Dismiss warning"
    >
      ✕
    </button>
   <slot/>
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
