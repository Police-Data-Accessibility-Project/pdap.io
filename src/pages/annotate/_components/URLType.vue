<script setup>

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

function selectOption(option) {
  emit('update:modelValue', option);
}
</script>

<template>
  <div class="grid grid-cols-3 grid-rows-2 gap-4">
    <div
      v-for="option in props.options"
      :key="option"
      class="p-4 cursor-pointer rounded-lg border transition"
      :class="{
        'bg-blue-200 border-blue-500': props.modelValue === option,
        'bg-purple-900 border-transparent': props.modelValue !== option
      }"
      @click="selectOption(option)">
      <div
        class="rounded-lg p-4 text-white"
        :class="props.modelValue === option ? 'bg-blue-700' : 'bg-black'">
        {{ option }}
      </div>

      <div class="mt-2">{{ option }}</div>
    </div>
  </div>
</template>
