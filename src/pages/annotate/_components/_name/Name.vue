<template>
  <div>
    <h3 class="view-heading">Name this data source</h3>

    <div v-if="selected?.name" class="view-current">
      <span class="view-current-label">Selected:</span>
      <strong>{{ selected.name }}</strong>
    </div>

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

<style scoped>
.view-heading {
  @apply text-sm font-semibold text-wineneutral-600 uppercase tracking-wider mb-4;
}

.view-current {
  @apply mb-4 text-sm bg-brand-wine-50 border border-brand-wine-200 rounded-lg px-3 py-2;
}

.view-current-label {
  @apply text-wineneutral-500 mr-1;
}
</style>
