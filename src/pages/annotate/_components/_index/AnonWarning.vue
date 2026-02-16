<template>
  <div
    v-if="!auth.isAuthenticated() && showAnonWarning"
    class="notice notice--info"
  >
    <button
      @click="showAnonWarning = false"
      class="notice-close"
      aria-label="Dismiss warning"
    >
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <p class="notice-title">You are accessing this as an anonymous user.</p>

    <p class="notice-body">
      Anonymous users can make annotations, but their annotations weigh less
      than those made by signed-in users.
    </p>

    <p class="notice-body">
      <RouterLink to="/sign-in" class="notice-link">Sign in</RouterLink>
      or
      <RouterLink to="/sign-up" class="notice-link">sign up</RouterLink>
      for your annotations to carry more weight.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const auth = useAuthStore();
const showAnonWarning = ref(true);
</script>

<style scoped>
.notice {
  @apply relative rounded-lg border p-4 pr-10 text-sm;
}

.notice--info {
  @apply border-brand-wine-200 bg-brand-wine-50 text-brand-wine-900;
}

.notice-close {
  @apply absolute right-3 top-3 text-brand-wine-400 hover:text-brand-wine-700 transition-colors;
}

.notice-title {
  @apply font-semibold;
}

.notice-body {
  @apply mt-1 text-brand-wine-700;
}

.notice-link {
  @apply font-semibold underline underline-offset-2 hover:text-brand-wine-900 transition-colors;
}
</style>
