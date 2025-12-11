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

      <!--TODO: Look into if class should change-->
      <div
        v-else
        class="flex flex-col sm:flex-row sm:flex-wrap mt-6 sm:items-stretch sm:justify-between gap-4 h-full w-full relative [&>*]:w-full">
        <template v-if="!annotationPending && error">
          <h1>An error occurred loading the annotation</h1>
          <p>Please refresh the page and try again.</p>
        </template>

        <template v-else>
          <hgroup>
            <h1>{{ localAnnotation.next_annotation.url_info.url }}</h1>
          </hgroup>
          <img
            v-if="imageOk"
            alt="Screenshot of URL Page"
            :src="`${URL_BASE}/${localAnnotation.next_annotation.url_info.url_id}/screenshot`"
            @error="imageOk = false" />
          <div v-else>Image Not Found</div>

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
              @select="selectTab" />

            <!-- Tab content -->
            <keep-alive>
              <div class="mt-4 relative overflow-hidden">
                <keep-alive>
                  <URLTypeView
                    v-if="currentTab.id === 'url_type'"
                    v-model="selectedURLType"
                    :options="urlTypeOptions"
                    :suggestions="localAnnotation.next_annotation.url_type_suggestions" />
                  <LocationView
                    v-else-if="currentTab.id === 'location'"
                    v-model="selectedLocation"
                    :suggestions="
                      localAnnotation.next_annotation.location_suggestions.suggestions
                    " />
                  <AgencyView
                    v-else-if="currentTab.id === 'agency'"
                    v-model="selectedAgency"
                    :suggestions="localAnnotation.next_annotation.agency_suggestions.suggestions" />
                  <RecordTypeView
                    v-else-if="currentTab.id === 'record_type'"
                    v-model="selectedRecordType"
                    :suggestions="
                      localAnnotation.next_annotation.record_type_suggestions.suggestions
                    " />
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
                  />
                </keep-alive>
              </div>
            </keep-alive>
          </div>
        </template>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { getAnonymousAnnotationURL } from '@/api/annotate';
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
  AgencyLocationSelectionType, NameSelectionType,
  NextAnonymousAnnotationType, RecordType,
  urlTypes, URLTypeSelectionType,
  urlTypeType
} from '@/pages/annotate/_components/_shared/types';

// TODO: Check to see if this queryKey is appropriate
const queryKey = computed(() => [ANNOTATE]);
const URL_BASE = `${import.meta.env.VITE_SM_API_URL}/url`;

//====================
//     Variables
//====================
// Two indices exist:
// The global index, determining which of the six tabs is selected
const currentGlobalIndex = ref<number>(0);
// The path index, determining which tab *in the given path* is selected
// Path index refers to the index for the given URL Type path
const currentPathIndex = ref<number>(0);

// Whether the image successfully loaded.
const imageOk = ref<boolean>(false);

// Variables tracking selections of annotation components.
const selectedURLType = ref<URLTypeSelectionType>(null);
const selectedLocation = ref<AgencyLocationSelectionType>(null);
const selectedAgency = ref<AgencyLocationSelectionType>(null);
const selectedRecordType = ref<RecordType>(null);
const selectedName = ref<NameSelectionType>(null);


// Load annotation
const {
  isLoading: annotationPending,
  data: annotation,
  error
}: UseQueryResult<NextAnonymousAnnotationType> = useQuery({
  queryKey,
  queryFn: async (): Promise<NextAnonymousAnnotationType> => {
    return await getAnonymousAnnotationURL();
  }
});

const localAnnotation = ref<NextAnonymousAnnotationType | null>(null);

watch(annotation, (newVal) => {
  if (newVal) {
    localAnnotation.value = newVal;
  }
});

// TABS


const currentTab = computed(() => tabs[currentGlobalIndex.value]);

function selectTab(index: number) {
  currentGlobalIndex.value = index;
}


const isNextDisabled = computed((): boolean => {
  // Disabled if at end of tabs
  if (currentGlobalIndex.value === tabs.length - 1) {
    return true;
  }
  // Next is otherwise disabled if selected URL type is null
  return selectedURLType.value === null;
});

const tabIndexByValue: Record<TabID, number> = Object.fromEntries(
  Object.values(tabIDs).map((value, index) => [value, index])
) as Record<TabID, number>;
const tabValueByIndex: Record<number, TabID> = Object.fromEntries(
  Object.values(tabIDs).map((value, index) => [index, value])
) as Record<number, TabID>;

const nextTab = () => {
  // Get tab path for selected URL Type
  const pathTabs: Array<TabID> = validTabsByUrlType[selectedURLType.value];
  // Get next tab in path
  currentPathIndex.value++;
  const nextTabInPath: TabID = pathTabs[currentPathIndex.value];
  // Get global index value corresponding to that tab and set to currentGlobalIndex
  currentGlobalIndex.value = tabIndexByValue[nextTabInPath];
};

const prevTab = () => {
  // Get tab path for selected URL Type
  const pathTabs: Array<TabID> = validTabsByUrlType[selectedURLType.value];
  // Get previous tab in path
  currentPathIndex.value--;
  const prevTabInPath: TabID = pathTabs[currentPathIndex.value];
  // Get global index value corresponding to that tab and set to currentGlobalIndex
  currentGlobalIndex.value = tabIndexByValue[prevTabInPath];
};

// URL Type
const urlTypeOptions: Array<urlTypeType> = Object.values(urlTypes);



const tabVarMapping = {
  [tabIDs.URL_TYPE]: selectedURLType,
  [tabIDs.LOCATION]: selectedLocation,
  [tabIDs.AGENCY]: selectedAgency,
  [tabIDs.RECORD_TYPE]: selectedRecordType,
  [tabIDs.NAME]: selectedName
};

const nextText = computed<string>((): string => {
  const currentTabValue = tabValueByIndex[currentGlobalIndex.value];
  const currentTabVar = tabVarMapping[currentTabValue];
  if (currentTabVar?.value) {
    return 'Next';
  }
  return 'Skip';
});

async function submit(values) {}
</script>
