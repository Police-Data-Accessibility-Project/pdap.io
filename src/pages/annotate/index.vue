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
            <h1>{{ annotation.url_info.url }}</h1>
          </hgroup>
          <img
            v-if="imageOk"
            alt="Screenshot of URL Page"
            :src="`${URL_BASE}/${annotation.url_info.url_id}/screenshot`"
            @error="imageOk = false" />
          <div v-else>Image Not Found</div>

          <div class="w-full mx-auto">
            <TabControls
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

            <div class="mt-4 relative overflow-hidden">
              <div v-if="currentTab.id === 'url_type'">
                <URLTypeView
                  v-model="selectedURLType"
                  :options="urlTypeOptions"
                  :suggestions="annotation.url_type_suggestions" />
              </div>
              <div v-if="currentTab.id === 'location'">
                <LocationView
                  v-model="selectedLocationID"
                  :suggestions="annotation.location_suggestions.suggestions" />
              </div>
              <div v-if="currentTab.id === 'agency'">
                <AgencyView
                  v-model="selectedAgencyID"
                  :suggestions="annotation.agency_suggestions.suggestions" />
              </div>
              <div v-if="currentTab.id === 'record_type'">
                <RecordTypeView
                  v-model="selectedRecordType"
                  :suggestions="annotation.record_type_suggestions" />
              </div>
              <div v-if="currentTab.id === 'name'">
                <NameView
                  v-model="selectedName"
                  :suggestions="annotation.name_suggestions" />
              </div>
              <div v-if="currentTab.id === 'confirm'">
                <ConfirmView
                  :url-type="selectedURLType"
                  :location-i-d="selectedLocationID"
                  :agency-i-d="selectedAgencyID"
                  :record-type="selectedRecordType"
                  :name="selectedName" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </main>
</template>

<script setup>
import { getAnonymousAnnotationURL } from '@/api/annotate';
import { useQuery } from '@tanstack/vue-query';
import { ANNOTATE } from '@/util/queryKeys';
import { computed, ref } from 'vue';
import { Spinner } from 'pdap-design-system';
import URLTypeView from '@/pages/annotate/_components/URLType.vue';
import RecordTypeView from '@/pages/annotate/_components/RecordType.vue';
import AgencyView from '@/pages/annotate/_components/_agency/Agency.vue';
import LocationView from '@/pages/annotate/_components/_location/Location.vue';
import NameView from '@/pages/annotate/_components/_name/Name.vue';
import ConfirmView from '@/pages/annotate/_components/Confirm.vue';
import {
  tabIDs,
  tabs,
  urlTypes,
  validTabsByUrlType
} from '@/pages/annotate/_components/_index/constants';
import TabControls from '@/pages/annotate/_components/_index/TabControls.vue';
import TabsHeader from '@/pages/annotate/_components/_index/TabsHeader.vue';

// TODO: Check to see if this queryKey is appropriate
const queryKey = computed(() => [ANNOTATE]);
const URL_BASE = `${import.meta.env.VITE_SM_API_URL}/url`;

// Load annotation
const {
  isLoading: annotationPending,
  data: annotation,
  error
} = useQuery({
  queryKey,
  queryFn: async () => {
    const response = await getAnonymousAnnotationURL();
    return response.data.next_annotation;
  }
});

// TABS
// Two indices exist:
// The global index, determining which of the six tabs is selected
const currentGlobalIndex = ref(0);
// The path index, determining which tab *in the given path* is slected
const currentPathIndex = ref(0);

const currentTab = computed(() => tabs[currentGlobalIndex.value]);

function selectTab(index) {
  currentGlobalIndex.value = index;
}

// Path index refers to the index for the given URL Type path

const isNextDisabled = computed(() => {
  // Disabled if at end of tabs
  if (currentGlobalIndex.value === tabs.length - 1) {
    return true;
  }
  // Next is otherwise disabled if selected URL type is null
  return selectedURLType.value === null;
});

const tabIndexByValue = Object.fromEntries(
  Object.values(tabIDs).map((value, index) => [value, index])
);

// TODO: Add logic for converting "Next" button to "Skip"

const nextTab = () => {
  // Get tab path for selected URL Type
  const pathTabs = validTabsByUrlType[selectedURLType.value];
  // Get next tab in path
  currentPathIndex.value++;
  const nextTabInPath = pathTabs[currentPathIndex.value];
  // Get global index value corresponding to that tab and set to currentGlobalIndex
  currentGlobalIndex.value = tabIndexByValue[nextTabInPath];
};

const prevTab = () => {
  // Get tab path for selected URL Type
  const pathTabs = validTabsByUrlType[selectedURLType.value];
  // Get previous tab in path
  currentPathIndex.value--;
  const prevTabInPath = pathTabs[currentPathIndex.value];
  // Get global index value corresponding to that tab and set to currentGlobalIndex
  currentGlobalIndex.value = tabIndexByValue[prevTabInPath];
};

// URL Type
// TODO: Expand to include description for each
// TODO: Expand further to note which have Robo or Human Annotations
// TODO: Update so that tab values don't reset each time
const urlTypeOptions = Object.values(urlTypes);

const imageOk = ref(false);

const selectedURLType = ref(null);
const selectedLocationID = ref(null);
const selectedAgencyID = ref(null);
const selectedRecordType = ref(null);
const selectedName = ref(null);

// Location

function selectOption(option) {
  selectedURLType.value = option;
  console.log(option);
}
</script>
