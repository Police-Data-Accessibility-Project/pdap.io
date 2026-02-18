<template>
  <div>
    <h3 class="urltype-heading">What type of page is this?</h3>
    <div class="urltype-grid">
      <button
        v-for="option in formattedOptions"
        :key="option.value"
        type="button"
        class="urltype-card"
        :class="
          props.modelValue?.display_name === option.value
            ? 'urltype-card--selected'
            : 'urltype-card--default'
        "
        @click="handleSelectOption(option.value)"
      >
        <div class="urltype-card-body">
          <span class="urltype-card-title">{{ option.value }}</span>
          <span class="urltype-card-desc">
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

<style scoped>
.urltype-heading {
  @apply text-sm font-semibold text-wineneutral-600 uppercase tracking-wider mb-4;
}

.urltype-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3;
}

.urltype-card {
  @apply text-left rounded-lg border-2 p-3 sm:p-4 transition-all duration-150 cursor-pointer w-full;
}

.urltype-card--default {
  @apply border-wineneutral-200 bg-wineneutral-50 hover:border-brand-wine-300 hover:bg-wineneutral-100;
}

.urltype-card--selected {
  @apply border-brand-gold-500 bg-brand-gold-600 text-white;
  box-shadow: 0 0 0 1px rgb(213 162 60);
}

.urltype-card-body {
  @apply flex flex-col gap-1;
}

.urltype-card-title {
  @apply font-bold text-sm;
}

.urltype-card-desc {
  @apply text-xs leading-relaxed;
}

.urltype-card--default .urltype-card-desc {
  @apply text-wineneutral-500;
}

.urltype-card--selected .urltype-card-desc {
  @apply text-white/80;
}
</style>
