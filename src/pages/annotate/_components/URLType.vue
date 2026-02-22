<template>
  <div>
    <h3 class="text-sm font-semibold text-wineneutral-800 uppercase tracking-wider mb-4">What type of page is this?</h3>
    <div data-test="annotate-url-type" class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
      <button
        v-for="option in formattedOptions"
        :key="option.value"
        type="button"
        :data-test="`annotate-url-type-${option.value.toLowerCase().replace(/[\s\/]+/g, '-')}`"
        class="text-left border-2 p-3 sm:p-4 transition-all duration-150 cursor-pointer w-full"
        :class="
          props.modelValue?.display_name === option.value
            ? 'border-brand-wine-500 bg-brand-wine text-white outline outline-1 outline-brand-wine-500'
            : 'border-wineneutral-200 bg-wineneutral-50 hover:border-brand-wine-300 hover:bg-wineneutral-100'
        "
        @click="handleSelectOption(option.value)"
      >
        <div class="flex flex-col gap-1">
          <span
            class="font-bold text-sm"
            :class="props.modelValue?.display_name === option.value ? 'text-white' : 'text-wineneutral-900'"
          >{{ option.value }}</span>
          <span
            class="text-xs leading-relaxed"
            :class="props.modelValue?.display_name === option.value ? 'text-white/90' : 'text-wineneutral-700'"
          >
            {{ descriptionMapping[option.value] }}
          </span>
        </div>

        <AnnotationSpan
          v-if="option.annoLabels?.user || option.annoLabels?.robo"
          :labels="option.annoLabels"
          class="mt-2"
        />
      </button>
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
  URLTypeSuggestion,
  URLTypeSelection,
  AnnoLabels
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
  (e: 'select', value: null): void;
}>();

//====================
//       Types
//====================
type URLTypeOption = {
  value: UrlType;
  annoLabels?: AnnoLabels | null;
};
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
  [urlTypes.DATA_SOURCE]: 'Public records about police systems',
  [urlTypes.META_URL]:
    "A relevant agency's landing page, or info about the agency.",
  [urlTypes.NOT_RELEVANT]: 'Not a data source or meta URL',
  [urlTypes.INDIVIDUAL]:
    'An individual record where a list of records is available.',
  [urlTypes.BROKEN]: 'Page cannot be accessed.',
  [urlTypes.NOT_SURE]: "I don't know what this is."
};

//====================
// Computed Variables
//====================
const suggestionMap = computed<Record<UrlType, number>>(() => {
  return Object.fromEntries(
    props.suggestions.map((s) => [s.url_type, s.endorsement_count])
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
  };
}
</script>
