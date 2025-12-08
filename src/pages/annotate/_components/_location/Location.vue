<template>
  <div>
    <p>Location: {{ location?.display_name }}</p>
    <p>Location ID: {{ location?.location_id }}</p>
    <div class="grid grid-cols-1 gap-4">
      <div class="col-auto">
        <RadioForm :options="radioOptions" header="Suggestions" />
      </div>
    </div>
    <SearchForm v-model="location" @update:model-value="handleLocationSelect" />
  </div>
</template>

<script setup>
import SearchForm from '@/pages/annotate/_components/_location/SearchLocationForm.vue';
import RadioForm from '@/pages/annotate/_components/_shared/RadioForm.vue';
import {computed} from 'vue';
import {getEndorsementString} from "@/pages/annotate/_components/_shared/helpers";

const props = defineProps({
  suggestions: {
    type: Array,
    default: null
  }
});

const location = defineModel({ type: Number, default: null });
const emit = defineEmits(['update:modelValue']);

function handleLocationSelect(loc) {
  emit('update:modelValue', location);
}

const radioOptions = computed(() => {
  return props.suggestions.map((s) => ({
    value: s.id,
    label: getEndorsementString(s)
  }));
});

</script>

<style scoped></style>
