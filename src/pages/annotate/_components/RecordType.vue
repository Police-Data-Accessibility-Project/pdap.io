<template>
  <div>
    <label class="block text-sm font-medium mb-1">Record type</label>

    <div class="grid grid-cols-1 gap-4">
      <p>Record Type: {{ selectedRecordTypeModel }}</p>
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
      v-model="selectedRecordTypeModel"
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
      Selected: {{ selectedRecordTypeModel || 'none' }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * Record Type Annotation Component
 *
 * Handles logic for selecting Record Type annotation.
 * Allows user to select record type from user- or robo-provided suggestions.
 * OR to select a new record type entirely.
 */
import { computed, PropType, ref, watch } from 'vue';
import { RECORD_TYPES_BY_CATEGORY } from '@/pages/annotate/_components/_shared/constants';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';
import { AnnoLabels, RadioOptionType, RecordTypeSuggestionType } from '@/pages/annotate/_components/_shared/types';
import { getEndorsementLabels } from '@/pages/annotate/_components/_shared/helpers';

//====================
//Props, Models, Emits
//====================
const props = defineProps({
  suggestions: {
    type: Array as PropType<RecordTypeSuggestionType[] | null>,
    default: null
  }
});

const selectedRecordTypeModel = defineModel({ type: String, default: null });
const resetKey = defineModel<number>('resetKey', { default: 0 });

const emit = defineEmits<{
  (e: 'select', v: null): void
}>()

//====================
//     Variables
//====================
const selectedRadioRecordType = ref(null);

//====================
// Computed Variables
//====================
const radioOptions = computed((): RadioOptionType[] => {
  return props.suggestions.map((s) => ({
    value: s.record_type,
    display_name: s.record_type,
    label: s.record_type,
    anno_labels: getEndorsementLabels(s)
  }));
});

//===================
//  Control Logic
//===================
watch(resetKey, () => {
  selectedRadioRecordType.value = null;
})


//====================
//      Handles
//====================
function handleSelectChange(selected) {
  selectedRadioRecordType.value = null;
  emit('select', null);
}

function handleRadioFormSelect(option: RadioOptionType) {
  selectedRecordTypeModel.value = option.value;
  emit('select', null);
}

</script>

<style scoped></style>
