<template>
  <div v-if="requestPending">
    <Spinner
      :show="requestPending"
      :size="64"
      text="Fetching user contributions..."
    />
  </div>
  <div class="overflow-x-auto flex flex flex-wrap gap-4 text-med">
    <span v-if="userContributions">
      <strong>URLs Annotated:</strong>
      {{ userContributions.count_validated }}
    </span>
    <span>
      <strong> URL ID:</strong> {{ props.urlID }}
    </span>
    <span>
      <strong>Page Title:</strong> {{ props.pageTitle }}
    </span>
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

