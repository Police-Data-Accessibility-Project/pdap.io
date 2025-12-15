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

      <div class="mt-2">
        <AnnotationSpan
        :labels="option.annoLabels"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * URL Type Annotation Component
 *
 * Handles logic for selecting URL Type Annotations
 * URL types are included along with counts of how many other users
 *  selected the same URL type for this URL.
 * Selection of URL Type impacts what other components are allowed to be
 *  annotated for the given URL.
 */
import { computed, PropType } from 'vue';
import {
  UrlType,
  urlTypes,
  URLTypeSuggestion, URLTypeSelection, AnnoLabels
} from '@/pages/annotate/_components/_shared/types';
import AnnotationSpan from '@/pages/annotate/_components/_shared/AnnotationSpan.vue';

//====================
//Props, Models, Emits
//====================
const props = defineProps({
  options: {
    type: Array as PropType<UrlType[]>,
    required: true
  },
  modelValue: {
    type: Object as PropType<URLTypeSelection>,
    default: null
  },
  suggestions: {
    type: Array as PropType<URLTypeSuggestion[] | null>,
    default: null
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: UrlType): void;
  (e: 'select', value: null): void
}>()

//====================
//       Types
//====================
type URLTypeOption = {
  value: UrlType;
  annoLabels?: AnnoLabels | null;
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
const suggestionMap = computed<Record<UrlType, number>>(() => {
  return Object.fromEntries(
    props.suggestions.map((s) => [s.url_type, s.endorsement_count]) // or transform however you want
  );
});

const formattedOptions = computed<URLTypeOption[]>(() =>
  props.options.map((opt) => ({
    value: opt,
    annoLabels: getAnnotationSuggestionValues(opt)
  }))
);

//===================
//     Handlers
//===================
function handleSelectOption(option: string) {
  emit('update:modelValue', {
    value: urlTypeMapping[option],
    display_name: option
  });
  emit('select', null);
}

//====================
//     Helpers
//====================
function getAnnotationSuggestionValues(ut: UrlType): AnnoLabels {
  const suggestionKey: string = urlTypeMapping[ut];
  if (!(suggestionKey in suggestionMap.value)) {
    return {};
  }

  const endorsementCount: number = suggestionMap.value[suggestionKey];
  return {
    user: endorsementCount.toString()
  }

}

</script>

