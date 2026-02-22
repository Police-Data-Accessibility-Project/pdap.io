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
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="emitClose" />

        <!-- Modal panel -->
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-lg bg-wineneutral-950 shadow-2xl border border-wineneutral-800 overflow-hidden" @click.stop>
            <header class="flex items-center justify-between px-6 py-4 border-b border-wineneutral-800">
              <h2 class="text-lg font-bold text-wineneutral-100">{{ title }}</h2>
              <button type="button" class="text-wineneutral-500 hover:text-wineneutral-200 transition-colors p-1 hover:bg-wineneutral-800" @click="emitClose">
                <FontAwesomeIcon :icon="faXmark" class="w-5 h-5" />
              </button>
            </header>

            <div class="px-6 py-5 text-sm text-wineneutral-300 leading-relaxed">
              <slot />
            </div>

            <footer class="flex justify-end px-6 py-4 border-t border-wineneutral-800">
              <slot name="footer">
                <button class="pdap-button-primary" @click="emitClose">
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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
