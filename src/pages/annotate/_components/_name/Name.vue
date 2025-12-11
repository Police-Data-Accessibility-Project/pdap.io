<template>
  <div>
    <p>{{ selected?.name }}</p>
    <EditableRadioGroup
      v-model="selected"
      :options="options"
      @update:model-value="handleRadioGroupUpdate" />
  </div>
</template>

<script setup lang="ts">
import EditableRadioGroup from '@/pages/annotate/_components/_name/EditableRadioGroup.vue';
import { computed, type PropType } from 'vue';
import { NameSelectionType, NameSuggestionType } from '@/pages/annotate/_components/_shared/types';

//====================
//Props, Models, Emits
//====================
const props = defineProps({
  suggestions: {
    type: Array as PropType<NameSuggestionType[] | null>,
    default: null
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: NameSelectionType): void;
}>()



//====================
// Computed Variables
//====================
const options = computed((): editableRadioOption[] => {
  return props.suggestions
    .map((s) => ({
      id: s.id,
      text: s.display_name,
      preEditText: getNameEndorsementString(s)
    }))
    .concat([
      // Include an option for a new name as well
      {
        id: 'new',
        text: 'New Name',
        preEditText: ''
      }
    ]);
});

//================
//    Handlers
//================
function handleRadioGroupUpdate(rg: NameSelectionType) {
  emit('update:modelValue', rg);
}

//================
//    Helpers
//================
function getNameEndorsementString(suggestion: NameSuggestionType): string {
  let base = '';
  if (suggestion.user_count) {
    base += ' 👥 ' + suggestion.user_count;
  }
  if (suggestion.robo_count) {
    base += ' 🤖 ' + suggestion.robo_count;
  }
  return base;
}


</script>

<style scoped></style>
