<template>
  <div class="flex flex-col w-full mb-1">
    <div class="heading-titles">
      <h4
        v-for="title of HEADING_TITLES"
        :key="title + 'heading'"
        :class="getClassNameFromHeadingType(title)"
      >
        {{ title }}
      </h4>
    </div>

    <div ref="containerRef" class="w-full h-[80vh] relative overflow-y-scroll">
      <Spinner
        v-if="isLoading"
        :show="isLoading"
        :size="64"
        text="Fetching search results..."
      />
      <template v-else>
        <!-- eslint-disable vue/no-v-for-template-key -->
        <template
          v-for="locale in ALL_LOCATION_TYPES"
          :key="locale + 'results'"
        >
          <template v-if="results[locale] && 'count' in results[locale]">
            <div
              :id="'scroll-to-' + locale"
              aria-hidden="true"
              class="w-full"
            />
            <!-- Header by agency -->
            <template
              v-for="agency in Object.keys(results[locale].sourcesByAgency)"
              :key="agency + 'results'"
            >
              <div class="agency-heading-row">
                <h5 class="font-semibold">{{ agency }}</h5>
                <span class="pill">{{ locale }}</span>
              </div>

              <!-- Source within each agency -->
              <RouterLink
                v-for="source in results[locale].sourcesByAgency[agency]"
                :key="source.agency_name"
                :to="`/data-source/${source.id}`"
                :data-test="TEST_IDS.data_source_link"
                class="agency-row group"
              >
                <!-- Source name and record type -->
                <div :class="getClassNameFromHeadingType(HEADING_TITLES[0])">
                  <h6>
                    {{ source.data_source_name }}
                  </h6>
                  <span class="pill flex items-center mt-1 gap-2 w-max">
                    <RecordTypeIcon
                      :record-type="source.record_type"
                      class="text-brand-wine-500"
                    />
                    {{ source.record_type }}
                  </span>
                </div>

                <!-- Time range -->
                <p :class="getClassNameFromHeadingType(HEADING_TITLES[1])">
                  {{ getYearRange(source.coverage_start, source.coverage_end) }}
                </p>

                <!-- Description -->
                <p :class="getClassNameFromHeadingType(HEADING_TITLES[2])">
                  {{ source.description ?? '—' }}
                </p>

                <!-- Links to data source view and data source url -->
                <div class="links text-lg">
                  <span
                    class="hidden lg:inline top-1 text-brand-gold-600 group-hover:text-brand-gold-300"
                  >
                    <FontAwesomeIcon :icon="faInfoCircle" />
                    More
                  </span>
                  <a
                    :href="source.source_url"
                    target="_blank"
                    rel="noreferrer"
                    @keydown.stop.enter=""
                    @click.stop=""
                  >
                    <FontAwesomeIcon :icon="faLink" />
                    Visit
                  </a>
                </div>
              </RouterLink>
            </template>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ALL_LOCATION_TYPES } from '@/util/constants';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faInfoCircle, faLink } from '@fortawesome/free-solid-svg-icons';
import { RecordTypeIcon, Spinner } from 'pdap-design-system';
import { useRoute, useRouter } from 'vue-router';
import { ref, computed, watch, nextTick } from 'vue';
import { normalizeLocaleForHash } from '../_util';
import { TEST_IDS } from '../../../../e2e/fixtures/test-ids';

const route = useRoute();
const router = useRouter();

// constants
const HEADING_TITLES = [
  'name, record type',
  'time range',
  'description',
  'actions'
];

const props = defineProps({
  results: Object,
  isLoading: Boolean
});

const results = computed(() => props.results);
const isLoading = computed(() => props.isLoading);

const containerRef = ref();

// Handle scroll to on route hash change
function handleScrollTo() {
  if (!route.hash || !results.value || isLoading.value || !containerRef.value)
    return;

  nextTick(() => {
    const requestedLocale = route.hash.replace('#', '');
    const normalizedLocale = normalizeLocaleForHash(requestedLocale, {
      data: results.value
    });

    if (normalizedLocale && normalizedLocale !== requestedLocale) {
      // If the requested locale has no results, redirect to the normalized one
      router.replace({ ...route, hash: `#${normalizedLocale}` });
      return;
    }

    const targetId = 'scroll-to-' + requestedLocale;
    const element = document.getElementById(targetId);

    if (element) {
      const scrollToTop = element.offsetTop;
      containerRef.value.scrollTo({ top: scrollToTop, behavior: 'smooth' });
    }
  });
}

watch(
  () => [results.value, isLoading.value, route.hash, containerRef.value],
  handleScrollTo,
  { immediate: true }
);

// TODO: try to handle this with IntersectionObserver instead (i.e. set hash when div intersects, so hash remains up-to-date)
defineExpose({
  handleScrollTo
});

/**
 * @param start {string} date string
 * @param end {string | undefined} date string
 * @returns string formatted YYYY - YYYY
 */
function getYearRange(start, end) {
  const startYear = new Date(start).getFullYear();
  const endYear = (end ? new Date(end) : new Date()).getFullYear();

  return start ? `${startYear}–${endYear}` : '—';
}

function getClassNameFromHeadingType(heading) {
  if (heading === 'actions') return 'links';
  return heading.replaceAll(',', '').split(' ').join('-');
}
</script>

<style scoped>
@tailwind utilities;

/* TODO: decouple heading styling from heading level in design-system (or at least provide classes that can perform these overrides more efficiently) */
h4 {
  @apply m-0 block text-[.65rem] sm:text-med;
}

h5,
h6 {
  @apply text-lg not-italic tracking-normal normal-case m-0;
}

.heading-titles,
.agency-row {
  /* Tailwind is a pain for complex grids, so using standard CSS */
  grid-template-columns: 6fr 1fr 2fr 1fr;
  grid-template-areas: 'name range description links';
  grid-template-rows: repeat(2, auto);
}

.heading-titles {
  @apply w-full items-center grid gap-1 gap-y-3 pb-1 [&>*]:text-[.7rem] [&>*]:md:text-med [&>*]:lg:text-lg;
}

.agency-heading-row {
  @apply flex items-center sticky top-0 mb-2 gap-4 bg-wineneutral-100 p-2 text-xs md:text-med lg:text-lg border-solid border-wineneutral-300 border-2 z-10;
}

.agency-row {
  @apply grid gap-4 mb-2 p-2 h-auto border-solid border-goldneutral-300 border text-sm md:text-med lg:text-lg text-neutral-950 hover:bg-goldneutral-50;
}

.agency-row:focus,
.agency-row:focus-visible,
.agency-row:focus-within {
  @apply hover:brightness-85;
}

@media (width >= 768px) {
  .heading-titles,
  .agency-row {
    /* Tailwind is a pain for complex grids, so using standard CSS */
    grid-template-columns: 5fr 2fr 1fr 1fr;
    grid-template-areas: 'name range description links';
  }
}

@media (width >= 1024px) {
  .heading-titles,
  .agency-row {
    @apply gap-4;

    grid-template-columns: 320px 125px 1fr 115px;
    grid-template-rows: repeat(1, auto);
    grid-template-areas: 'name range description links';
  }
}

.agency-name-record-type {
  grid-area: name;
}

div.agency-name-record-type {
  @apply flex flex-col justify-start gap-2;
}

.agency-name-record-type h6 {
  @apply line-clamp-1;
}

.time-range {
  grid-area: range;
  @apply mb-0 sm:min-w-24;
}

.description {
  @apply hidden m-0;
}

@media (width >= 1024px) {
  .description {
    display: inline-block;
  }

  p.description {
    @apply line-clamp-3 leading-5 max-h-[3.75rem];
  }
}

h4.links {
  @apply hidden md:block;
}

div.links {
  @apply hidden md:flex md:flex-col items-end justify-start h-auto gap-1;

  grid-area: links;
}
</style>
