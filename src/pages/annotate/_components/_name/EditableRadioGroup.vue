<script setup>

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  // [{ id, text, editable }]
  options: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'update:options']);

// When user clicks a card
const select = (id) => {
  emit('update:modelValue', id);
};

// When user edits the text of an option
const onInput = (option, event) => {
  option.text = event.target.value;
  // emit updated options so parent can keep it in sync
  emit('update:options', props.options);
};

const isSelected = (id) => props.modelValue === id;
</script>
<template>
  <div class="space-y-2">
    <div
      v-for="option in options"
      :key="option.id"
      class="flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition hover:bg-purple-950"
      :class="isSelected(option.id) ? 'ring-2  bg-orange-500' : ''"
      @click="select(option.id)">
      <!-- Custom radio circle -->
      <span
        class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0">
        <span
          v-if="isSelected(option.id)"
          class="w-2 h-2 rounded-full bg-blue-500" />
      </span>

      <!-- Label OR editable input -->
      <input
        v-if="isSelected(option.id) && option.editable"
        class="flex-1 text-black bg-white outline-none border-b border-dashed"
        :value="option.text"
        @click.stop
        @input="onInput(option, $event)" />
      <span v-else class="flex-1">
        {{ option.text }}
      </span>
    </div>
  </div>
</template>



