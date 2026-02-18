<!-- components/Modal.vue -->
<template>
  <!-- Teleport renders this at <body> level so it can't get trapped under parent stacking contexts -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        @keydown.esc="emitClose"
      >
        <!-- Dimmed backdrop -->
        <div class="modal-backdrop" @click="emitClose" />

        <!-- Modal panel -->
        <div class="modal-container">
          <div class="modal-panel" @click.stop>
            <header class="modal-header">
              <h2 class="modal-title">{{ title }}</h2>
              <button type="button" class="modal-close" @click="emitClose">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </header>

            <div class="modal-body">
              <slot />
            </div>

            <footer class="modal-footer">
              <slot name="footer">
                <button class="modal-btn" @click="emitClose">
                  I understand
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
  closeOnBackdrop?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

function emitClose() {
  emit('update:modelValue', false);
  emit('close');
}

// Prevent background scroll when modal is open
watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
  },
  { immediate: true }
);

// ESC key support
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) emitClose();
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 z-50;
}

.modal-backdrop {
  @apply absolute inset-0 bg-black/80 backdrop-blur-sm;
}

.modal-container {
  @apply absolute inset-0 flex items-center justify-center p-4;
}

.modal-panel {
  @apply w-full max-w-lg rounded-xl bg-wineneutral-950 shadow-2xl border border-wineneutral-800 overflow-hidden;
}

.modal-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-wineneutral-800;
}

.modal-title {
  @apply text-lg font-bold text-wineneutral-100;
}

.modal-close {
  @apply text-wineneutral-500 hover:text-wineneutral-200 transition-colors p-1 rounded-md hover:bg-wineneutral-800;
}

.modal-body {
  @apply px-6 py-5 text-sm text-wineneutral-300 leading-relaxed;
}

.modal-footer {
  @apply flex justify-end px-6 py-4 border-t border-wineneutral-800;
}

.modal-btn {
  @apply px-5 py-2.5 rounded-lg bg-brand-wine-600 text-white text-sm font-semibold transition-colors hover:bg-brand-wine-500;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
