<template>
  <div>
    <p>{{ selected?.name }}</p>
    <EditableRadioGroup
      v-model="selected"
      :options="options"
      @update:model-value="handleRadioGroupUpdate"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Name Annotation Component
 *
 * Handles logic for selecting name annotations.
 * Allows user to select name from user- or robo-provided suggestions.
 * OR to add a new name.
 */
import EditableRadioGroup from '@/pages/annotate/_components/_name/EditableRadioGroup.vue';
import { computed, type PropType } from 'vue';
import {
  AnnoLabels,
  NameSelection,
  NameSuggestion
} from '@/pages/annotate/_components/_shared/types';
//====================
//Props, Models, Emits
//====================
const props = defineProps({
  suggestions: {
    type: Array as PropType<NameSuggestion[] | null>,
    default: null
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: NameSelection): void;
  (e: 'select', value: null): void;
}>();

//====================
// Computed Variables
//====================
const options = computed((): editableRadioOption[] => {
  return props.suggestions
    .map((s) => ({
      id: s.id,
      text: s.display_name,
      annoLabels: getNameEndorsementLabel(s)
    }))
    .concat([
      // Include an option for a new name as well
      {
        id: 'new',
        text: 'New Name',
        annoLabels: null
      }
    ]);
});

//================
//    Handlers
//================
function handleRadioGroupUpdate(rg: NameSelection) {
  emit('update:modelValue', rg);
}

//================
//    Helpers
//================
function getNameEndorsementLabel(suggestion: NameSuggestion): AnnoLabels {
  return {
    user: suggestion.user_count ? suggestion.user_count.toString() : null,
    robo: suggestion.robo_count ? suggestion.robo_count.toString() : null
  };
}
</script>

