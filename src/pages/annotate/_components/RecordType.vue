<template>
  <div>
    <label class="block text-sm font-medium mb-1">Record type</label>

    <div class="grid grid-cols-1 gap-4">
      <!-- TODO: Add handleSelections here to modifed selected record type as well-->
      <div class="col-auto">
        <RadioForm :options="radioOptions" header="Suggestions" />
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

<script setup>
import { ref } from 'vue';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';

const selectedRecordType = ref(null);
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  suggestions: {
    type: Array,
    default: null
  }
});

function handleSelectChange(event) {
  emit('update:modelValue', selectedRecordType);
}

// TODO: Duplicate of data-request/create.vue. Extract?
const RECORD_TYPES_BY_CATEGORY = {
  'Police & Public Interactions': [
    'Accident Reports',
    'Arrest Records',
    'Calls for Service',
    'Car GPS',
    'Citations',
    'Dispatch Logs',
    'Dispatch Recordings',
    'Field Contacts',
    'Incident Reports',
    'Misc Police Activity',
    'Officer Involved Shootings',
    'Stops',
    'Surveys',
    'Use of Force Reports',
    'Vehicle Pursuits'
  ],
  'Info about officers': [
    'Complaints & Misconduct',
    'Daily Activity Logs',
    'Training & Hiring Info',
    'Personnel Records'
  ],
  'Info about agencies': [
    'Annual & Monthly Reports',
    'Budgets & Finances',
    'Contact Info & Agency Meta',
    'Geographic',
    'List of Data Sources',
    'Policies & Contracts'
  ],
  'Agency-published Resources': [
    'Crime Maps & Reports',
    'Crime Statistics',
    'Media Bulletins',
    'Records Request Info',
    'Resources',
    'Sex Offender Registry',
    'Wanted Persons'
  ],
  'Jails & courts': ['Booking Reports', 'Court Cases', 'Incarceration Records']
};

// TODO: Dynamically populate user options from annotation info
const radioOptions = ref([
  { value: 'Crime Maps & Reports', label: 'Crime Maps & Reports 👥 2 🤖 95%' },
  { value: 'Incident Reports', label: 'Incident Reports 👥 1' },
  { value: 'Car GPS', label: 'Car GPS 🤖 55%' }
]);


</script>

<style scoped></style>
