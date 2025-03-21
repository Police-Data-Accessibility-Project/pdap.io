<template>
  <main ref="mainRef" class="min-h-[75%] pdap-flex-container relative">
    <!-- NAV to prev/next data source -->
    <PrevNextNav
      :search-ids="searchStore.mostRecentSearchIds"
      :previous-index="previousIdIndex"
      :next-index="nextIdIndex"
      :set-nav-is="(val) => (navIs = val)"
      class="text-xl font-semibold" />

    <transition mode="out-in" :name="navIs">
      <div
        v-if="isLoading"
        class="flex items-center justify-center h-[80vh] w-full flex-col relative">
        <Spinner
          :show="isLoading"
          :size="64"
          text="Fetching data source results..." />
      </div>

      <div
        v-else
        :key="route.params.id"
        class="flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-stretch sm:justify-between gap-4 h-full w-full relative">
        <template v-if="!isLoading && error">
          <h1>An error occurred loading the data source</h1>
          <p>Please refresh the page and try again.</p>
        </template>

        <!-- TODO: not found UI - do we want to send the user to search or something? -->
        <template v-else-if="!error && !dataSource">
          <h1>Data source not found</h1>
          <p>We don't have a record of that source.</p>
        </template>
        <!-- For each section, render details -->
        <template v-else>
          <!-- Heading and related material -->
          <hgroup>
            <h1>{{ dataSource.name }}</h1>
            <div class="flex gap-2 items-center">
              <p v-if="dataSource.record_type_name" class="pill w-max">
                <RecordTypeIcon :record-type="dataSource.record_type_name" />
                {{ dataSource.record_type_name }}
              </p>
              <p
                v-for="jurisdiction_type in dataSource.unique_jurisdictions"
                :key="jurisdiction_type"
                class="pill">
                Jurisdiction: {{ jurisdiction_type }}
              </p>
              <template v-if="Array.isArray(dataSource.tags)">
                <p v-for="tag in dataSource.tags" :key="tag" class="pill w-max">
                  {{ tag }}
                </p>
              </template>
            </div>
            <!-- Description -->
            <div v-if="dataSource.description" class="relative w-full mt-4">
              <h4>Description</h4>
              <p
                ref="descriptionRef"
                class="description"
                :class="{
                  'truncate-2': !isDescriptionExpanded
                }">
                {{ dataSource.description }}
              </p>
              <Button
                v-if="showExpandDescriptionButton"
                intent="tertiary"
                @click="isDescriptionExpanded = !isDescriptionExpanded">
                {{ isDescriptionExpanded ? 'See less' : 'See more' }}
              </Button>
            </div>
          </hgroup>

          <!-- Agency data -->
          <div class="flex-[0_0_100%] flex flex-col w-full">
            <div
              ref="agenciesRef"
              class="w-full self-start justify-self-start mb-4 border border-neutral-300 rounded p-2">
              <table class="w-full border-collapse">
                <thead>
                  <tr>
                    <th class="text-left w-1/3"><h4>Agency</h4></th>
                    <th class="text-left w-1/3"><h4>County, State</h4></th>
                  </tr>
                </thead>
              </table>
              <div class="max-h-[250px] overflow-y-auto">
                <table class="w-full border-collapse">
                  <tbody>
                    <tr
                      v-for="agency in dataSource.agencies"
                      :key="agency.submitted_name"
                      class="">
                      <td class="p-2 w-1/3">{{ agency.submitted_name }}</td>
                      <td class="p-2 w-1/3">
                        {{
                          typeof agency.county_name === 'string'
                            ? agency.county_name
                            : agency.county_name?.join(', ')
                        }}, {{ agency.state_iso }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h4 class="m-0">Agency Type</h4>
                <p
                  v-for="agency_type in dataSource.unique_agency_type"
                  :key="agency_type"
                  class="capitalize">
                  {{ agency_type }}
                </p>
              </div>
            </div>
            <a
              :href="dataSource.source_url"
              class="pdap-button-primary py-3 px-4 h-max mr-4"
              target="_blank"
              rel="noreferrer">
              Visit Data Source
              <FontAwesomeIcon :icon="faLink" />
            </a>
          </div>

          <!-- Sections -->
          <div
            v-for="section in DATA_SOURCE_UI_SHAPE"
            :key="section.header"
            class="section">
            <h2>{{ section.header }}</h2>
            <div
              v-for="record in section.records"
              :key="record.title"
              class="flex flex-col">
              <!-- Only render if the key exists in the data source record -->
              <template v-if="dataSource[record.key]">
                <h4>{{ record.title }}</h4>

                <!-- If an array, render and nest inside of div -->
                <div
                  v-if="Array.isArray(dataSource[record.key])"
                  class="flex gap-2">
                  <component
                    :is="record.component ?? 'p'"
                    v-for="item in dataSource[record.key]"
                    :key="item"
                    :class="record.classNames">
                    {{ formatResult(record, item) }}
                  </component>
                </div>

                <!-- Otherwise, 1 component -->
                <component
                  :is="record.component ?? 'p'"
                  v-else
                  :href="
                    record.component === 'a'
                      ? dataSource[record.key]
                      : undefined
                  "
                  :class="record.classNames"
                  target="record.attributes.target"
                  rel="record.attributes.rel">
                  {{ formatResult(record, dataSource[record.key]) }}
                </component>
              </template>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </main>
</template>

<script setup>
import { Button, RecordTypeIcon, Spinner } from 'pdap-design-system';
import PrevNextNav from './_components/Nav.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { useSearchStore } from '@/stores/search';
import { DATA_SOURCE_UI_SHAPE } from './_util';
import { getDataSource } from '@/api/data-sources';
import { formatDateForSearchResults } from '@/util/dateFormatters';
import { isDescendantOf } from '@/util/DOM';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useRoute, useRouter } from 'vue-router';
import { useSwipe } from '@vueuse/core';
import { DATA_SOURCE } from '@/util/queryKeys';

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();

const reactiveParams = computed(() => ({
  id: route.params.id
}));
const queryKey = computed(() => [DATA_SOURCE, reactiveParams.value.id]);

const {
  isLoading: dataSourcePending,
  isFetching: dataSourceFetching,
  data: sourceData,
  error
} = useQuery({
  queryKey,
  queryFn: () => getDataSource(route.params.id),
  staleTime: 5 * 60 * 1000 // 5 minutes,
});

const dataSource = computed(() => {
  return sourceData.value.data.data;
});

const isLoading = computed(
  () => dataSourcePending.value || dataSourceFetching.value
);

const currentIdIndex = computed(() =>
  // Route params are strings, but the ids are stored as numbers, so cast first
  searchStore.mostRecentSearchIds.indexOf(Number(route.params.id))
);
const nextIdIndex = computed(() =>
  currentIdIndex.value < searchStore.mostRecentSearchIds.length - 1
    ? currentIdIndex.value + 1
    : null
);
const previousIdIndex = computed(() =>
  currentIdIndex.value > 0 ? currentIdIndex.value - 1 : null
);

const agenciesRef = ref();
const isDescriptionExpanded = ref(false);
const showExpandDescriptionButton = ref(false);
const descriptionRef = ref();
const mainRef = ref();
const navIs = ref('');

// Handle swipe
const { direction } = useSwipe(mainRef, {
  onSwipeEnd: (e) => {
    if (isDescendantOf(e.target, agenciesRef.value)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }

    switch (direction.value) {
      case 'left':
        navIs.value = 'increment';
        if (typeof nextIdIndex.value === 'number' && nextIdIndex.value > -1)
          router.replace(`/data-source/${getNext()}`);
        break;
      case 'right':
        navIs.value = 'decrement';
        if (
          typeof previousIdIndex.value === 'number' &&
          previousIdIndex.value > -1
        )
          router.replace(`/data-source/${getPrev()}`);
        break;
      default:
        return;
    }
  }
});
function getNext() {
  return searchStore.mostRecentSearchIds[nextIdIndex.value];
}
function getPrev() {
  return searchStore.mostRecentSearchIds[previousIdIndex.value];
}

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

function formatResult(record, item) {
  if (record.isDate) return formatDateForSearchResults(item);
  return item;
}
</script>

<style scoped>
.section {
  @apply w-full flex flex-col gap-2 max-w-full md:max-w-[50%] border-solid border-2 border-neutral-300 p-4 text-lg;
  flex: 1 1 40%;
}

hgroup {
  @apply mt-4 self-start;
  flex: 0 0 100%;
}

.description {
  @apply block max-w-full leading-6 max-h-full overflow-hidden;
  transition: max-height 0.3s ease;
}

.description.truncate-2 {
  @apply line-clamp-2 max-h-[calc(2*1.5rem+5px)] md:text-xl;
}

.pdap-button-tertiary {
  @apply text-brand-gold-600 p-1;
}

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
