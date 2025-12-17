<template>
  <main ref="mainRef" class="min-h-[75%] pdap-flex-container relative text-lg">
        <transition mode="out-in">
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


            <Header
              :refresh-key="globalResetKey"
              :url-i-d="localAnnotation.next_annotation.url_info.url_id"
              :page-title="localAnnotation.next_annotation.html_info.title"
            />
            <AnonWarning />
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
                :answered-indices="answeredIndices"
                :skipped-indices="skippedIndices"
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

    <div>
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-1 text-sm">
          <h3>Hints & Notes</h3>
          <h3 class="text-med">What makes a relevant Data Source?</h3>
          <p>Data can be found in unexpected places. The page may not say "data" anywhere on it. Check the list of Record Types below to see what we consider relevant.</p>
          <h3 class="text-med">What agencies are relevant?</h3>
          <p>We include courts and jails because they often contain information about police systems.</p>
          <h3 class="text-med">Individual Records</h3>
          <p>An incident report is an individual record; a list of incidents is a data source.</p>

        </div>
        <div class="col-span-1 text-sm">
          <h3>Record Types Reference</h3>
          <p>
            <a href="https://docs.pdap.io/activities/data-sources/data-dictionaries/record-types-taxonomy">
              Read more about record types in the taxonomy
            </a>
          </p>

          <h6>Police &amp; Public Interactions</h6>
          <ul>
            <li><strong>Accident Reports</strong>: Vehicle accident records, often for people to look up their reports.</li>
            <li><strong>Arrest Records</strong>: Records of arrests within a jurisdiction.</li>
            <li><strong>Calls for Service</strong>: Logs of officers responding to calls or initiating activity.</li>
            <li><strong>Car GPS</strong>: Location data for police vehicles (rarely public).</li>
            <li><strong>Citations</strong>: Low-level criminal offenses where citations were issued instead of arrests.</li>
            <li><strong>Dispatch Logs</strong>: Logs of calls/orders made by dispatchers.</li>
            <li><strong>Dispatch Recordings</strong>: Audio feeds or archives of dispatch channels.</li>
            <li><strong>Field Contacts</strong>: Reports of police-civilian interactions, including force or routine contacts.</li>
            <li><strong>Incident Reports</strong>: Reports written after responding to calls, criminal or not.</li>
            <li><strong>Misc Police Activity</strong>: Police activities not covered by other categories.</li>
            <li><strong>Officer Involved Shootings</strong>: Case files of shootings involving officers.</li>
            <li><strong>Stops</strong>: Records of pedestrian or traffic stops.</li>
            <li><strong>Surveys</strong>: Data collected from samples like inmates or judges.</li>
            <li><strong>Use of Force Reports</strong>: Records of force used against civilians.</li>
            <li><strong>Vehicle Pursuits</strong>: Records of police pursuits of fleeing vehicles.</li>
          </ul>

          <hr />

          <h6>Info About Officers</h6>
          <ul>
            <li><strong>Complaints &amp; Misconduct</strong>: Records/statistics on misconduct investigations.</li>
            <li><strong>Daily Activity Logs</strong>: Shift reports or timesheets created by officers.</li>
            <li><strong>Training &amp; Hiring Info</strong>: Information about officer training or hiring.</li>
            <li><strong>Personnel Records</strong>: Records on hiring, firing, discipline, or certification.</li>
          </ul>

          <hr />

          <h6>Info About Agencies</h6>
          <ul>
            <li><strong>Annual &amp; Monthly Reports</strong>: Summary documents about police activities.</li>
            <li><strong>Budgets &amp; Finances</strong>: Budgets, grants, and financial records.</li>
            <li><strong>Geographic</strong>: Maps or data on jurisdiction zones/sectors.</li>
            <li><strong>List of Data Sources</strong>: Collections of links to datasets or portals.</li>
            <li><strong>Policies &amp; Contracts</strong>: Policies or procedural contracts.</li>
          </ul>

          <hr />

          <h6>Agency-Published Resources</h6>
          <ul>
            <li><strong>Crime Maps &amp; Reports</strong>: Individual crimes shown in maps/tables.</li>
            <li><strong>Crime Statistics</strong>: Summarized crime statistics for jurisdictions.</li>
            <li><strong>Media Bulletins</strong>: Blotters, press releases, or alerts.</li>
            <li><strong>Records Request Info</strong>: Forms, portals, or policies for records requests.</li>
            <li><strong>Resources</strong>: Guidance on services, fees, or practices.</li>
            <li><strong>Sex Offender Registry</strong>: Indexes of registered sex offenders.</li>
            <li><strong>Wanted Persons</strong>: Lists of people with outstanding warrants.</li>
          </ul>

          <hr />

          <h6>Jails &amp; Courts Specific</h6>
          <ul>
            <li><strong>Booking Reports</strong>: Records of booking/intake into jails.</li>
            <li><strong>Court Cases</strong>: Dockets or other case-related records.</li>
            <li><strong>Incarceration Records</strong>: Current inmate rosters, often with release notifications.</li>
          </ul>
        </div>
      </div>


    </div>

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
import { TabID, tabIDs, tabs, validTabsByUrlType } from '@/pages/annotate/_components/_index/constants';
import TabControls from '@/pages/annotate/_components/_index/TabControls.vue';
import TabsHeader from '@/pages/annotate/_components/_index/TabsHeader.vue';
import {
  AgencyLocationSelection,
  NameSelection,
  NextAnnotationResponse,
  RecordType,
  UrlType,
  urlTypes,
  URLTypeSelection
} from '@/pages/annotate/_components/_shared/types';
import Header from '@/pages/annotate/_components/_header/Header.vue';
import AnonWarning from '@/pages/annotate/_components/_index/AnonWarning.vue';
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
const showAnonWarning = ref(true);

//====================
//     Constants
//====================
const URL_BASE = `${import.meta.env.VITE_SM_API_URL}/url`;


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
// Answered Indices: Non-null tabs
const answeredIndices = computed<number[]>( () => {
  let results: number[] = [];
  for (const index of Object.values(tabIndexByValue)) {
    const currentTabValue = tabValueByIndex[index];
    const currentTabVar = tabVarMapping[currentTabValue];
    if (currentTabVar?.value) {
      results.push(index);
    }
  }
  return results;
})

// Skipped Indices: Null tabs after the current index
const skippedIndices = computed<number[]>( () => {
  let results: number[] = [];
  for (const index of Object.values(tabIndexByValue)) {
    const currentTabValue = tabValueByIndex[index];
    // Pass any indices not yet passed
    if (index >= currentGlobalIndex.value) {
      continue;
    }
    // Pass any indices with values
    const currentTabVar = tabVarMapping[currentTabValue];
    if (currentTabVar?.value) {
      continue;
    }
    // Pass any indices that are not permitted
    if (!permittedGlobalIndices.value.includes(index)) {
      continue;
    }
    // Any indices remaining are skipped
    results.push(index);
  }
  return results;
})

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
