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
import { NameSuggestionType } from '@/pages/annotate/_components/_shared/types';

// TODO: Get all existing name annotations
// TODO: Create map of names to ids

function handleRadioGroupUpdate(rg_id) {
  // TODO: Get name associated with rg_id from EditableRadioGroup
  // TODO: Check if name exists in existingNameMap
  // TODO: If yet, emit the number and name
  // TODO: If not, emit the name and a null number

  emit('update:modelValue', rg_id);
}

const emit = defineEmits(['update:modelValue']);

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

// TODO: Dynamically populate from annotation
const props = defineProps({
  suggestions: {
    type: Array as PropType<NameSuggestionType[] | null>,
    default: null
  }
});

const options = computed(() => {
  console.log(props.suggestions);
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
</script>

<style scoped></style>
