<template>
  <div>
    <h4 v-if="props.header" class="rf-header">{{ props.header }}</h4>
    <div class="rf-options">
      <label
        v-for="option in options"
        :key="option.value"
        :for="`option-${option.value}`"
        class="rf-option"
        :class="{ 'rf-option--selected': selectedType?.value === option.value }"
      >
        <input
          :id="`option-${option.value}`"
          v-model="selectedType"
          type="radio"
          class="sr-only"
          name="url-type"
          :value="option"
          @change="handleSelect(option)"
        />
        <span class="rf-option-content">
          <span class="rf-option-label">{{ option.label }}</span>
          <AnnotationSpan
            v-if="option.anno_labels?.user || option.anno_labels?.robo"
            :labels="option.anno_labels"
          />
        </span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Radio Annotation Component
 *
 * Provides a suite of radio options, along with information on how
 *  users or robo-annotations annotated them.
 */
import { computed } from 'vue';
import { RadioOption } from '@/pages/annotate/_components/_shared/types';
import AnnotationSpan from '@/pages/annotate/_components/_shared/AnnotationSpan.vue';

//====================
//Props, Models, Emits
//====================
export type Props = {
  options: RadioOption[];
  header?: string | null;
  modelValue?: RadioOption | null;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [RadioOption | null];
}>();

//====================
// Computed Variables
//====================
const selectedType = computed<RadioOption | null>({
  get: () => props.modelValue ?? null,
  set: (option) => emit('update:modelValue', option)
});

//===================
//     Handlers
//===================
function handleSelect(option: RadioOption) {
  emit('update:modelValue', option);
}
</script>

<style scoped>
.rf-header {
  @apply text-xs font-bold text-wineneutral-500 uppercase tracking-wider mb-2;
}

.rf-options {
  @apply space-y-1.5;
}

.rf-option {
  @apply flex items-center rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-150 border border-transparent;
}

.rf-option:hover {
  @apply bg-wineneutral-100 border-wineneutral-200;
}

.rf-option--selected {
  @apply bg-brand-wine-50 border-brand-wine-300;
}

.rf-option-content {
  @apply flex items-center gap-2;
}

.rf-option-label {
  @apply text-sm font-semibold;
}
</style>
