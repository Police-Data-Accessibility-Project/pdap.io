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
          @input="handleInput(option, $event)" />
        <button @click="resetOption(option)">🔁</button>
      </span>

      <span v-else class="flex-1">
        <span>{{ option.text + " " }}</span>
        <AnnotationSpan v-if="!isDirty(option.id)" :labels="option.annoLabels"/>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Editable Radio Annotation Component
 *
 * Provides radio options which can be selected and the name edited.
 * Also provides information on user and robo-annotations for each
 *  (non-edited) name.
 */
import { PropType, reactive, watch } from 'vue';
import { AnnoLabels, NameSelection } from '@/pages/annotate/_components/_shared/types';
import AnnotationSpan from '@/pages/annotate/_components/_shared/AnnotationSpan.vue';

//======================
//       Types
//======================

type editableRadioOption = {
  id: string;
  text: string;
  annoLabels: AnnoLabels;
}

type nameEditState = {
  text: string;  // Text of name
  dirty: boolean;  // Whether name was modified
}

//====================
//Props, Models, Emits
//====================
const props = defineProps({
  modelValue: {
    type: Object as PropType<NameSelection>,
    default: null
  },
  options: {
    type: Array as PropType<editableRadioOption[]>,
    required: true
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: NameSelection): void;
}>()

//====================
//     Variables
//====================
const nameMapping = reactive<Record<string, nameEditState>>(
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

//===================
//  Control Logic
//===================
function setDirty(id: number, value: boolean | undefined = undefined) {
  const entry = nameMapping[id];
  if (!entry) return;

  // If value is passed, use it; otherwise toggle
  entry.dirty = value ?? !entry.dirty;
}

function resetOption(option: editableRadioOption) {
  /*Reset option to its original text*/
  option.text = nameMapping[option.id].text;
  setDirty(option.id, false);
}

function choose(option: NameSelection) {
  const isNew: boolean = isDirty(option.id);
  emit('update:modelValue', {
    nameID: option.id,
    new: isNew,
    name: option.text
  });
}

// When prop options changes, reset the nameMapping.
watch(
  () => props.options,
  (options) => {
    for (const [id, state] of Object.entries(nameMapping)) {
      delete nameMapping[id]; // clear old keys
    }
    for (const item of options) {
      nameMapping[item.id] = {
        text: item.text,
        dirty: false
      };
    }
  },
  { immediate: true }
);

//===================
//     Handlers
//===================
// When user edits the text of an option
const handleInput = (option: editableRadioOption, event) => {
  setDirty(option.id, true);
  option.text = event.target.value;
  // emit updated options so parent can keep it in sync
  choose(option);
};


//====================
//     Helpers
//====================
const isSelected = (id): boolean => props.modelValue?.nameID === id;
const isDirty = (id): boolean => nameMapping[id].dirty;
</script>
