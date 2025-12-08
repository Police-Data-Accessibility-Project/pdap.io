<script setup>
import { urlTypes } from '@/pages/annotate/_components/_index/constants';
import { computed } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: null
  },
  suggestions: {
    type: Array,
    default: null
  }
});

const suggestionMap = computed(() => {
  return Object.fromEntries(
    props.suggestions.map((s) => [s.url_type, s.endorsement_count]) // or transform however you want
  );
});

function getEndorsementString(urlType) {
  const suggestionKey = urlTypeMapping[urlType];

  if (!(suggestionKey in suggestionMap.value)) {
    return '';
  }

  const endorsementCount = suggestionMap.value[suggestionKey];
  return '👥 ' + endorsementCount;
}

const emit = defineEmits(['update:modelValue']);

function selectOption(option) {
  emit('update:modelValue', option);
}

// Mapping to URL Types
const urlTypeMapping = {
  [urlTypes.DATA_SOURCE]: 'data source',
  [urlTypes.META_URL]: 'meta url',
  [urlTypes.NOT_RELEVANT]: 'not relevant',
  [urlTypes.INDIVIDUAL]: 'individual record',
  [urlTypes.BROKEN]: 'broken page'
};

const formattedOptions = computed(() =>
  props.options.map((opt) => ({
    value: opt,
    endorsementString: getEndorsementString(opt)
  }))
);
</script>

<template>
  <div class="grid grid-cols-3 grid-rows-2 gap-4">
    <div
      v-for="option in formattedOptions"
      :key="option.value"
      class="p-4 cursor-pointer rounded-lg border transition"
      :class="{
        'bg-blue-200 border-blue-500': props.modelValue === option.value,
        'bg-purple-900 border-transparent': props.modelValue !== option.value
      }"
      @click="selectOption(option.value)">
      <div
        class="rounded-lg p-4 text-white"
        :class="props.modelValue === option.value ? 'bg-blue-700' : 'bg-black'">
        {{ option.value }}
      </div>

      <div class="mt-2">{{ option.endorsementString }}</div>
    </div>
  </div>
</template>
