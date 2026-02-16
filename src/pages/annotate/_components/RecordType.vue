<template>
  <div>
    <h3 class="rt-heading">Select a record type</h3>

    <!-- Suggestions -->
    <div v-if="radioOptions.length" class="rt-suggestions">
      <RadioForm
        v-model="selectedRadioRecordType"
        :options="radioOptions"
        header="Suggestions"
        @update:model-value="handleRadioFormSelect"
      />
    </div>

    <!-- All record types by category -->
    <div class="rt-categories">
      <fieldset
        v-for="(types, categoryName) in RECORD_TYPES_BY_CATEGORY"
        :key="categoryName"
        class="rt-category"
      >
        <legend class="rt-category-legend">
          {{ categoryName }}
        </legend>

        <div class="rt-options">
          <label
            v-for="type in types"
            :key="type"
            :for="type"
            class="rt-option"
            :class="{
              'rt-option--selected': selectedRecordTypeModel === type
            }"
          >
            <input
              :id="type"
              type="radio"
              name="record-type"
              :value="type"
              v-model="selectedRecordTypeModel"
              class="sr-only"
              @change="handleSelectChange"
            />
            <span class="rt-option-text">{{ type }}</span>
          </label>
        </div>
      </fieldset>
    </div>

    <p v-if="selectedRecordTypeModel" class="rt-selected">
      Selected: <strong>{{ selectedRecordTypeModel }}</strong>
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
import {
  AnnoLabels,
  RadioOption,
  RecordTypeSuggestionType
} from '@/pages/annotate/_components/_shared/types';
import { getEndorsementLabels } from '@/pages/annotate/_components/_shared/helpers';
import { InputRadio, RadioGroup } from 'pdap-design-system';

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
  (e: 'select', v: null): void;
}>();

//====================
//     Variables
//====================
const selectedRadioRecordType = ref(null);

//====================
// Computed Variables
//====================
const radioOptions = computed((): RadioOption[] => {
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
});

//====================
//      Handles
//====================
function handleSelectChange(selected) {
  selectedRadioRecordType.value = null;
  emit('select', null);
}

function handleRadioFormSelect(option: RadioOption) {
  selectedRecordTypeModel.value = option.value;
  emit('select', null);
}
</script>

<style scoped>
.rt-heading {
  @apply text-sm font-semibold text-wineneutral-600 uppercase tracking-wider mb-4;
}

.rt-suggestions {
  @apply mb-5 pb-5 border-b border-wineneutral-200;
}

.rt-categories {
  @apply space-y-4;
}

.rt-category {
  @apply rounded-lg border border-wineneutral-200 p-3;
}

.rt-category-legend {
  @apply px-2 text-sm font-bold text-wineneutral-700;
}

.rt-options {
  @apply mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5;
}

.rt-option {
  @apply flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm cursor-pointer transition-colors border border-transparent;
}

.rt-option:hover {
  @apply bg-wineneutral-100 border-wineneutral-200;
}

.rt-option--selected {
  @apply bg-amber-600 text-white border-amber-600 font-semibold;
}

.rt-option--selected:hover {
  @apply bg-amber-700 border-amber-700;
}

.rt-option-text {
  @apply leading-tight;
}

.rt-selected {
  @apply mt-4 text-sm text-wineneutral-600 bg-wineneutral-50 rounded-lg px-3 py-2 border border-wineneutral-200;
}
</style>
