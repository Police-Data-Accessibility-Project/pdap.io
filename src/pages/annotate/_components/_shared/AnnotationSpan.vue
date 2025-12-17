<template>
  <span class="annotation-group">
    <span
      v-if="props?.labels?.user"
      class="annotation user font-semibold text-wineneutral-300"
    >
      {{ props.labels.user }}
      <FontAwesomeIcon :icon="faUser" />
    </span>

    <span
      v-if="props?.labels?.robo"
      class="annotation robo font-semibold text-wineneutral-300"
    >
      {{ props.labels.robo }}
      <FontAwesomeIcon :icon="faRobot" />
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
.annotation-group {
  display: inline-flex;
  gap: 0.5rem;
}
</style>
