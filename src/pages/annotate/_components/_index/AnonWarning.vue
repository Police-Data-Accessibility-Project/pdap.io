<template>
  <div
    v-if="!auth.isAuthenticated() && showAnonWarning"
    class="relative border border-goldneutral-200 bg-goldneutral-50 p-3 text-sm"
  >
    <!-- Close button -->
    <button
      @click="showAnonWarning = false"
      class="absolute right-3 top-3 text-brand-gold-700 hover:text-brand-gold-900"
      aria-label="Dismiss warning"
    >
      ✕
    </button>
    <p class="max-w-none pr-4 mb-0">
      <strong>You are not signed in.</strong> You can label data anonymously, but your labels weigh 
      less than those made by signed-in users. 
      <a href="https://docs.pdap.io/activities/data-source-annotation">
        Learn more about consensus and data labeling here.</a>
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

