<!-- src/components/TabsHeader.vue -->
<template>
  <div class="border-b border-gray-300 flex space-x-4">
    <div
        v-for="(tab, index) in tabs"
        :key="tab.id"
        class="py-2 px-4 -mb-px border-b-2 cursor-pointer"
        :class="index === currentIndex
        ? 'border-blue-600 text-blue-600 font-semibold'
        : 'border-transparent text-gray-400'
      "
        @click="emit('select', index)"
    >
      {{ tab.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: string | number
  name: string
  // ...anything else you have on tab
}

const props = defineProps<{
  tabs: Tab[]
  currentIndex: number
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
}>()
</script>