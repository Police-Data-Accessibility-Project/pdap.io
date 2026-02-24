<template>
  <div>
    <h4
      v-if="props.header"
      class="text-xs font-bold text-wineneutral-700 uppercase tracking-wider mb-2"
    >
      {{ props.header }}
    </h4>
    <div class="space-y-1.5">
      <label
        v-for="option in options"
        :key="option.value"
        :for="`option-${option.value}`"
        class="flex items-center px-3 py-2.5 cursor-pointer transition-all duration-150 border border-transparent"
        :class="
          selectedType?.value === option.value
            ? 'bg-brand-wine-900/30 border-brand-wine-400 text-wineneutral-100'
            : 'hover:bg-wineneutral-100 hover:border-wineneutral-200'
        "
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
        <span class="flex items-center gap-2">
          <span class="text-sm font-semibold">{{ option.label }}</span>
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
