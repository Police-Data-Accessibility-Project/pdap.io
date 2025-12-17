<template>
  <div class="border-b border-gray-300 flex space-x-4">
    <div
        v-for="(tab, index) in tabs"
        :key="tab.id"
        class="py-2 px-4 -mb-px border-b-2 cursor-pointer"
        :class="getClasses(index)"
        @click="emit('select', index)"
    >
      {{ tab.name }}
    </div>
  </div>
</template>

<script setup lang="ts">

//====================
//       Types
//====================
interface Tab {
  id: string | number
  name: string
}

//====================
//Props, Models, Emits
//====================
const props = defineProps<{
  tabs: Tab[]
  currentIndex: number,
  enabledIndices: Array<number>,
  answeredIndices: Array<number>,
  skippedIndices: Array<number>,
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
}>()

//====================
//      Helpers
//====================
function getClasses(index: number) {
  // Selected/Current Tab
  if (index === props.currentIndex) {
    return 'text-brand-wine-500 font-bold';
  }
  // Completed Tab
  if (props.answeredIndices.includes(index)) {
    return 'text-wineneutral-500 font-bold';
  }
  // Skipped Tab
  if (props.skippedIndices.includes(index)) {
    return 'text-wineneutral-300 line-through';
  }
  // Enabled Tab Not Yet Accessed/Future Inactive
  if (props.enabledIndices.includes(index)) {
    return 'text-wineneutral-700';
  }
  // Disabled Tab
  return 'text-wineneutral-300';
}

</script>