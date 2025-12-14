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
  enabledIndices: Array<number>
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
}>()

//====================
//      Helpers
//====================
function getClasses(index: number) {
  if (index === props.currentIndex) {
    return 'border-blue-600 text-blue-600 font-semibold';
  }
  if (props.enabledIndices.includes(index)) {
    return 'border-transparent text-white-400';
  }
  return 'border-transparent text-gray-400';
}

</script>