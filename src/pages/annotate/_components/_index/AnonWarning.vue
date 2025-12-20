<template>
  <div
    v-if="!auth.isAuthenticated() && showAnonWarning"
    class="relative rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900"
  >
    <!-- Close button -->
    <button
      @click="showAnonWarning = false"
      class="absolute right-3 top-3 text-amber-700 hover:text-amber-900"
      aria-label="Dismiss warning"
    >
      ✕
    </button>

    <p class="font-semibold">You are accessing this as an anonymous user.</p>

    <p class="mt-1 text-sm">
      Anonymous users can make annotations, but their annotations weigh less
      than those made by signed-in users.
    </p>

    <p class="mt-2 text-sm">
      Click
      <RouterLink
        to="/sign-in"
        class="font-medium underline hover:text-amber-800"
      >
        here
      </RouterLink>
      to sign in or
      <RouterLink
        to="/sign-up"
        class="font-medium underline hover:text-amber-800"
      >
        here
      </RouterLink>
      to sign up.
    </p>
  </div>
</template>
<script lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const auth = useAuthStore();

export default {
  setup() {
    const auth = useAuthStore();
    const showAnonWarning = ref(true);

    return {
      auth,
      showAnonWarning
    };
  }
};
</script>

