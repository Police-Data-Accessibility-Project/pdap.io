<template>
  <!-- Desktop stepper -->
  <nav class="stepper-desktop" aria-label="Annotation steps">
    <template v-for="(tab, index) in tabs" :key="tab.id">
      <button
        class="stepper-step"
        :class="{ 'stepper-step--clickable': isClickable(index) }"
        :disabled="!isClickable(index)"
        @click="isClickable(index) && emit('select', index)"
      >
        <!-- Circle -->
        <div class="stepper-circle" :class="getCircleClasses(index)">
          <!-- Checkmark for answered -->
          <svg
            v-if="answeredIndices.includes(index) && index !== currentIndex"
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <!-- Dash for skipped -->
          <svg
            v-else-if="skippedIndices.includes(index)"
            class="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 12h14"
            />
          </svg>
          <!-- Number otherwise -->
          <span v-else class="text-xs font-bold">{{ index + 1 }}</span>
        </div>

        <!-- Label -->
        <span class="stepper-label" :class="getLabelClasses(index)">
          {{ tab.name }}
        </span>
      </button>

      <!-- Connecting line -->
      <div
        v-if="index < tabs.length - 1"
        class="stepper-line"
        :class="getLineClasses(index)"
      />
    </template>
  </nav>

  <!-- Mobile stepper -->
  <nav class="stepper-mobile" aria-label="Annotation steps">
    <div class="stepper-mobile-info">
      <span class="stepper-mobile-label">{{ tabs[currentIndex]?.name }}</span>
      <span class="stepper-mobile-count">
        Step {{ currentStepNumber }} of {{ totalSteps }}
      </span>
    </div>
    <div class="stepper-dots">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        class="stepper-dot"
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
    return 'stepper-circle--active';
  }
  if (props.answeredIndices.includes(index)) {
    return 'stepper-circle--completed';
  }
  if (props.skippedIndices.includes(index)) {
    return 'stepper-circle--skipped';
  }
  if (props.enabledIndices.includes(index)) {
    return 'stepper-circle--enabled';
  }
  return 'stepper-circle--disabled';
}

function getLabelClasses(index: number): string {
  if (index === props.currentIndex) {
    return 'stepper-label--active';
  }
  if (props.answeredIndices.includes(index)) {
    return 'stepper-label--completed';
  }
  if (props.skippedIndices.includes(index)) {
    return 'stepper-label--skipped';
  }
  if (props.enabledIndices.includes(index)) {
    return 'stepper-label--enabled';
  }
  return 'stepper-label--disabled';
}

function getLineClasses(index: number): string {
  const nextIndex = index + 1;
  if (
    props.answeredIndices.includes(index) &&
    (props.answeredIndices.includes(nextIndex) ||
      nextIndex === props.currentIndex)
  ) {
    return 'stepper-line--completed';
  }
  if (
    props.enabledIndices.includes(index) &&
    props.enabledIndices.includes(nextIndex)
  ) {
    return 'stepper-line--enabled';
  }
  return 'stepper-line--disabled';
}

function getDotClasses(index: number): string {
  if (index === props.currentIndex) {
    return 'stepper-dot--active';
  }
  if (props.answeredIndices.includes(index)) {
    return 'stepper-dot--completed';
  }
  if (props.skippedIndices.includes(index)) {
    return 'stepper-dot--skipped';
  }
  if (props.enabledIndices.includes(index)) {
    return 'stepper-dot--enabled';
  }
  return 'stepper-dot--disabled';
}
</script>

<style scoped>
/* Desktop stepper */
.stepper-desktop {
  @apply hidden md:flex items-center;
}

.stepper-step {
  @apply flex flex-col items-center gap-1.5 bg-transparent border-none p-0 min-w-0;
}

.stepper-step--clickable {
  @apply cursor-pointer;
}

.stepper-step--clickable:hover .stepper-circle--enabled,
.stepper-step--clickable:hover .stepper-circle--completed {
  @apply ring-2 ring-brand-wine-200 ring-offset-1;
}

/* Circles */
.stepper-circle {
  @apply w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0;
}

.stepper-circle--active {
  @apply bg-brand-wine-600 text-white;
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--color-brand-wine-600) 20%, transparent),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.stepper-circle--completed {
  @apply bg-brand-gold-500 text-white;
}

.stepper-circle--skipped {
  @apply bg-wineneutral-200 text-wineneutral-500;
}

.stepper-circle--enabled {
  @apply bg-wineneutral-100 text-wineneutral-600 border-2 border-wineneutral-300;
}

.stepper-circle--disabled {
  @apply bg-wineneutral-50 text-wineneutral-300 border border-wineneutral-200;
}

/* Labels */
.stepper-label {
  @apply text-xs font-medium whitespace-nowrap transition-colors hidden lg:block;
}

.stepper-label--active {
  @apply text-brand-wine-700 font-bold;
}

.stepper-label--completed {
  @apply text-brand-gold-700;
}

.stepper-label--skipped {
  @apply text-wineneutral-400 line-through;
}

.stepper-label--enabled {
  @apply text-wineneutral-600;
}

.stepper-label--disabled {
  @apply text-wineneutral-300;
}

/* Connecting lines */
.stepper-line {
  @apply flex-1 h-0.5 mx-1.5 rounded-full transition-colors duration-200 self-start mt-4;
}

.stepper-line--completed {
  @apply bg-brand-gold-400;
}

.stepper-line--enabled {
  @apply bg-wineneutral-200;
}

.stepper-line--disabled {
  @apply bg-wineneutral-100;
}

/* Mobile stepper */
.stepper-mobile {
  @apply flex md:hidden flex-col gap-3 px-1;
}

.stepper-mobile-info {
  @apply flex items-center justify-between;
}

.stepper-mobile-label {
  @apply text-lg font-bold text-brand-wine-700;
}

.stepper-mobile-count {
  @apply text-sm text-wineneutral-500;
}

.stepper-dots {
  @apply flex items-center gap-2 justify-center;
}

.stepper-dot {
  @apply w-2.5 h-2.5 rounded-full transition-all duration-200 p-0 border-none;
}

.stepper-dot--active {
  @apply bg-brand-wine-600 scale-125;
}

.stepper-dot--completed {
  @apply bg-brand-gold-500 cursor-pointer;
}

.stepper-dot--skipped {
  @apply bg-wineneutral-300;
}

.stepper-dot--enabled {
  @apply bg-wineneutral-200 cursor-pointer;
}

.stepper-dot--disabled {
  @apply bg-wineneutral-100;
}
</style>
