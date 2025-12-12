
<template>
  <h2>{{ props.header }}</h2>
  <div class="grid gap-4">
    <label
      v-for="option in options"
      :key="option.value"
      class="cursor-pointer rounded-xl p-4 border flex flex-col items-center transition hover:bg-gray-100"
      :class="labelClasses(option)">
      <input
        v-model="selectedType"
        type="radio"
        class="hidden"
        name="url-type"
        :value="option"
        @change="handleSelect(option)" />

      <div class="font-semibold">{{ option.label + " " }}<AnnotationSpan :labels="option.anno_labels"/></div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RadioOptionType } from '@/pages/annotate/_components/_shared/types';
import AnnotationSpan from '@/pages/annotate/_components/_shared/AnnotationSpan.vue';

//====================
//Props, Models, Emits
//====================
export type Props = {
  options: RadioOptionType[];
  header?: string | null;
  modelValue?: RadioOptionType | null;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [RadioOptionType | null];
}>();

//====================
// Computed Variables
//====================
const selectedType = computed<RadioOptionType | null>({
  get: () => props.modelValue ?? null,
  set: (option) => emit('update:modelValue', option)
});

//===================
//     Handlers
//===================
function handleSelect(option: RadioOptionType) {
  emit('update:modelValue', option);
}

//====================
//     Helpers
//====================
function labelClasses(option: RadioOptionType) {
  return {
    'bg-orange-600 text-white border-orange-700':
      selectedType.value?.value === option.value,
    'bg-purple-600':
      selectedType.value?.value !== option.value
  };
}


</script>
