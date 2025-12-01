<template>
  <div>
    <p>{{ selected }}</p>
    <EditableRadioGroup
      v-model="selected"
      :options="options"
      @update:model-value="handleRadioGroupUpdate" />
  </div>
</template>

<script setup>
import EditableRadioGroup from '@/pages/annotate/_components/_name/EditableRadioGroup.vue';
import { ref } from 'vue';

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

// TODO: Dynamically populate from annotation
const options = ref([
  { id: '1', text: 'Relevant Data Source', editable: true },
  { id: '2', text: 'Agency Homepage or Info', editable: true },
  { id: 'not_sure', text: 'Not Sure', editable: false }
]);

</script>

<style scoped></style>
