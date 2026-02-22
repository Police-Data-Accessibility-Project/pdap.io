<template>
  <div class="flex flex-col gap-2 text-sm">
    <div v-if="requestPending" class="flex items-center gap-2">
      <Spinner :show="requestPending" :size="20" text="" />
      <span class="text-xs text-wineneutral-400">Loading stats...</span>
    </div>
    <template v-else>
      <div v-if="userContributions" class="flex items-center gap-2">
        <span class="text-xs font-semibold text-wineneutral-400 uppercase tracking-wider">Labeled</span>
        <span class="font-bold text-brand-wine-600">{{
          userContributions.count_validated
        }}</span>
      </div>
    </template>

    <div v-if="props.pageTitle" class="flex flex-col gap-0.5">
      <span class="text-xs font-semibold text-wineneutral-400 uppercase tracking-wider">Page</span>
      <span class="text-sm text-wineneutral-700 leading-snug line-clamp-2">{{ props.pageTitle }}</span>
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
