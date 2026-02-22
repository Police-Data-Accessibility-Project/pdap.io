<template>
  <div data-test="annotate-record-type">
    <h3 class="text-sm font-semibold text-wineneutral-800 uppercase tracking-wider mb-4">Select a record type</h3>

    <!-- Suggestions -->
    <div v-if="radioOptions.length" class="mb-5 pb-5 border-b border-wineneutral-200">
      <RadioForm
        v-model="selectedRadioRecordType"
        :options="radioOptions"
        header="Suggestions"
        @update:model-value="handleRadioFormSelect"
      />
    </div>

    <!-- All record types by category -->
    <div class="space-y-4">
      <fieldset
        v-for="(types, categoryName) in RECORD_TYPES_BY_CATEGORY"
        :key="categoryName"
        class="border border-wineneutral-200 p-3"
      >
        <legend class="px-2 text-sm font-bold text-wineneutral-700">
          {{ categoryName }}
        </legend>

        <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
          <label
            v-for="type in types"
            :key="type"
            :for="type"
            class="flex items-center gap-2 px-2.5 py-1.5 text-sm cursor-pointer transition-colors border border-transparent"
            :class="
              selectedRecordTypeModel === type
                ? 'bg-brand-wine-600 text-white border-brand-wine-600 font-semibold hover:bg-brand-wine-700 hover:border-brand-wine-700'
                : 'hover:bg-wineneutral-100 hover:border-wineneutral-200'
            "
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
            <span class="leading-tight">{{ type }}</span>
          </label>
        </div>
      </fieldset>
    </div>

    <p v-if="selectedRecordTypeModel" data-test="annotate-record-type-selected" class="mt-4 text-sm text-wineneutral-600 bg-wineneutral-50 px-3 py-2 border border-wineneutral-200">
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
