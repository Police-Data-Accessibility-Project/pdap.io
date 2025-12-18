<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
    <div
      v-for="option in formattedOptions"
      :key="option.value"
      class="p-4 cursor-pointer rounded-lg border transition"
      :class="handleOuterBlockClass(option.value)"
      @click="handleSelectOption(option.value)">
      <div
        class="rounded-lg p-4 "
        :class="handleInnerBlockClass(option.value)">
        <p>{{ option.value }}</p>
        <p class="text-sm">{{descriptionMapping[option.value]}}</p>
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

// Mapping to descriptions
const descriptionMapping = {
  [urlTypes.DATA_SOURCE]: "Public records about police systems",
  [urlTypes.META_URL]: "An relevant agency's landing page, or info about the agency.",
  [urlTypes.NOT_RELEVANT]: 'Not a data source or meta URL',
  [urlTypes.INDIVIDUAL]: 'An individual record where a list of records is available.',
  [urlTypes.BROKEN]: 'Page cannot be accessed.',
  [urlTypes.NOT_SURE]: "I don't know what this is."
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

function handleInnerBlockClass(option: string): string {
  if (props.modelValue?.display_name == option) {
    return "bg-wineneutral-700 text-black font-bold";
  }
  return  'bg-black text-white';
}

function handleOuterBlockClass(option: string): string {
  if (props.modelValue?.display_name == option) {
    return "bg-wineneutral-300 border-wineneutral-500 hover:border-amber-800";
  }
  return  'bg-wineneutral-50 border-transparent hover:border-amber-800';
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

