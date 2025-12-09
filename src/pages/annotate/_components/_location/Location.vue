<template>
  <div>
    <p>Location: {{ location?.display_name }}</p>
    <p>Location ID: {{ location?.location_id }}</p>
    <div class="grid grid-cols-1 gap-4">
      <div class="col-auto">
        <RadioForm
          v-model="selectedType"
          :options="radioOptions"
          header="Suggestions"
          @update:model-value="handleRadioFormSelect" />
      </div>
    </div>
    <SearchForm
      v-model="location"
      @update:model-value="handleSearchLocationSelect" />
  </div>
</template>

<script setup>
import SearchForm from '@/pages/annotate/_components/_location/SearchLocationForm.vue';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';
import { computed, ref } from 'vue';
import { getEndorsementString } from '@/pages/annotate/_components/_shared/helpers';

const props = defineProps({
  suggestions: {
    type: Array,
    default: null
  }
});

const selectedType = ref('');

const resetSelection = () => {
  selectedType.value = null;
};

const location = defineModel({ type: Object, default: null });
const emit = defineEmits(['update:modelValue']);

function handleRadioFormSelect(option) {
  location.value = {
    location_id: option.value,
    display_name: option.display_name
  };
}

function handleSearchLocationSelect(loc) {
  emit('update:modelValue', loc);
  resetSelection();
}

const radioOptions = computed(() => {
  return props.suggestions.map((s) => ({
    value: s.id,
    display_name: s.display_name,
    label: getEndorsementString(s)
  }));
});
</script>

<style scoped></style>
