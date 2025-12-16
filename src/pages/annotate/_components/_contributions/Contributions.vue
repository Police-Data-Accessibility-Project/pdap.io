
<template>
<div>
  <p>

  </p>
</div>
</template>

<script setup>
/**
 * User Contributions Component
 *
 * Handles logic for displaying contributions from a logged-in user.
 */
import { computed, type PropType, ref, watch } from 'vue';
import {UserContributionGetResponse} from "@/pages/annotate/_components/_shared/types";

//====================
//Props, Models, Emits
//====================
const refreshKey = defineModel<number>('refreshKey', { default: 0 });

//====================
//     Variables
//====================
const userContributions = ref<UserContributionGetResponse | null>(null)

//===================
//  Control Logic
//===================

const resetUserContributions = () => {

}

watch(refreshKey, () => {
  resetUserContributions();
})

//===================
//  Request Logic
//===================


</script>




<style scoped>

</style>