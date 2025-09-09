<template>
  <main ref="mainRef" class="min-h-[75%] relative">
    <!-- NAV to prev/next data request -->
    <PrevNextNav
      :request-ids="searchStore.mostRecentRequestIds"
      :previous-index="previousIdIndex"
      :next-index="nextIdIndex"
      :set-nav-is="(val) => (navIs = val)"
    />

    <transition mode="out-in" :name="navIs">
      <div
        v-if="dataRequestsPending"
        class="flex items-center justify-center h-[80vh] w-full flex-col relative"
      >
        <Spinner
          :show="dataRequestsPending"
          :size="64"
          text="Fetching data request..."
        />
      </div>

      <div
        v-else
        :key="route.params.id"
        class="flex flex-col sm:flex-row sm:flex-wrap mt-6 sm:items-stretch sm:justify-between gap-4 h-full w-full relative [&>*]:w-full"
      >
        <template v-if="!dataRequestsPending && error">
          <h1>An error occurred loading the data request</h1>
          <p>Please refresh the page and try again.</p>
        </template>

        <!-- TODO: not found UI - do we want to send the user to search or something? -->
        <template v-else-if="!error && !dataRequest">
          <h1>Data request not found</h1>
          <p>We don't have a record of that request.</p>
        </template>
        <!-- For each section, render details -->
        <template v-else>
          <!-- Heading and related material -->
          <hgroup>
            <h1>{{ dataRequest.title }}</h1>
            <div class="flex gap-2 items-center">
              <div v-if="dataRequest.record_types_required">
                <p
                  v-for="type of dataRequest.record_types_required"
                  :key="type.record_types_required"
                  class="pill w-max"
                >
                  <RecordTypeIcon :record-type="type" />
                  {{ type }}
                </p>
              </div>
            </div>
          </hgroup>

          <!-- Location data -->
          <h4>Locations covered by request</h4>
          <p v-for="location of dataRequest.locations" :key="location">
            {{ getMinimalLocationText(location) }}
          </p>

          <h4>Coverage Range</h4>
          <p>{{ dataRequest.coverage_range }}</p>

          <h4>Target date</h4>
          <p>{{ REQUEST_URGENCY[dataRequest.request_urgency] }}</p>

          <h4>Request notes</h4>
          <p class="break-words">{{ dataRequest.submission_notes }}</p>

          <h4>Data requirements</h4>
          <p class="break-words">{{ dataRequest.data_requirements }}</p>

          <a
            v-if="dataRequest.github_issue_url"
            :href="dataRequest.github_issue_url"
            class="pdap-button-primary mt-2 mb-4"
            target="_blank"
            rel="noreferrer"
            data-test="data-request-github-link"
          >
            Help out with this issue on GitHub
            <FontAwesomeIcon :icon="faLink" />
          </a>
        </template>
      </div>
    </transition>
  </main>
</template>

<script setup>
import { RecordTypeIcon, Spinner } from 'pdap-design-system';
import PrevNextNav from './_components/Nav.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { getDataRequest } from '@/api/data-requests';
import { useSearchStore } from '@/stores/search';
import { getMinimalLocationText } from '@/util/locationFormatters';
import { REQUEST_URGENCY } from './_constants';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSwipe } from '@vueuse/core';
import { useQuery } from '@tanstack/vue-query';
import { DATA_REQUEST } from '@/util/queryKeys';

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();
const reactiveParams = computed(() => ({
  id: route.params.id
}));
const queryKey = computed(() => [DATA_REQUEST, reactiveParams.value.id]);

const {
  isLoading: dataRequestsPending,
  data: dataRequest,
  error: dataSourceError
} = useQuery({
  queryKey,
  queryFn: async () => {
    const response = await getDataRequest(route.params.id);
    return response.data.data;
  },
  staleTime: 5 * 60 * 1000 // 5 minutes
});

const currentIdIndex = computed(() =>
  // Route params are strings, but the ids are stored as numbers, so cast first
  searchStore.mostRecentRequestIds.indexOf(Number(route.params.id))
);
const nextIdIndex = computed(() =>
  currentIdIndex.value < searchStore.mostRecentRequestIds.length - 1
    ? currentIdIndex.value + 1
    : null
);
const previousIdIndex = computed(() =>
  currentIdIndex.value > 0 ? currentIdIndex.value - 1 : null
);

const showExpandDescriptionButton = ref(false);
const descriptionRef = ref();
const mainRef = ref();
const navIs = ref('');
const error = computed(() =>
  dataSourceError.value?.message?.includes('not found')
    ? dataSourceError.value
    : null
);

// Handle swipe
const { direction } = useSwipe(mainRef, {
  onSwipe: () => {
    switch (direction.value) {
      case 'left':
        navIs.value = 'increment';
        if (typeof nextIdIndex.value === 'number' && nextIdIndex.value > -1)
          router.replace(
            `/data-request/${searchStore.mostRecentRequestIds[nextIdIndex.value]}`
          );
        break;
      case 'right':
        navIs.value = 'decrement';
        if (
          typeof previousIdIndex.value === 'number' &&
          previousIdIndex.value > -1
        )
          router.replace(
            `/data-request/${searchStore.mostRecentRequestIds[previousIdIndex.value]}`
          );
        break;
      default:
        return;
    }
  }
});

onMounted(() => {
  handleShowMoreButton();
  window.addEventListener('resize', handleShowMoreButton);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleShowMoreButton);
});

function handleShowMoreButton() {
  if (descriptionRef.value?.offsetHeight < descriptionRef.value?.scrollHeight) {
    showExpandDescriptionButton.value = true;
  } else {
    showExpandDescriptionButton.value = false;
  }
}
</script>

<style scoped>
.increment-enter-active,
.increment-leave-active,
.decrement-enter-active,
.decrement-leave-active {
  transition:
    opacity 150ms ease-in,
    transform 150ms ease-in;
}

.increment-enter-from,
.increment-leave-to,
.decrement-enter-from,
.decrement-leave-to {
  opacity: 0;
}

.increment-enter-from,
.decrement-leave-to {
  transform: translateX(15%);
}

.decrement-enter-from,
.increment-leave-to {
  transform: translateX(-15%);
}
</style>
