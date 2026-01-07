<route>
	{
		alias: ['/search', '/data'],
	}
</route>

<template>
  <main class="mb-24 grid grid-cols-3 max-w-5xl mx-auto @container w-full">
    <section class="col-span-full">
      <div
        class="text-med bg-wineneutral-100 p-4 mb-6 border-2 border-dotted border-wineneutral-300"
      >
        <strong>Announcement:</strong>
        We are open for public signups!
        <router-link :to="'/sign-up'">Create a free account here.</router-link>
      </div>
    </section>
    <section class="col-span-full">
      <h1>Explore data about police systems</h1>
    </section>
    <section
      class="px-2 md:px-4 col-span-full relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] w-[calc(100vw-0.5rem)]"
    >
      <div class="block">
        <DataSourceMap
          class="mb-6 w-full md:border-[1px] md:border-wineneutral-400 p-1"
          v-bind="{
            ...(mapData?.data.locations ?? {}),
            federal: mapData?.data.sources ?? []
          }"
          :use-dynamic-breakpoints="true"
          @on-follow="(location_id) => followMutation.mutate(location_id)"
          @on-select-location="
            (payload) =>
              search.setActiveLocation(payload?.data ?? payload ?? null)
          "
        />
      </div>
    </section>
    <section class="col-span-full">
      <h2 class="hidden md:block">Search for something specific</h2>
      <SearchForm />
    </section>
    <section class="col-span-full text-lg">
      <h2>About the data</h2>
      <p>
        Each
        <a
          href="https://docs.pdap.io/about/terms-and-definitions/what-is-a-data-source"
        >
          "Data Source"
        </a>
        is a place on the internet where public records can be found about a
        police system. Our database is community-maintained, with help from our
        open-source apps. To help add to the database,
        <a href="https://docs.pdap.io/">start with the docs!</a>
      </p>
      <p v-if="metricsData">
        Our database contains
        <strong>{{ metricsData.sourceCount }} Sources</strong>
        about
        <br />
        <strong>{{ metricsData.agencyCount }} agencies</strong>
        in
        <strong>{{ metricsData.countyCount }} counties</strong>
        across
        <strong>all 50 states</strong>
        and the District of Columbia, plus aggregated sources covering many
        agencies at once. They are published by both government agencies and
        independent organizations.
      </p>
      <p v-else>
        Our database contains Sources about agencies in hundreds of counties
        across all 50 states and the District of Columbia, plus aggregated
        sources covering many agencies at once. They are published by both
        government agencies and independent organizations.
      </p>
      <div v-if="formattedSources" class="grid grid-cols-3 mt-6 gap-4">
        <h3 class="col-span-3">Recently added Data Sources</h3>
        <div
          v-for="source in formattedSources"
          :key="source.id"
          class="col-span-full md:col-span-1 flex-column outline outline-2 outline-goldneutral-200 px-4 py-2"
        >
          <p>
            <strong>{{ source.name }}&nbsp;</strong>
            <a
              :href="source.sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon :icon="faExternalLink" />
            </a>
          </p>
          <p>
            Added {{ source.formattedCreatedAt }}
            <router-link :to="source.route">
              <FontAwesomeIcon :icon="faInfoCircle" />
            </router-link>
          </p>
        </div>
      </div>
    </section>
    <section
      class="pdap-grid-container col-span-full pt-6 mt-8 border-t-[3px] border-wineneutral-100"
    >
      <h1 class="col-span-full pt-8 mb-0">Programs</h1>
      <div
        class="col-span-full md:col-span-1 flex-column content-end justify-stretch"
      >
        <img
          src="/assets/mapping.svg"
          class="w-3/12 place-self-center md:block md:w-10/12"
          alt="A map scattered with icons representing different kinds of data."
        />
        <p class="font-semibold lg:text-center">
          Finding and cataloguing sources of data
        </p>
      </div>
      <div class="col-span-full md:col-span-1 flex-column content-end">
        <img
          src="/assets/searching.svg"
          class="w-3/12 place-self-center md:block md:pb-6 md:w-11/12"
          alt="An eye looking through a magnifying glass at a police website."
        />
        <p class="font-semibold lg:text-center">
          Project-based scraping and records requests
        </p>
      </div>
      <div class="col-span-full md:col-span-1 flex-column content-end">
        <img
          src="/assets/sharing.svg"
          class="w-3/12 place-self-center md:block md:w-9/12"
          alt="A piece of police data being distributed to several people."
        />
        <p class="font-semibold lg:text-center">
          Connecting people to data and each other
        </p>
      </div>
      <div class="col-span-full text-lg">
        <p>
          The problem we address is the inaccessibility of data about the
          systems with the
          <strong>greatest impact on our lives.</strong>
          Records which should be public are often disorganized, scattered
          across obscure municipal websites, kept behind tedious request
          processes, or not published at all.
        </p>
        <p>
          <strong>We envision a future</strong>
          where every community in the United States can access public data to
          evaluate local police systems and other crisis response programs.
        </p>
        <p>
          All of our programs exist to help people answer questions big and
          small about one of our most impactful local systems. Accessible data
          is the first step.
          <strong>If you are starting a data project, we can help.</strong>
        </p>
        <router-link
          class="pdap-button-primary mt-4"
          :to="'/data-requests/create'"
        >
          Open a Data Request
        </router-link>
        <router-link
          class="pdap-button-secondary sm:ml-4 mt-4"
          :to="'/sign-up'"
        >
          Sign up for an account
        </router-link>
      </div>
    </section>
    <section
      class="col-span-full pdap-flex-container pt-6 mt-8 border-t-[3px] border-wineneutral-100"
    >
      <h1>Take action</h1>
      <p>
        This work is multidisciplinary and beginner-friendly. No matter what
        your level of experience, you can be a valuable contributor! The most
        important skill is
        <strong>persistence.</strong>
      </p>
      <p>
        Our documentation at
        <strong>
          <a href="https://docs.pdap.io">docs.pdap.io</a>
          is the starting point
        </strong>
        for using our tools to volunteer and use data.
      </p>
      <h2>
        <FontAwesomeIcon
          :icon="faMagnifyingGlassLocation"
          class="text-brand-wine-300"
        />
        Locate sources
      </h2>
      <p>
        Some public records are already online, waiting to be indexed and used.
        Adding them to our database makes them more accessible to everyone.
      </p>
      <div class="flex-row">
        <a
          class="mt-2 pdap-button-primary"
          href="https://airtable.com/appcYa6x4nS7W8IR3/shrk9c5sBsBr3cdJJ"
          target="blank"
        >
          Help add Data Sources to our database
        </a>
        <router-link
          class="pdap-button-secondary mt-2 ml-2"
          :to="'/data-sources/create'"
        >
          Submit a source you found
        </router-link>
      </div>
      <h2 class="pt-8">
        <FontAwesomeIcon :icon="faPeopleCarryBox" class="text-brand-wine-300" />
        Collaborate on data projects
      </h2>
      <p>
        Some research projects could benefit from help with data analysis, web
        scraping, or records requests. PDAP is a place for collaborators to find
        each other.
      </p>
      <!-- can be un-commented when we close data-sources-app/issues/580
      <p>
        To see open requests for a particular area, search for a location above.
      </p>
      -->
      <div v-if="requestsLoaded">
        <h3 class="mt-2">Open data requests</h3>
        <ul>
          <li v-for="request in recentRequests" :key="request.id">
            <strong>{{ request.title }}</strong>
            Location: {{ request.locationDisplayName }}
            <router-link :to="request.route">
              Details
              <FontAwesomeIcon :icon="faExternalLink" />
            </router-link>
          </li>
        </ul>
      </div>
      <a
        class="pdap-button-primary mt-2"
        href="https://airtable.com/appcYa6x4nS7W8IR3/shrk9c5sBsBr3cdJJ"
        target="blank"
      >
        Volunteer for data requests
      </a>
      <h2 class="pt-4 col-span-full">
        <FontAwesomeIcon
          :icon="faCodePullRequest"
          class="text-brand-wine-300"
        />
        Contribute code
      </h2>
      <p class="col-span-full">
        Everything you see is open source, built by a small team of volunteers
        and staff. We use Python for most backend and web scraping, and VueJS
        for front end.
      </p>
      <div
        v-if="!githubDataLoading && githubData?.goodFirstIssues.length"
        class="grid grid-cols-3 mt-6 gap-4 text-lg"
      >
        <h3 class="col-span-3">Good first issues</h3>
        <div
          v-for="(issue, index) in githubData.goodFirstIssues"
          :key="index"
          class="col-span-full md:col-span-1 flex-column outline outline-2 outline-goldneutral-200 px-4 py-2"
        >
          <p>
            <strong>{{ issue.title }}&nbsp;</strong>
            <a :href="issue.url" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon :icon="faExternalLink" />
            </a>
          </p>
        </div>
        <a
          class="pdap-button-primary mt-2 col-span-full"
          href="https://github.com/orgs/Police-Data-Accessibility-Project/projects/25/views/1"
          target="blank"
        >
          View more Good First Issues
        </a>
      </div>
    </section>
    <section
      class="pdap-flex-container col-span-full text-lg pt-6 mt-8 border-t-[3px] border-wineneutral-100"
    >
      <h1>Praise for our work</h1>
      <div class="p-4 my-2 mx-0 border-2 border-solid border-goldneutral-200">
        <p>
          “PDAP's work was invaluable in helping us find and access data we
          wouldn't have been able to otherwise.”
        </p>
        <p class="italic mb-0">
          &mdash;Dr. Jesse Wozniak, Director of Law & Public Policy at the
          <a href="https://apa-pgh.org/">Alliance for Police Accountability</a>
        </p>
      </div>
      <div class="p-4 my-2 mx-0 border-2 border-solid border-goldneutral-200">
        <p>
          “PDAP's feedback helped us revise our published data to be more
          beneficial to the public.”
        </p>
        <p class="italic mb-0">
          &mdash;Philip Lukens, Chief of Police in
          <a href="https://www.cityofalliance.net/186/Police">Alliance, NE</a>
        </p>
      </div>
      <div class="p-4 my-2 mx-0 border-2 border-solid border-goldneutral-200">
        <p>
          “PDAP provides data necessary to understand how police use-of-force
          incidents are processed in the courts, which reveals whether legal
          accountability mechanisms actually work on-the-ground.”
        </p>
        <p class="italic mb-0">
          &mdash;
          <a href="https://www.kylabourne.net/">Dr. Kyla Bourne</a>
          at UC Berkeley
        </p>
      </div>
    </section>
    <section
      class="col-span-full pdap-grid-container grid-cols-2 pt-6 mt-8 border-t-[3px] border-wineneutral-100"
    >
      <div class="col-span-full">
        <h1>How our data is used</h1>
        <p>
          Our goal is to make independent research, journalism, and analysis
          possible by helping people find the data they need to start any
          investigation.
        </p>
      </div>
      <div class="col-span-full pdap-grid-container grid-cols-2 text-lg">
        <h2 class="my-0 col-span-full">Data for investigative projects</h2>
        <div>
          <h3>
            <FontAwesomeIcon :icon="faEyeLowVision" />
            Transparency & Oversight
          </h3>
          <p>
            Misconduct, use of force, complaints, and disciplinary records are
            some examples of tools for public oversight and incident reporting.
          </p>
        </div>
        <div>
          <h3>
            <FontAwesomeIcon :icon="faMicroscope" />
            Operational Analysis
          </h3>
          <p>
            Understanding the effectiveness of emergency response strategies
            requires records about dispatch, calls for service, crime, budgets,
            staffing, and more.
          </p>
        </div>
        <div>
          <h3>
            <FontAwesomeIcon :icon="faMagnifyingGlassChart" />
            Studying Policy & Reform
          </h3>
          <p>
            When a new emergency response strategy is developed, comparable
            records from different jurisdictions may be required to understand
            policy changes and their effects.
          </p>
        </div>
        <div>
          <h3>
            <FontAwesomeIcon :icon="faScaleBalanced" />
            Performance & Outcome Analysis
          </h3>
          <p>
            The outcomes of policing carry through to incarceration and
            prosecution. A variety of consistent records over a longer time
            period are required to understand things like demographic
            disparities and recidivism.
          </p>
        </div>
      </div>
      <div class="col-span-full">
        <h2 class="my-0">Examples</h2>
      </div>
      <h3 class="col-span-full my-0">
        <FontAwesomeIcon :icon="faBook" class="text-brand-wine-300" />
        Sharing access to Traffic Stop data
      </h3>
      <div class="text-lg">
        <p>Several researchers in Pittsburgh were asking:</p>
        <p class="border-l-2 border-brand-wine/20 pl-4 my-5 italic">
          What is the reality of traffic enforcement in Pittsburgh, given
          changed policies about enforcing minor traffic violations?
        </p>
      </div>
      <div class="text-lg">
        <p>
          We requested data from the City of Pittsburgh and
          <a href="https://pdap.io/data-sources/198">
            shared it in our database.
          </a>
        </p>
        <p>
          It led to
          <a
            href="https://www.publicsource.org/pittsburgh-police-traffic-stop-disparity-accountability-race/"
          >
            this article in Public Source
          </a>
          , among other research.
        </p>
      </div>
      <h3 class="col-span-full my-0">
        <FontAwesomeIcon :icon="faPhone" class="text-brand-wine-300" />
        Preserving Calls for Service data in Oakland CA
      </h3>
      <div class="text-lg">
        <p class="mb-4">A journalist in Oakland, CA asked:</p>
        <p class="border-l-2 border-brand-wine/20 pl-4 italic">
          How does Oakland dispatch its police force to address community needs?
        </p>
      </div>
      <div class="text-lg">
        <p>
          Calls for police service were published by the city, but only stayed
          online for 1&ndash;2 days.
        </p>
        <p>
          We made a web scraper (
          <a
            href="https://docs.pdap.io/activities/terms-and-definitions/terminology"
            target="blank"
          >
            <i class="fa fa-question-circle" />
          </a>
          ) to archive the data every day, automatically, for free.
          <a
            href="https://github.com/Police-Data-Accessibility-Project/github-actions-demo/tree/main"
          >
            We made it open-source
          </a>
          , so it can be reused by anyone for future zero-budget research
          projects.
        </p>
      </div>
    </section>
    <section
      class="col-span-full pdap-flex-container pt-6 mt-8 border-t-[3px] border-wineneutral-100"
    >
      <h1>
        <FontAwesomeIcon :icon="faRoute" class="text-brand-wine-300" />
        Software roadmap
      </h1>
      <p>
        We have merged
        <span v-if="githubData?.mergeCount">
          <strong>{{ githubData.mergeCount }} Pull Requests</strong>
        </span>
        <span v-else>
          <strong>over 1000 Pull Requests</strong>
        </span>
        (new features and improvements) across
        <span v-if="githubData?.repoCount">
          <strong>{{ githubData.repoCount }} code repositories.</strong>
        </span>
        <span v-else>
          <strong>our code repositories.</strong>
        </span>
      </p>
      <ul>
        <h3>2023&ndash;2024</h3>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faCircleCheck"
            class="pt-1.5 pr-3 text-brand-wine-500"
          />
          Develop a database for tracking sources of police data
        </li>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faCircleCheck"
            class="pt-1.5 pr-3 text-brand-wine-500"
          />
          Seed the database with volunteer-documented sources and existing
          collections
        </li>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faCircleCheck"
            class="pt-1.5 pr-3 text-brand-wine-500"
          />
          Build an app for searching our database
        </li>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faCircleCheck"
            class="pt-1.5 pr-3 text-brand-wine-500"
          />
          Respond to 100+ Data Requests to learn how people use public data, and
          where they get stuck
        </li>
        <h3>2025</h3>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faCircleCheck"
            class="pt-1.5 pr-3 text-brand-wine-500"
          />
          Add accounts & login, and the ability to “follow” any search location
        </li>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faCircleCheck"
            class="pt-1.5 pr-3 text-brand-wine-500"
          />
          Use and refine our toolset for locating and documenting data sources
        </li>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faArrowUpRightDots"
            class="pt-1.5 pr-3 text-brand-wine-100"
          />
          <span>
            Grow our database, prioritizing locations followed by our users. To
            participate,
            <a href="https://airtable.com/appcYa6x4nS7W8IR3/shrk9c5sBsBr3cdJJ">
              sign up for data labeling here!
            </a>
          </span>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import SearchForm from '@/components/SearchForm.vue';
import DataSourceMap from '@/components/maps/DataSourceMap.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faBook,
  faPhone,
  faRoute,
  faCircleCheck,
  faExternalLink,
  faInfoCircle,
  faArrowUpRightDots,
  faMagnifyingGlassLocation,
  faPeopleCarryBox,
  faCodePullRequest,
  faEyeLowVision,
  faScaleBalanced,
  faMagnifyingGlassChart,
  faMicroscope
} from '@fortawesome/free-solid-svg-icons';
import { getMetrics } from '@/api/metrics';
import { getRecentSources } from '@/api/data-sources';
import { getMapLocations } from '@/api/map';
import { getLocation } from '@/api/locations';
import { followSearch } from '@/api/search';
import {
  getPdapRepositories,
  getPdapPRsMerged,
  getPdapIssues
} from '@/api/github';
import { formatDateForSearchResults } from '@/util/dateFormatters';
import { getMinimalLocationText } from '@/util/locationFormatters';
import { SEARCH_FOLLOWED, PROFILE } from '@/util/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useSearchStore } from '@/stores/search';

const queryClient = useQueryClient();
const search = useSearchStore();

// Get recent sources
const { data: recentSources } = useQuery({
  queryFn: async () => await getRecentSources(),
  queryKey: ['recentSources'],
  onError: (err) => {
    console.error('Error fetching recent sources:', err);
  },
  staleTime: 5 * 60 * 1000 // 5 minutes
});

const formattedSources = computed(() =>
  recentSources.value?.map((source) => ({
    ...source,
    formattedCreatedAt: formatDateForSearchResults(source.createdAt)
  }))
);

// Metrics
const { data: mapData } = useQuery({
  queryFn: async () => await getMapLocations(),
  queryKey: ['mapLocations'],
  onError: (err) => {
    console.error('Error fetching map locations:', err);
  },
  staleTime: 60 * 60 * 1000 // 1 hour
});

const { data: metricsData } = useQuery({
  queryFn: async () => {
    const response = await getMetrics();
    return {
      sourceCount: response.source_count,
      agencyCount: response.agency_count,
      countyCount: response.county_count,
      stateCount: response.state_count
    };
  },
  queryKey: ['metricsData'],
  onError: (err) => {
    console.error('Error fetching metrics:', err);
  },
  staleTime: 5 * 60 * 1000 // 5 minutes
});

// GitHub data
const { data: githubData, isLoading: githubDataLoading } = useQuery({
  queryFn: async () => await getGithubData(),
  queryKey: ['githubData'],
  onError: (err) => {
    console.error('Error fetching data:', err);
  },
  staleTime: 5 * 60 * 1000 // 5 minutes,
});

const followMutation = useMutation({
  mutationFn: async (location_id) => {
    await followSearch(location_id);
    const location = await getLocation(location_id);

    toast.success(
      `Search followed for ${getMinimalLocationText(location.data)}.`
    );
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: [SEARCH_FOLLOWED]
    });
    queryClient.invalidateQueries({
      queryKey: [PROFILE]
    });
  },
  onError: () => {
    toast.error('Error following search location. Please try again.');
  }
});

// TODO: Uncomment the below to close pdap.io/issues/208; blocked by data-sources-app/issues/580
// Get recent data requests
// const recentRequests = ref([]);
const requestsLoaded = ref(false);
// onMounted(async () => {
//   try {
//     recentRequests.value = await getRecentRequests();
//     console.log("Requests API response:", recentRequests.value);
//     requestsLoaded.value = true;
//   } catch (error) {
//     console.error('Error loading recent requests:', error);
//   }
// });

// Async utils
async function getGithubData() {
  const reposResponse = await getPdapRepositories();
  const repoCount = reposResponse.data.length;

  const mergesResponse = await getPdapPRsMerged();
  const mergeCount = mergesResponse.data.total_count;

  const issuesResponse = await getPdapIssues();

  const goodFirstIssues = issuesResponse.data.items.map((issue) => ({
    title: issue.title,
    url: issue.html_url
  }));

  return {
    repoCount,
    mergeCount,
    goodFirstIssues
  };
}
</script>
