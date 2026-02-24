<template>
  <div
    v-if="!auth.isAuthenticated() && showAnonWarning"
    data-test="annotate-anon-warning"
    class="relative border p-4 pr-10 text-sm border-brand-wine-200 bg-brand-wine-50 text-brand-wine-900"
  >
    <button
      data-test="annotate-anon-warning-dismiss"
      @click="showAnonWarning = false"
      class="absolute right-3 top-3 text-brand-wine-400 hover:text-brand-wine-700 transition-colors"
      aria-label="Dismiss warning"
    >
      <FontAwesomeIcon :icon="faXmark" class="w-4 h-4" />
    </button>

    <p class="font-semibold">You are accessing this as an anonymous user.</p>

    <p class="mt-1 text-brand-wine-700">
      Anonymous users can make labels, but their labels weigh less than those
      made by signed-in users.
    </p>

    <p class="mt-1 text-brand-wine-700">
      <RouterLink
        to="/sign-in"
        class="font-semibold underline underline-offset-2 hover:text-brand-wine-900 transition-colors"
      >
        Sign in
      </RouterLink>
      or
      <RouterLink
        to="/sign-up"
        class="font-semibold underline underline-offset-2 hover:text-brand-wine-900 transition-colors"
      >
        sign up
      </RouterLink>
      for your labels to carry more weight.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const auth = useAuthStore();
const showAnonWarning = ref(true);
</script>
