<template>
  <div
    ref="containerRef"
    data-test="annotate-zoomable-image"
    class="relative overflow-hidden select-none"
    :class="{ 'cursor-zoom-in': hasPointer }"
    @mouseenter="hasPointer && (hovering = true)"
    @mouseleave="hovering = false"
    @mousemove="hasPointer && onMouseMove($event)"
    @click="openFullSize"
  >
    <img
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover object-top"
      @error="$emit('error')"
    />

    <!-- Magnifier lens (pointer devices only) -->
    <div
      v-if="hasPointer && hovering && loaded"
      class="absolute rounded-full pointer-events-none border-2 border-goldneutral-400/70 z-10"
      :style="[
        lensStyle,
        {
          boxShadow:
            '0 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.4)'
        }
      ]"
    />

    <!-- Hint overlay (pointer devices only) -->
    <div
      v-if="hasPointer && !hovering"
      class="absolute bottom-2 right-2 bg-black/50 text-white/80 px-2 py-1.5 flex items-center gap-1.5 text-xs pointer-events-none backdrop-blur-sm"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  src: string;
  alt?: string;
  zoomScale?: number;
}>();

defineEmits<{
  (e: 'error'): void;
}>();

const ZOOM = props.zoomScale ?? 2.5;
const LENS_SIZE = 160;

// Detect fine pointer (mouse) vs coarse (touch)
const hasPointer = ref(
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
);

const containerRef = ref<HTMLElement | null>(null);
const hovering = ref(false);
const loaded = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);

onMounted(() => {
  const img = containerRef.value?.querySelector('img');
  if (img) {
    if (img.complete) {
      loaded.value = true;
    } else {
      img.addEventListener('load', () => {
        loaded.value = true;
      });
    }
  }
});

function onMouseMove(e: MouseEvent) {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  mouseX.value = e.clientX - rect.left;
  mouseY.value = e.clientY - rect.top;
}

function openFullSize() {
  window.open(props.src, '_blank');
}

const lensStyle = computed(() => {
  if (!containerRef.value) return {};

  const el = containerRef.value;
  const img = el.querySelector('img');
  if (!img) return {};

  const containerW = el.offsetWidth;
  const containerH = el.offsetHeight;

  // Clamp lens position so it doesn't go outside the image
  const lensX = Math.max(
    0,
    Math.min(mouseX.value - LENS_SIZE / 2, containerW - LENS_SIZE)
  );
  const lensY = Math.max(
    0,
    Math.min(mouseY.value - LENS_SIZE / 2, containerH - LENS_SIZE)
  );

  // Background position: where in the zoomed image to show
  const bgX = (mouseX.value / containerW) * 100;
  const bgY = (mouseY.value / containerH) * 100;

  return {
    width: `${LENS_SIZE}px`,
    height: `${LENS_SIZE}px`,
    left: `${lensX}px`,
    top: `${lensY}px`,
    backgroundImage: `url(${props.src})`,
    backgroundSize: `${containerW * ZOOM}px ${containerH * ZOOM}px`,
    backgroundPosition: `${bgX}% ${bgY}%`
  };
});
</script>
