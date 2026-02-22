<template>
  <!-- Desktop stepper -->
  <nav
    data-test="annotate-stepper-desktop"
    class="hidden md:flex items-center"
    aria-label="Labeling steps"
  >
    <template v-for="(tab, index) in tabs" :key="tab.id">
      <button
        :data-test="`annotate-step-${tab.id}`"
        class="flex flex-col items-center gap-1.5 bg-transparent border-none p-0 min-w-0"
        :class="{ 'cursor-pointer': isClickable(index) }"
        :disabled="!isClickable(index)"
        @click="isClickable(index) && emit('select', index)"
      >
        <!-- Circle -->
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0"
          :class="getCircleClasses(index)"
        >
          <!-- Checkmark for answered -->
          <FontAwesomeIcon
            v-if="answeredIndices.includes(index) && index !== currentIndex"
            :icon="faCheck"
            class="w-3.5 h-3.5"
          />
          <!-- Dash for skipped -->
          <FontAwesomeIcon
            v-else-if="skippedIndices.includes(index)"
            :icon="faMinus"
            class="w-3 h-3"
          />
          <!-- Number otherwise -->
          <span v-else class="text-xs font-bold">{{ index + 1 }}</span>
        </div>

        <!-- Label -->
        <span
          class="text-xs font-medium whitespace-nowrap transition-colors hidden lg:block"
          :class="getLabelClasses(index)"
        >
          {{ tab.name }}
        </span>
      </button>

      <!-- Connecting line -->
      <div
        v-if="index < tabs.length - 1"
        class="flex-1 h-0.5 mx-1.5 rounded-full transition-colors duration-200 self-start mt-4"
        :class="getLineClasses(index)"
      />
    </template>
  </nav>

  <!-- Mobile stepper -->
  <nav
    data-test="annotate-stepper-mobile"
    class="flex md:hidden flex-col gap-3 px-1"
    aria-label="Labeling steps"
  >
    <div class="flex items-center justify-between">
      <span class="text-lg font-bold text-wineneutral-800">
        {{ tabs[currentIndex]?.name }}
      </span>
      <span class="text-sm text-wineneutral-700">
        Step {{ currentStepNumber }} of {{ totalSteps }}
      </span>
    </div>
    <div class="flex items-center gap-2 justify-center">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        class="w-2.5 h-2.5 rounded-full transition-all duration-200 p-0 border-none"
        :class="getDotClasses(i)"
        :disabled="!isClickable(i)"
        :aria-label="`Step ${i + 1}: ${tab.name}`"
        @click="isClickable(i) && emit('select', i)"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';

//====================
//       Types
//====================
interface Tab {
  id: string | number;
  name: string;
}

//====================
//Props, Models, Emits
//====================
const props = defineProps<{
  tabs: Tab[];
  currentIndex: number;
  enabledIndices: Array<number>;
  answeredIndices: Array<number>;
  skippedIndices: Array<number>;
}>();

const emit = defineEmits<{
  (e: 'select', index: number): void;
}>();

//====================
// Computed Variables
//====================
const currentStepNumber = computed(() => {
  const enabledBefore = props.enabledIndices.filter(
    (i) => i <= props.currentIndex
  );
  return enabledBefore.length || 1;
});

const totalSteps = computed(
  () => props.enabledIndices.length || props.tabs.length
);

//====================
//      Helpers
//====================
function isClickable(index: number): boolean {
  return props.enabledIndices.includes(index);
}

function getCircleClasses(index: number): string {
  if (index === props.currentIndex) {
    return 'bg-brand-wine-500 text-white shadow-sm';
  }
  if (props.answeredIndices.includes(index)) {
    return 'bg-wineneutral-500 text-white';
  }
  if (props.skippedIndices.includes(index)) {
    return 'bg-wineneutral-100 text-wineneutral-400 border-2 border-dashed border-wineneutral-300';
  }
  if (props.enabledIndices.includes(index)) {
    return 'bg-wineneutral-100 text-wineneutral-600 border-2 border-wineneutral-300';
  }
  return 'bg-wineneutral-50 text-wineneutral-300 border border-wineneutral-200';
}

function getLabelClasses(index: number): string {
  if (index === props.currentIndex) {
    return 'text-wineneutral-800 font-bold';
  }
  if (props.answeredIndices.includes(index)) {
    return 'text-wineneutral-700';
  }
  if (props.skippedIndices.includes(index)) {
    return 'text-wineneutral-700';
  }
  if (props.enabledIndices.includes(index)) {
    return 'text-wineneutral-700';
  }
  return 'text-wineneutral-700';
}

function getLineClasses(index: number): string {
  const nextIndex = index + 1;
  if (
    props.answeredIndices.includes(index) &&
    (props.answeredIndices.includes(nextIndex) ||
      nextIndex === props.currentIndex)
  ) {
    return 'bg-wineneutral-400';
  }
  if (
    props.enabledIndices.includes(index) &&
    props.enabledIndices.includes(nextIndex)
  ) {
    return 'bg-wineneutral-200';
  }
  return 'bg-wineneutral-100';
}

function getDotClasses(index: number): string {
  if (index === props.currentIndex) {
    return 'bg-brand-wine-400 scale-125';
  }
  if (props.answeredIndices.includes(index)) {
    return 'bg-wineneutral-400 cursor-pointer';
  }
  if (props.skippedIndices.includes(index)) {
    return 'bg-wineneutral-300';
  }
  if (props.enabledIndices.includes(index)) {
    return 'bg-wineneutral-200 cursor-pointer';
  }
  return 'bg-wineneutral-100';
}
</script>
