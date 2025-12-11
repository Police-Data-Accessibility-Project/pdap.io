<template>
  <div>
    <label class="block text-sm font-medium mb-1">Record type</label>

    <div class="grid grid-cols-1 gap-4">
      <p>Record Type: {{ selectedRecordType }}</p>
      <div class="col-auto">
        <RadioForm
          v-model="selectedRadioRecordType"
          :options="radioOptions"
          header="Suggestions"
          @update:model-value="handleRadioFormSelect" />
      </div>
    </div>

    <br />
    <!-- Select for Record Type -->
    <select
      v-model="selectedRecordType"
      class="border rounded px-2 py-1 w-full text-black"
      @change="handleSelectChange">
      <option disabled value="">Select a record type…</option>

      <!-- Loop over categories -->
      <optgroup
        v-for="(types, categoryName) in RECORD_TYPES_BY_CATEGORY"
        :key="categoryName"
        :label="categoryName">
        <!-- Loop over types within each category -->
        <option v-for="type in types" :key="type" :value="type">
          {{ type }}
        </option>
      </optgroup>
    </select>

    <p class="mt-2 text-sm text-gray-600">
      Selected: {{ selectedRecordType || 'none' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { RECORD_TYPES_BY_CATEGORY } from '@/pages/annotate/_components/_shared/constants';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';
import { RadioOptionType, RecordTypeSuggestionType } from '@/pages/annotate/_components/_shared/types';

//====================
//Props, Models, Emits
//====================

const props = defineProps({
  suggestions: {
    type: Array as PropType<RecordTypeSuggestionType[] | null>,
    default: null
  }
});

const selectedRecordType = defineModel({ type: String, default: null });


const selectedRadioRecordType = ref(null);


function handleSelectChange(selected) {
  selectedRadioRecordType.value = null;
}

function handleRadioFormSelect(option: RadioOptionType) {
  selectedRecordType.value = option.value;
}



function getRecordTypeEndorsementString(suggestion: RecordTypeSuggestionType): string {
  let base = suggestion.record_type;
  if (suggestion.user_count) {
    base += ' 👥 ' + suggestion.user_count;
  }
  if (suggestion.robo_confidence) {
    base += ' 🤖 ' + suggestion.robo_confidence + '%';
  }
  return base;
}

const radioOptions = computed((): RadioOptionType[] => {
  return props.suggestions.map((s) => ({
    value: s.record_type,
    display_name: s.record_type,
    label: getRecordTypeEndorsementString(s)
  }));
});
</script>

<style scoped></style>
