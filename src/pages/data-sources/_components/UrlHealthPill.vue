<template>
  <div v-if="status" class="flex flex-wrap gap-2 items-center">
    <span
      :class="['url-health-pill', status.tone]"
      :data-test="TEST_IDS.data_source_url_health"
      :title="status.tooltip"
    >
      <FontAwesomeIcon :icon="status.icon" />
      <span>{{ status.label }}</span>
    </span>
    <a
      v-if="status.key === 'archived' && archiveUrl"
      :href="archiveUrl"
      class="text-sm underline"
      target="_blank"
      rel="noreferrer"
      :data-test="TEST_IDS.data_source_url_archive"
    >
      View archived copy
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleCheck,
  faBoxArchive,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { TEST_IDS } from '../../../../e2e/fixtures/test-ids';

const props = defineProps({
  urlStatus: { type: String, default: null },
  archiveUrl: { type: String, default: null }
});

const status = computed(() => {
  const raw = props.urlStatus?.toLowerCase?.() ?? null;
  if (raw === 'ok') {
    return {
      key: 'ok',
      tone: 'tone-ok',
      icon: faCircleCheck,
      label: 'URL healthy',
      tooltip: 'This source URL was reachable the last time we checked.'
    };
  }
  if (raw === 'broken' && props.archiveUrl) {
    return {
      key: 'archived',
      tone: 'tone-archived',
      icon: faBoxArchive,
      label: 'Archived copy available',
      tooltip:
        'The source URL is currently unreachable, but an archived copy exists.'
    };
  }
  if (raw === 'broken') {
    return {
      key: 'broken',
      tone: 'tone-broken',
      icon: faTriangleExclamation,
      label: 'URL broken',
      tooltip: 'This source URL was not reachable the last time we checked.'
    };
  }
  return null;
});
</script>

<style scoped>
.url-health-pill {
  @apply inline-flex items-center gap-2 rounded-full px-3 py-1 border border-solid text-sm font-medium;
}
.tone-ok {
  @apply bg-green-100 border-green-300 text-green-900 dark:bg-green-900 dark:border-green-700 dark:text-green-100;
}
.tone-archived {
  @apply bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-100;
}
.tone-broken {
  @apply bg-red-100 border-red-300 text-red-900 dark:bg-red-900 dark:border-red-700 dark:text-red-100;
}
</style>
