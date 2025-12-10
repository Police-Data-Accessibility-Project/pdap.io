<script setup>
import { reactive } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  // [{ id, text, preEditText}]
  options: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'update:options', 'selected']);

// id → { text, dirty }
const nameMapping = reactive(
  Object.fromEntries(
    props.options.map((item) => [
      item.id,
      {
        text: item.text, // Text of name
        dirty: false // Whether name was modified
      }
    ])
  )
);

function setDirty(id, value = undefined) {
  const entry = nameMapping[id];
  if (!entry) return;

  // If value is passed, use it; otherwise toggle
  entry.dirty = value ?? !entry.dirty;
}

function resetOption(option) {
  /*Reset option to its original text*/
  option.text = nameMapping[option.id].text;
  setDirty(option.id, false);
}

function choose(option) {
  /*
  Output Format:
    nameID: None | int
    name: str
    new: bool
 */
  const isNew = isDirty(option.id);

  emit('update:modelValue', {
    nameID: option.id,
    new: isNew,
    name: option.text
  });
}

// When user edits the text of an option
const onInput = (option, event) => {
  setDirty(option.id, true);
  option.text = event.target.value;
  // emit updated options so parent can keep it in sync
  choose(option);
};

const isSelected = (id) => props.modelValue?.nameID === id;
const isDirty = (id) => nameMapping[id].dirty;
</script>
<template>
  <div class="space-y-2">
    <div
      v-for="option in options"
      :key="option.id"
      class="flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition hover:bg-purple-950"
      :class="isSelected(option.id) ? 'ring-2  bg-orange-500' : ''"
      @click="choose(option)">
      <!-- Custom radio circle -->
      <span
        class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0">
        <span
          v-if="isSelected(option.id)"
          class="w-2 h-2 rounded-full bg-blue-500" />
      </span>

      <!-- Label OR editable input -->
      <span v-if="isSelected(option.id)">
        <input
          class="flex-1 text-black bg-white outline-none border-b border-dashed"
          :value="option.text"
          @click.stop
          @input="onInput(option, $event)" />
        <button @click="resetOption(option)">🔁</button>
      </span>

      <span v-else class="flex-1">
        <span>{{ option.text }}</span>
        <span v-if="!isDirty(option.id)">{{ ' ' + option?.preEditText }}</span>
      </span>
    </div>
  </div>
</template>
