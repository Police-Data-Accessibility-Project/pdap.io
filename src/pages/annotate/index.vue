<template>
  <main ref="mainRef" class="annotate-page">
    <Modal :model-value="showContentWarning" @close="handleCloseContentWarning">
      Pages provided for annotation have not been manually validated and may
      contain sensitive content.
    </Modal>

    <transition mode="out-in">
      <!-- Loading state -->
      <div v-if="annotationPending" class="annotate-loading">
        <Spinner
          :show="annotationPending"
          :size="64"
          text="Fetching annotation..."
        />
      </div>

      <div v-else class="w-full">
        <!-- Error state -->
        <template v-if="!annotationPending && error">
          <div class="annotate-error">
            <h1>An error occurred loading the annotation</h1>
            <p>Please refresh the page and try again.</p>
          </div>
        </template>

        <template v-if="localAnnotation?.next_annotation">
          <!-- Notices -->
          <div class="annotate-notices">
            <AnonWarning />
            <Reminder
              v-if="showCookieAgreement"
              @closed="handleCloseCookieReminder"
            >
              This page uses cookies.
            </Reminder>
          </div>

          <!-- Two-panel layout -->
          <div class="annotate-panels">
            <!-- Left: URL Preview -->
            <aside class="annotate-preview">
              <div class="annotate-preview-card">
                <!-- Mobile toggle bar (always visible on mobile) -->
                <button
                  class="preview-toggle"
                  @click="previewExpanded = !previewExpanded"
                >
                  <div class="preview-toggle-left">
                    <svg
                      class="w-4 h-4 shrink-0 text-wineneutral-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                      />
                    </svg>
                    <span class="preview-toggle-text">
                      {{ previewExpanded ? 'Hide preview' : 'Show preview' }}
                    </span>
                  </div>
                  <svg
                    class="preview-toggle-chevron"
                    :class="{ 'preview-toggle-chevron--open': previewExpanded }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>

                <!-- Expandable content (always visible on lg, toggle on mobile) -->
                <div class="preview-body" :class="{ 'preview-body--collapsed': !previewExpanded }">
                  <div class="preview-body-inner">
                    <div class="annotate-screenshot">
                      <ZoomableImage
                        v-if="imageOk"
                        :key="localAnnotation.next_annotation?.url_info.url_id"
                        :src="`${URL_BASE}/${localAnnotation.next_annotation?.url_info.url_id}/screenshot`"
                        alt="Screenshot of URL Page"
                        @error="imageOk = false"
                      />
                      <div v-else class="annotate-screenshot-fallback">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-8 h-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                          />
                        </svg>
                        <span>Image Not Found</span>
                      </div>
                    </div>

                    <div class="annotate-meta">
                      <Header
                        :refresh-key="globalResetKey"
                        :url-i-d="localAnnotation.next_annotation.url_info.url_id"
                        :page-title="
                          localAnnotation.next_annotation.html_info.title
                        "
                      />
                    </div>
                  </div>
                </div>

                <!-- URL always visible (outside collapsible body) -->
                <div class="annotate-url-info">
                  <a
                    :href="localAnnotation.next_annotation?.url_info.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="annotate-url-link"
                  >
                    {{ localAnnotation.next_annotation?.url_info.url }}
                  </a>
                </div>
              </div>
            </aside>

            <!-- Right: Annotation Wizard -->
            <section class="annotate-wizard">
              <TabsHeader
                :tabs="tabs"
                :current-index="currentGlobalIndex"
                :enabled-indices="permittedGlobalIndices"
                :answered-indices="answeredIndices"
                :skipped-indices="skippedIndices"
                @select="selectTab"
              />

              <div class="annotate-content">
                <keep-alive>
                  <div class="relative">
                    <keep-alive>
                      <URLTypeView
                        v-if="currentTab.id === 'url_type'"
                        v-model="selectedURLType"
                        :options="urlTypeOptions"
                        :suggestions="
                          localAnnotation.next_annotation.url_type_suggestions
                        "
                        @select="handleSelect"
                      />

                      <LocationView
                        v-else-if="currentTab.id === 'location'"
                        v-model="selectedLocation"
                        :suggestions="
                          localAnnotation.next_annotation.location_suggestions
                            .suggestions
                        "
                        @select="handleSelect"
                        v-model:resetKey="globalResetKey"
                      />
                      <AgencyView
                        v-else-if="currentTab.id === 'agency'"
                        v-model="selectedAgency"
                        :suggestions="
                          localAnnotation.next_annotation.agency_suggestions
                            .suggestions
                        "
                        @select="handleSelect"
                        v-model:resetKey="globalResetKey"
                      />
                      <RecordTypeView
                        v-else-if="currentTab.id === 'record_type'"
                        v-model="selectedRecordType"
                        :suggestions="
                          localAnnotation.next_annotation
                            .record_type_suggestions.suggestions
                        "
                        @select="handleSelect"
                        v-model:resetKey="globalResetKey"
                      />
                      <NameView
                        v-else-if="currentTab.id === 'name'"
                        v-model="selectedName"
                        :suggestions="
                          localAnnotation.next_annotation.name_suggestions
                            .suggestions
                        "
                      />
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

              <TabControls
                v-model="nextText"
                :current-index="currentGlobalIndex"
                :total="tabs.length"
                :is-next-disabled="isNextDisabled"
                @prev="prevTab"
                @next="nextTab"
              />
            </section>
          </div>

          <SupplementalInfo />
        </template>

        <template v-else>
          <div class="annotate-empty">
            <p>No annotations found.</p>
          </div>
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
import {
  setCookie,
  useAnonSessionStore,
  useRemindersStore
} from '@/util/cookies';
import SupplementalInfo from '@/pages/annotate/_components/_index/SupplementalInfo.vue';
import Reminder from '@/pages/annotate/_components/_index/Reminder.vue';
import Modal from '@/pages/annotate/_components/_index/Modal.vue';
import ZoomableImage from '@/pages/annotate/_components/_index/ZoomableImage.vue';
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

// Whether the mobile preview card is expanded
const previewExpanded = ref<boolean>(true);

// Variables tracking selections of annotation components.
const selectedURLType = ref<URLTypeSelection>(null);
const selectedLocation = ref<AgencyLocationSelection>(null);
const selectedAgency = ref<AgencyLocationSelection>(null);
const selectedRecordType = ref<RecordType>(null);
const selectedName = ref<NameSelection>(null);

const localAnnotation = ref<NextAnnotationResponse | null>(null);

const isThrottled = ref<boolean>(false);
const globalResetKey = ref<number>(0);

// Cookie-controlled Variables
const showContentWarning = ref<boolean>(true);
const showCookieAgreement = ref<boolean>(true);

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
// Setup
//====================
// Load cookie variables from cookies
const rem = useRemindersStore();
rem.hydrateSession();
showContentWarning.value = rem.contentWarning;
showCookieAgreement.value = rem.cookieAgreement;

//====================
// Computed Variables
//====================
// Tabs for the current path
const currentPathTabs = computed<Array<TabID>>(() => {
  const urlType = selectedURLType.value?.display_name;
  return urlType ? (validTabsByUrlType[urlType] ?? []) : [];
});

const permittedGlobalIndices = computed<number[]>(() => {
  return currentPathTabs.value
    .map((tabId) => tabIndexByValue[tabId])
    .filter((i): i is number => i !== undefined);
});
// Answered Indices: Non-null tabs
const answeredIndices = computed<number[]>(() => {
  let results: number[] = [];
  for (const index of Object.values(tabIndexByValue)) {
    const currentTabValue = tabValueByIndex[index];
    const currentTabVar = tabVarMapping[currentTabValue];
    if (currentTabVar?.value) {
      results.push(index);
    }
  }
  return results;
});

// Skipped Indices: Null tabs after the current index
const skippedIndices = computed<number[]>(() => {
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
    // Hydrate cookie and get session ID if exists
    const anonSession = useAnonSessionStore();
    anonSession.hydrateSession();
    const response = await getAnnotationURL(anonSession.sessionID);
    //Overwrite Session ID cookie
    setCookie(
      'sessionID',
      JSON.stringify({
        sessionID: response.session_id
      })
    );
    return response;
  }
});

watch(
  annotation,
  (newVal) => {
    localAnnotation.value = newVal ?? null;
  },
  { immediate: true }
);

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

function handleCloseContentWarning() {
  showContentWarning.value = false;
  updateReminderCookie();
}

function handleCloseCookieReminder() {
  showCookieAgreement.value = false;
  updateReminderCookie();
}

function updateReminderCookie() {
  setCookie(
    'reminders',
    JSON.stringify({
      cookieAgreement: showCookieAgreement.value,
      contentWarning: showContentWarning.value
    })
  );
}
</script>

<style scoped>
.annotate-page {
  @apply min-h-[75%] relative text-med w-full max-w-7xl mx-auto px-4 sm:px-6 py-6;
}

.annotate-loading {
  @apply flex items-center justify-center h-[80vh] w-full flex-col relative;
}

.annotate-error {
  @apply rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center;
}

.annotate-notices {
  @apply space-y-3 mb-6;
}

.annotate-panels {
  @apply grid grid-cols-1 lg:grid-cols-12 gap-6 items-start;
}

.annotate-preview {
  @apply lg:col-span-5 lg:sticky lg:top-4;
}

.annotate-preview-card {
  @apply rounded-xl border-2 border-wineneutral-200 bg-wineneutral-50 overflow-hidden;
}

/* Mobile preview toggle */
.preview-toggle {
  @apply flex lg:hidden items-center justify-between w-full px-4 py-3 bg-transparent border-none text-left cursor-pointer;
}

.preview-toggle-left {
  @apply flex items-center gap-2;
}

.preview-toggle-text {
  @apply text-xs font-semibold text-wineneutral-400 uppercase tracking-wider;
}

.preview-toggle-chevron {
  @apply w-4 h-4 text-wineneutral-400 transition-transform duration-200;
}

.preview-toggle-chevron--open {
  transform: rotate(180deg);
}

/* Collapsible preview body */
.preview-body {
  @apply grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.3s ease-in-out;
}

.preview-body--collapsed {
  grid-template-rows: 0fr;
}

@media (min-width: 1024px) {
  .preview-body--collapsed {
    grid-template-rows: 1fr;
  }
}

.preview-body-inner {
  overflow: hidden;
  min-height: 0;
}

.annotate-screenshot {
  @apply bg-wineneutral-100 flex items-center justify-center overflow-hidden;
  aspect-ratio: 4 / 3;
}

@media (min-width: 1024px) {
  .annotate-screenshot {
    aspect-ratio: unset;
    max-height: 520px;
  }
}

.annotate-screenshot-fallback {
  @apply flex flex-col items-center gap-2 text-wineneutral-400 text-sm;
}

.annotate-url-info {
  @apply p-4 border-t border-wineneutral-200;
}

.annotate-url-link {
  @apply text-sm text-brand-gold-500 hover:text-brand-gold-400 underline underline-offset-2 break-all leading-relaxed transition-colors;
}

.annotate-meta {
  @apply px-4 pb-4 border-t border-wineneutral-200 pt-3;
}

.annotate-wizard {
  @apply lg:col-span-7;
}

.annotate-content {
  @apply mt-4 rounded-xl border-2 border-wineneutral-200 bg-wineneutral-50 p-4 sm:p-6 min-h-[200px] lg:min-h-[320px];
}

.annotate-empty {
  @apply flex items-center justify-center h-[50vh] text-wineneutral-400 text-lg;
}
</style>
