<template>
  <main ref="mainRef" class="min-h-[75%] pdap-flex-container relative">
    <transition mode="out-in" :name="navIs">
      <div
        v-if="annotationPending"
        class="flex items-center justify-center h-[80vh] w-full flex-col relative">
        <Spinner
          :show="annotationPending"
          :size="64"
          text="Fetching annotation..." />
      </div>

      <div
        v-else
        class="flex flex-col sm:flex-row sm:flex-wrap mt-6 sm:items-stretch sm:justify-between gap-4 h-full w-full relative [&>*]:w-full">
        <template v-if="!annotationPending && error">
          <h1>An error occurred loading the annotation</h1>
          <p>Please refresh the page and try again.</p>
        </template>

        <template v-if="localAnnotation?.next_annotation">
          <img
            v-if="imageOk"
            alt="Screenshot of URL Page"
            :key="localAnnotation.next_annotation?.url_info.url_id"
            :src="`${URL_BASE}/${localAnnotation.next_annotation?.url_info.url_id}/screenshot`"
            @error="imageOk = false" />
          <div v-else>Image Not Found</div>
          <div>URL:
            <a
            :href="localAnnotation.next_annotation?.url_info.url"
            target="_blank"
            rel="noopener noreferrer">
            {{localAnnotation.next_annotation?.url_info.url}}
            </a>
          </div>

          <div class="w-full mx-auto">
            <TabControls
              v-model="nextText"
              :current-index="currentGlobalIndex"
              :total="tabs.length"
              :is-next-disabled="isNextDisabled"
              @prev="prevTab"
              @next="nextTab" />

            <TabsHeader
              :tabs="tabs"
              :current-index="currentGlobalIndex"
              :enabled-indices="permittedGlobalIndices"
              @select="selectTab"
            />

            <!-- Tab content -->
            <keep-alive>
              <div class="mt-4 relative overflow-hidden">
                <keep-alive>
                  <URLTypeView
                    v-if="currentTab.id === 'url_type'"
                    v-model="selectedURLType"
                    :options="urlTypeOptions"
                    :suggestions="localAnnotation.next_annotation.url_type_suggestions"
                    @select="handleSelect"
                  />

                  <LocationView
                    v-else-if="currentTab.id === 'location'"
                    v-model="selectedLocation"
                    :suggestions="
                      localAnnotation.next_annotation.location_suggestions.suggestions
                    "
                    @select="handleSelect"
                    v-model:resetKey="globalResetKey"
                  />
                  <AgencyView
                    v-else-if="currentTab.id === 'agency'"
                    v-model="selectedAgency"
                    :suggestions="localAnnotation.next_annotation.agency_suggestions.suggestions"
                    @select="handleSelect"
                    v-model:resetKey="globalResetKey"
                  />
                  <RecordTypeView
                    v-else-if="currentTab.id === 'record_type'"
                    v-model="selectedRecordType"
                    :suggestions="
                      localAnnotation.next_annotation.record_type_suggestions.suggestions
                    "
                    @select="handleSelect"
                    v-model:resetKey="globalResetKey"
                  />
                  <NameView
                    v-else-if="currentTab.id === 'name'"
                    v-model="selectedName"
                    :suggestions="localAnnotation.next_annotation.name_suggestions.suggestions" />
                  <ConfirmView
                    v-else-if="currentTab.id === 'confirm'"
                    :url-type="selectedURLType"
                    :location="selectedLocation"
                    :agency="selectedAgency"
                    :record-type="selectedRecordType"
                    :name="selectedName"
                    v-model="localAnnotation"
                    @submit="handleConfirmSubmit"
                  />
                </keep-alive>
              </div>
            </keep-alive>
          </div>
        </template>
        <template v-else>
          <div>No annotations found.</div>
        </template>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
/**
 * Annotation Index
 *
 * Main file for manaaging all annotation logic.
 *
 * Imports annotation sub-components
 * Incorporates into tab display
 * Controls tab management and cross-tab display logic.
 * Requests initial annotation.
 */
import { getAnnotationURL } from '@/api/annotate';
import { useQuery } from '@tanstack/vue-query';
import { ANNOTATE } from '@/util/queryKeys';
import { computed, ref, watch } from 'vue';
import { Spinner } from 'pdap-design-system';
import URLTypeView from '@/pages/annotate/_components/URLType.vue';
import RecordTypeView from '@/pages/annotate/_components/RecordType.vue';
import AgencyView from '@/pages/annotate/_components/_agency/Agency.vue';
import LocationView from '@/pages/annotate/_components/_location/Location.vue';
import NameView from '@/pages/annotate/_components/_name/Name.vue';
import ConfirmView from '@/pages/annotate/_components/Confirm.vue';
import {
  TabID,
  tabIDs,
  tabs,
  validTabsByUrlType
} from '@/pages/annotate/_components/_index/constants';
import TabControls from '@/pages/annotate/_components/_index/TabControls.vue';
import TabsHeader from '@/pages/annotate/_components/_index/TabsHeader.vue';
import {
  AgencyLocationSelection, NameSelection, NextAnnotationResponse,
  NextAnnotation, RecordType,
  urlTypes, URLTypeSelection,
  UrlType
} from '@/pages/annotate/_components/_shared/types';
import { useAuthStore } from '@/stores/auth';
//====================
//     Types
//====================
// URL Type
const urlTypeOptions: Array<UrlType> = Object.values(urlTypes);

//====================
//     Variables
//====================
// Path index refers to the index for the given URL Type path
const currentPathIndex = ref<number>(0);

// Whether the image successfully loaded.
const imageOk = ref<boolean>(true);

// Variables tracking selections of annotation components.
const selectedURLType = ref<URLTypeSelection>(null);
const selectedLocation = ref<AgencyLocationSelection>(null);
const selectedAgency = ref<AgencyLocationSelection>(null);
const selectedRecordType = ref<RecordType>(null);
const selectedName = ref<NameSelection>(null);

const localAnnotation = ref<NextAnnotationResponse | null>(null);

const isThrottled = ref<boolean>(false);
const globalResetKey = ref<number>(0);

//====================
//     Constants
//====================
const URL_BASE = `${import.meta.env.VITE_SM_API_URL}/url`;
const auth = useAuthStore();
console.log(auth.isAuthenticated());

const tabIndexByValue: Record<TabID, number> = Object.fromEntries(
  Object.values(tabIDs).map((value, index) => [value, index])
) as Record<TabID, number>;

const tabValueByIndex: Record<number, TabID> = Object.fromEntries(
  Object.values(tabIDs).map((value, index) => [index, value])
) as Record<number, TabID>;

const tabVarMapping = {
  [tabIDs.URL_TYPE]: selectedURLType,
  [tabIDs.LOCATION]: selectedLocation,
  [tabIDs.AGENCY]: selectedAgency,
  [tabIDs.RECORD_TYPE]: selectedRecordType,
  [tabIDs.NAME]: selectedName
};

const throttleMs = 250;

//====================
// Computed Variables
//====================
// Tabs for the current path
const currentPathTabs = computed<Array<TabID>>(() => {
  const urlType = selectedURLType.value?.display_name;
  return urlType ? validTabsByUrlType[urlType] ?? [] : [];
});

const permittedGlobalIndices = computed<number[]>(() => {
  return currentPathTabs.value
    .map(tabId => tabIndexByValue[tabId])
    .filter((i): i is number => i !== undefined);
});

// Global index as a computed projection of the current path position.
const currentGlobalIndex = computed<number>({
  get() {
    const pathTabs = currentPathTabs.value;
    if (pathTabs.length === 0) return 0;

    const tabId = pathTabs[currentPathIndex.value] ?? pathTabs[0];
    return tabIndexByValue[tabId] ?? 0;
  },
  set(globalIndex: number) {
    const pathTabs = currentPathTabs.value;
    if (pathTabs.length === 0) return;

    const tabId = tabValueByIndex[globalIndex] as TabID | undefined;
    if (!tabId) return;

    const idxInPath = pathTabs.indexOf(tabId);
    if (idxInPath === -1) return; // policy: ignore clicks outside the current path

    currentPathIndex.value = idxInPath;
  }
});

const currentTab = computed(() => tabs[currentGlobalIndex.value]);
// TODO: Check to see if this queryKey is appropriate
const queryKey = computed(() => [ANNOTATE]);

const isNextDisabled = computed((): boolean => {
  // Disabled if at end of tabs
  if (currentGlobalIndex.value === tabs.length - 1) {
    return true;
  }
  // Next is otherwise disabled if selected URL type is null
  return selectedURLType.value === null;
});

const nextText = computed<string>((): string => {
  const currentTabValue = tabValueByIndex[currentGlobalIndex.value];
  const currentTabVar = tabVarMapping[currentTabValue];
  if (currentTabVar?.value) {
    return 'Next';
  }
  return 'Skip';
});

//====================
// Request Logic
//====================

// Load annotation
const {
  isLoading: annotationPending,
  data: annotation,
  error
}: UseQueryResult<NextAnnotationResponse> = useQuery({
  queryKey,
  queryFn: async (): Promise<NextAnnotationResponse> => {
    return await getAnnotationURL();
  }
});

watch(annotation, (newVal) => {
  if (newVal) {
    localAnnotation.value = newVal;
  }
});

//====================
// Control Logic
//====================
watch(
  () => selectedURLType.value?.display_name,
  () => {
    const len = currentPathTabs.value.length;
    if (len === 0) {
      currentPathIndex.value = 0;
      return;
    }
    // clamp (or you could always reset to 0 if you prefer)
    currentPathIndex.value = Math.min(currentPathIndex.value, len - 1);
  },
  { immediate: true }
);

function selectTab(index: number) {
  // setter maps global index -> path index
  currentGlobalIndex.value = index;
}

const nextTab = () => {
  const len = currentPathTabs.value.length;
  if (len === 0) return;
  currentPathIndex.value = Math.min(currentPathIndex.value + 1, len - 1);
};

const prevTab = () => {
  const len = currentPathTabs.value.length;
  if (len === 0) return;
  currentPathIndex.value = Math.max(currentPathIndex.value - 1, 0);
};

const resetTab = () => {
  currentPathIndex.value = 0;
};

function resetAnnotationVariables() {
  selectedURLType.value = null;
  selectedLocation.value = null;
  selectedAgency.value = null;
  selectedRecordType.value = null;
  selectedName.value = null;
}

//====================
// Handlers
//====================
function handleConfirmSubmit() {
  resetAnnotationVariables();
  resetTab();
  globalResetKey.value++;
}

function handleSelect() {
  if (isThrottled.value) return;

  isThrottled.value = true;

  nextTab();

  setTimeout(() => {
    isThrottled.value = false;
  }, throttleMs);

}

</script>
