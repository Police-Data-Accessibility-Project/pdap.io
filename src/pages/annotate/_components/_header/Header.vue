<template>
  <div class="header-info">
    <div v-if="requestPending" class="header-loading">
      <Spinner :show="requestPending" :size="20" text="" />
      <span class="text-xs text-wineneutral-400">Loading stats...</span>
    </div>
    <template v-else>
      <div v-if="userContributions" class="header-stat">
        <span class="header-stat-label">Annotated</span>
        <span class="header-stat-value">{{
          userContributions.count_validated
        }}</span>
      </div>
    </template>

    <div v-if="props.pageTitle" class="header-title">
      <span class="header-stat-label">Page</span>
      <span class="header-title-text">{{ props.pageTitle }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * User Contributions Component
 *
 * Handles logic for displaying contributions from a logged-in user.
 */
import { UserContributionGetResponse } from '@/pages/annotate/_components/_shared/types';
import { useQuery } from '@tanstack/vue-query';
import { getContributions } from '@/api/annotate';
import { Spinner } from 'pdap-design-system';
import { PropType } from 'vue';

//====================
//Props, Models, Emits
//====================
const props = defineProps({
  urlID: {
    type: Number as PropType<number | null>,
    default: null
  },
  pageTitle: {
    type: String as PropType<string | null>,
    default: null
  }
});

const refreshKey = defineModel<number>('refreshKey', { default: 0 });

//===================
//  Control Logic
//===================

const {
  data: userContributions,
  isLoading: requestPending,
  error
} = useQuery({
  queryKey: ['userContributions', refreshKey],
  queryFn: async (): Promise<UserContributionGetResponse> => {
    return await getContributions();
  }
});
</script>

<style scoped>
.header-info {
  @apply flex flex-col gap-2 text-sm;
}

.header-loading {
  @apply flex items-center gap-2;
}

.header-stat {
  @apply flex items-center gap-2;
}

.header-stat-label {
  @apply text-xs font-semibold text-wineneutral-400 uppercase tracking-wider;
}

.header-stat-value {
  @apply font-bold text-brand-wine-600;
}

.header-title {
  @apply flex flex-col gap-0.5;
}

.header-title-text {
  @apply text-sm text-wineneutral-700 leading-snug line-clamp-2;
}
</style>
