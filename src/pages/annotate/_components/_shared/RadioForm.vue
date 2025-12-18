<template>
  <h2>{{ props.header }}</h2>
  <form id="id" name="name" class="pdap-form">
    <div class="grid gap-4 pdap-input-radio-group">
      <div
        class="pdap-input pdap-input-radio"
        v-for="option in options"
        :key="option.value"
      >
        <input
          :id="`option-${option.value}`"
          v-model="selectedType"
          type="radio"
          class="hidden"
          name="url-type"
          :value="option"
          @change="handleSelect(option)"
        />

        <label :for="`option-${option.value}`" class="hover:text-amber-800">
          <div class="font-semibold">
            {{ option.label + ' ' }}
            <AnnotationSpan :labels="option.anno_labels" />
          </div>
        </label>
      </div>
    </div>
  </form>
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
