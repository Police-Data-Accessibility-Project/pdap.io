<!-- components/Modal.vue -->
<template>
  <!-- Teleport renders this at <body> level so it can't get trapped under parent stacking contexts -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        @keydown.esc="emitClose"
      >
        <!-- Dimmed backdrop -->
        <div class="absolute inset-0 bg-black/100" @click="emitClose" />

        <!-- Modal panel -->
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div
            class="w-full max-w-lg rounded-xl bg-brand-wine-900 shadow-xl"
            @click.stop
          >
            <header class="flex items-center justify-between border-b p-4">
              <h2 class="text-lg font-semibold">{{ title }}</h2>
              <button
                type="button"
                class="rounded px-2 py-1 hover:bg-gray-100"
                @click="emitClose"
              >
                ✕
              </button>
            </header>

            <div class="p-4">
              <slot />
            </div>

            <footer class="flex justify-end gap-2 border-t p-4">
              <slot name="footer">
                <button
                  class="rounded border px-3 py-2 hover:bg-gray-50"
                  @click="emitClose"
                >
                  Close
                </button>
              </slot>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  closeOnBackdrop?: boolean; // optional if you want to disable backdrop click
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

function emitClose() {
  emit('update:modelValue', false);
  emit('close');
}

// Optional: prevent background scroll when modal is open
watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
  },
  { immediate: true }
);

// Optional: ensure ESC works even if focus isn't inside
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) emitClose();
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>
