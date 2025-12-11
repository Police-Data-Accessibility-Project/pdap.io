<script setup lang="ts">
import { computed, PropType } from 'vue';
import {
  urlTypeType,
  urlTypes,
  URLTypeSuggestion,
} from '@/pages/annotate/_components/_shared/types';

//====================
//Props, Models, Emits
//====================
const props = defineProps({
  options: {
    type: Array as PropType<urlTypeType[]>,
    required: true
  },
  modelValue: {
    type: String as PropType<urlTypeType>,
    default: null
  },
  suggestions: {
    type: Array as PropType<URLTypeSuggestion[] | null>,
    default: null
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: urlTypeType): void;
}>()

//====================
//       Types
//====================
type URLTypeOption = {
  value: urlTypeType;
  endorsementString: string;
}
//====================
// Constants
//====================
// Mapping to URL Types
const urlTypeMapping = {
  [urlTypes.DATA_SOURCE]: 'data source',
  [urlTypes.META_URL]: 'meta url',
  [urlTypes.NOT_RELEVANT]: 'not relevant',
  [urlTypes.INDIVIDUAL]: 'individual record',
  [urlTypes.BROKEN]: 'broken page'
};


//====================
// Computed Variables
//====================
const suggestionMap = computed<Record<urlTypeType, number>>(() => {
  return Object.fromEntries(
    props.suggestions.map((s) => [s.url_type, s.endorsement_count]) // or transform however you want
  );
});

const formattedOptions = computed<URLTypeOption[]>(() =>
  props.options.map((opt) => ({
    value: opt,
    endorsementString: getEndorsementString(opt)
  }))
);

//====================
//     Helpers
//====================
function getEndorsementString(ut: urlTypeType): string {
  const suggestionKey: string = urlTypeMapping[ut];

  if (!(suggestionKey in suggestionMap.value)) {
    return '';
  }

  const endorsementCount = suggestionMap.value[suggestionKey];
  return '👥 ' + endorsementCount;
}

//===================
//     Handlers
//===================
function handleSelectOption(option: string) {
  emit('update:modelValue', {
    value: urlTypeMapping[option],
    display_name: option
  });
}

</script>

<template>
  <div class="grid grid-cols-3 grid-rows-2 gap-4">
    <div
      v-for="option in formattedOptions"
      :key="option.value"
      class="p-4 cursor-pointer rounded-lg border transition"
      :class="{
        'bg-blue-200 border-blue-500': props.modelValue?.display_name === option.value,
        'bg-purple-900 border-transparent': props.modelValue?.display_name !== option.value
      }"
      @click="handleSelectOption(option.value)">
      <div
        class="rounded-lg p-4 text-white"
        :class="props.modelValue?.display_name === option.value ? 'bg-blue-700' : 'bg-black'">
        {{ option.value }}
      </div>

      <div class="mt-2">{{ option.endorsementString }}</div>
    </div>
  </div>
</template>
