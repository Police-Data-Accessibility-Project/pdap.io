<template>
  <div
    v-if="!auth.isAuthenticated() && showAnonWarning"
    class="relative border border-amber-300 bg-amber-50 p-4 text-amber-900 text-sm"
  >
    <!-- Close button -->
    <button
      @click="showAnonWarning = false"
      class="absolute right-3 top-3 text-amber-700 hover:text-amber-900"
      aria-label="Dismiss warning"
    >
      ✕
    </button>
    <p class="max-w-[90%] mb-0">
      <strong>You are not signed in.</strong> You can make annotations anonymously, but your annotations weigh 
      less than those made by signed-in users.
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

