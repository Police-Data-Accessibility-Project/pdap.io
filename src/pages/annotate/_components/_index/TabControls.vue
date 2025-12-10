<!-- src/components/StepControls.vue -->
<template>
  <div class="mt-6 flex justify-between items-center">
    <button
        class="px-4 py-2 rounded-md border text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="currentIndex === 0"
        @click="emit('prev')"
    >
      Previous
    </button>

    <span class="text-sm text-gray-500">
      Step {{ currentIndex + 1 }} of {{ total }}
    </span>

    <button
        class="px-4 py-2 rounded-md border bg-blue-600 text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="isNextDisabled"
        @click="emit('next')"
    >
      {{nextText}}
    </button>
  </div>
</template>

<script setup lang="ts">

const nextText = defineModel({
  type: String,
  default: 'Next'
})

const props = defineProps<{
  currentIndex: number
  total: number
  isNextDisabled: boolean
}>()

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script>