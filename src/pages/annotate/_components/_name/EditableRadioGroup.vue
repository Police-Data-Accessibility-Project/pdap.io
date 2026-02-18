<template>
  <div class="erg-list">
    <div
      v-for="option in options"
      :key="option.id"
      class="erg-item"
      :class="isSelected(option.id) ? 'erg-item--selected' : 'erg-item--default'"
      @click="choose(option)"
    >
      <!-- Radio circle -->
      <span class="erg-radio">
        <span v-if="isSelected(option.id)" class="erg-radio-dot" />
      </span>

      <!-- Label OR editable input -->
      <span v-if="isSelected(option.id)" class="erg-editable">
        <input
          class="erg-input"
          :value="option.text"
          @click.stop
          @input="handleInput(option, $event)"
        />
        <button class="erg-reset" @click.stop="resetOption(option)">
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
            />
          </svg>
        </button>
      </span>

      <span v-else class="erg-label">
        <span>{{ option.text }}</span>
        <AnnotationSpan
          v-if="!isDirty(option.id)"
          :labels="option.annoLabels"
        />
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
import {
  AnnoLabels,
  NameSelection
} from '@/pages/annotate/_components/_shared/types';
import AnnotationSpan from '@/pages/annotate/_components/_shared/AnnotationSpan.vue';

//======================
//       Types
//======================

type editableRadioOption = {
  id: string;
  text: string;
  annoLabels: AnnoLabels;
};

type nameEditState = {
  text: string; // Text of name
  dirty: boolean; // Whether name was modified
};

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
}>();

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

<style scoped>
.erg-list {
  @apply space-y-2;
}

.erg-item {
  @apply flex items-center gap-3 border-2 rounded-lg p-3 cursor-pointer transition-all duration-150;
}

.erg-item--default {
  @apply border-wineneutral-200 bg-wineneutral-50 hover:border-brand-wine-300 hover:bg-wineneutral-100;
}

.erg-item--selected {
  @apply border-brand-wine-400 bg-brand-wine-900/20;
}

.erg-radio {
  @apply w-5 h-5 rounded-full border-2 border-wineneutral-400 flex items-center justify-center shrink-0;
}

.erg-item--selected .erg-radio {
  @apply border-brand-wine-400;
}

.erg-radio-dot {
  @apply w-2.5 h-2.5 rounded-full bg-brand-wine-400;
}

.erg-editable {
  @apply flex-1 flex items-center gap-2;
}

.erg-input {
  @apply flex-1 text-sm bg-wineneutral-900 text-wineneutral-100 border border-wineneutral-600 rounded-md px-3 py-1.5 outline-none focus:border-brand-wine-400 focus:ring-1 focus:ring-brand-wine-400/30;
}

.erg-reset {
  @apply text-wineneutral-400 hover:text-wineneutral-200 transition-colors p-1;
}

.erg-label {
  @apply flex-1 flex items-center gap-2 text-sm;
}
</style>
