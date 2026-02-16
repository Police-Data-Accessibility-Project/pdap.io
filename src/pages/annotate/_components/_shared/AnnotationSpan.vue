<template>
  <span class="anno-badges">
    <span v-if="props?.labels?.user" class="anno-badge anno-badge--user">
      {{ props.labels.user }}
      <FontAwesomeIcon :icon="faUser" class="w-3 h-3" />
    </span>

    <span v-if="props?.labels?.robo" class="anno-badge anno-badge--robo">
      {{ props.labels.robo }}
      <FontAwesomeIcon :icon="faRobot" class="w-3 h-3" />
    </span>
  </span>
</template>

<script setup lang="ts">
/**
 * Displays one or more annotation badges with icons.
 *
 * Both `user` and `robo` may be provided. When present, that
 * annotation is rendered with its corresponding icon.
 */

//====================
//Props, Models, Emits
//====================
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import { AnnoLabels } from '@/pages/annotate/_components/_shared/types';

type Props = {
  labels: AnnoLabels;
};

const props = defineProps<Props>();
</script>

<style scoped>
.anno-badges {
  @apply inline-flex gap-1.5;
}

.anno-badge {
  @apply inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full;
}

.anno-badge--user {
  @apply bg-wineneutral-100 text-wineneutral-600;
}

.anno-badge--robo {
  @apply bg-brand-gold-100 text-brand-gold-700;
}
</style>
