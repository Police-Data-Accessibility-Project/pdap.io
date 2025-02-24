<route>
	{
		alias: ['/search', '/data'],
	}
</route>

<template>
  <main class="mb-24 grid grid-cols-3 max-w-5xl mx-auto @container w-full">
    <section class="col-span-full">
      <h1>Explore data about police systems</h1>
      <SearchForm />
    </section>
    <section class="col-span-full text-lg">
      <h2>About the data</h2>
      <p>
        We document Data Sources (
        <a
          href="https://docs.pdap.io/activities/terms-and-definitions/what-is-a-data-source">
          <i class="fa fa-question-circle" />
        </a>
        ), places on the internet where public records can be found. Each one
        describes one of the ~20,000 agencies we have indexed.
      </p>
      <p v-if="metricsLoaded">
        Our database contains
        <strong>{{ metrics.sourceCount }} Sources</strong>
        from
        <br />
        <strong>{{ metrics.agencyCount }} agencies</strong>
        in
        <strong>{{ metrics.countyCount }} counties</strong>
        across
        <strong>all 50 states</strong>
        and the District of Columbia. They are published by both government
        agencies and independent organizations.
      </p>
      <p v-else>
        Our database contains Sources from agencies in hundreds of counties
        across all 50 states and the District of Columbia. They are published by
        both government agencies and independent organizations.
      </p>
      <div v-if="sourcesLoaded" class="grid grid-cols-3 mt-6 gap-4">
        <h3 class="col-span-3">Recently added Data Sources</h3>
        <div
          v-for="source in formattedSources"
          :key="source.id"
          class="col-span-full md:col-span-1 flex-column outline outline-2 outline-goldneutral-200 px-4 py-2">
          <p>
            <strong>{{ source.name }}&nbsp;</strong>
            <a
              :href="source.sourceUrl"
              target="_blank"
              rel="noopener noreferrer">
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
      class="pdap-grid-container col-span-full pt-6 mt-8 border-t-[3px] border-wineneutral-100">
      <h1 class="col-span-full pt-8 mb-0">Programs</h1>
      <div
        class="col-span-full md:col-span-1 flex-column content-end justify-stretch">
        <img
          src="/assets/mapping.svg"
          class="w-3/12 place-self-center md:block md:w-10/12"
          alt="A map scattered with icons representing different kinds of data." />
        <p class="font-semibold lg:text-center">
          Finding and cataloguing sources of data
        </p>
      </div>
      <div class="col-span-full md:col-span-1 flex-column content-end">
        <img
          src="/assets/searching.svg"
          class="w-3/12 place-self-center md:block md:pb-6 md:w-11/12"
          alt="An eye looking through a magnifying glass at a police website." />
        <p class="font-semibold lg:text-center">
          Project-based scraping and records requests
        </p>
      </div>
      <div class="col-span-full md:col-span-1 flex-column content-end">
        <img
          src="/assets/sharing.svg"
          class="w-3/12 place-self-center md:block md:w-9/12"
          alt="A piece of police data being distributed to several people." />
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
          All of our programs exist to help people answer questions with data.
          <strong>If you are starting a data project, we can help.</strong>
          <Button
            class="mt-2"
            intent="primary"
            onclick="window.open('https://airtable.com/app473MWXVJVaD7Es/shrbFfWk6fjzGnNsk', '_blank')">
            Open a Data Request
          </Button>
        </p>
      </div>
    </section>
    <section
      class="col-span-full pdap-flex-container pt-6 mt-8 border-t-[3px] border-wineneutral-100">
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
        for using our tools to do things with data.
      </p>
      <h2>
        <FontAwesomeIcon
          :icon="faMagnifyingGlassLocation"
          class="text-brand-wine-300" />
        Locate sources
      </h2>
      <p>
        Some public records are already online, waiting to be indexed and used.
        Adding them to our database makes them more accessible to everyone.
      </p>
      <Button
        class="mt-2"
        intent="primary"
        onclick="window.open('https://airtable.com/appcYa6x4nS7W8IR3/shrk9c5sBsBr3cdJJ', '_blank')">
        Help find & label Data Sources
      </Button>
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
      <h3 class="mt-2">Open data requests</h3>
      <ul v-if="requestsLoaded">
        <li v-for="request in recentRequests" :key="request.id">
          <strong>{{ request.title }}</strong>
          Location: {{ request.locationDisplayName }}
          <router-link :to="request.route">
            Details
            <FontAwesomeIcon :icon="faExternalLink" />
          </router-link>
        </li>
      </ul>
      <Button class="mt-2" intent="primary" onclick="window.open('https://docs.pdap.io')">
        Volunteer for data requests
      </Button>
      <h2 class="pt-4 col-span-full">
        <FontAwesomeIcon
          :icon="faCodePullRequest"
          class="text-brand-wine-300" />
        Contribute code
      </h2>
      <p class="col-span-full">
        Everything you see is open source, built by a small team of volunteers
        and staff. We use Python for most backend and web scraping, and VueJS
        for front end.
      </p>
      <div
        v-if="goodFirstIssues.length"
        class="grid grid-cols-3 mt-6 gap-4 text-lg">
        <h3 class="col-span-3">Open good first issues</h3>
        <div
          v-for="(issue, index) in goodFirstIssues"
          :key="index"
          class="col-span-full md:col-span-1 flex-column outline outline-2 outline-goldneutral-200 px-4 py-2">
          <p>
            <strong>{{ issue.title }}&nbsp;</strong>
            <a :href="issue.url" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon :icon="faExternalLink" />
            </a>
          </p>
        </div>
        
          <Button
            class="mt-2 col-span-full"
            intent="primary"
            onclick="window.open('https://airtable.com/appcYa6x4nS7W8IR3/shrk9c5sBsBr3cdJJ', '_blank')"
          >
            View more Good First Issues
          </Button>
        
      </div>
    </section>
    <section
      class="pdap-flex-container col-span-full text-lg pt-6 mt-8 border-t-[3px] border-wineneutral-100">
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
      class="col-span-full pdap-grid-container grid-cols-2 pt-6 mt-8 border-t-[3px] border-wineneutral-100">
      <div class="col-span-full">
        <h1>Examples of our work</h1>
        <p>
          Access to data and collaborators helps people answer questions.
          Ultimately, our goal is to make new research possible.
        </p>
      </div>
      <h2 class="col-span-full my-0">
        <FontAwesomeIcon :icon="faBook" class="text-brand-wine-300" />
        Sharing access to Traffic Stop data
      </h2>
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
          <a
            href="https://data-sources.pdap.io/search/traffic%20stops/pittsburgh">
            shared it in our database.
          </a>
        </p>
        <p>
          It led to
          <a
            href="https://www.publicsource.org/pittsburgh-police-traffic-stop-disparity-accountability-race/">
            this article in Public Source
          </a>
          , among other research.
        </p>
      </div>
      <h2 class="col-span-full my-0">
        <FontAwesomeIcon :icon="faPhone" class="text-brand-wine-300" />
        Preserving Calls for Service data in Oakland CA
      </h2>
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
            target="blank">
            <i class="fa fa-question-circle" />
          </a>
          ) to archive the data every day, automatically, for free.
          <a
            href="https://github.com/Police-Data-Accessibility-Project/github-actions-demo/tree/main">
            We made it open-source
          </a>
          , so it can be reused by anyone for future zero-budget research
          projects.
        </p>
      </div>
    </section>
    <section
      class="col-span-full pdap-flex-container pt-6 mt-8 border-t-[3px] border-wineneutral-100">
      <h1>
        <FontAwesomeIcon :icon="faRoute" class="text-brand-wine-300" />
        Software roadmap
      </h1>
      <p>
        We have merged
        <span v-if="mergeCount">
          <strong>{{ mergeCount }} Pull Requests</strong>
        </span>
        <span v-else>
          <strong>over 1000 Pull Requests</strong>
        </span>
        (new features and improvements) across
        <span v-if="repoCount">
          <strong>{{ repoCount }} code repositories.</strong>
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
            class="pt-1.5 pr-3 text-brand-wine-300" />
          Develop a database for tracking sources of police data
        </li>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faCircleCheck"
            class="pt-1.5 pr-3 text-brand-wine-300" />
          Seed the database with volunteer-documented sources and existing
          collections
        </li>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faCircleCheck"
            class="pt-1.5 pr-3 text-brand-wine-300" />
          Build an app for searching our database
        </li>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faCircleCheck"
            class="pt-1.5 pr-3 text-brand-wine-300" />
          Respond to 100+ Data Requests to learn how people use public data, and
          where they get stuck
        </li>
        <h3>In testing for early 2025 release</h3>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faCircleNotch"
            class="pt-1.5 pr-3 text-brand-wine-300" />
          Add accounts & login, and the ability to “follow” any search location
        </li>
        <h3>Up next in 2025</h3>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faWandMagicSparkles"
            class="pt-1.5 pr-3 text-brand-wine-300" />
          Expand our toolset for locating and documenting sources of data
        </li>
        <li class="flex flex-row pt-2">
          <FontAwesomeIcon
            :icon="faArrowUpRightDots"
            class="pt-1.5 pr-3 text-brand-wine-300" />
          Use our tools to locate data and rapidly grow the database
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { Button } from 'pdap-design-system';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import SearchForm from '@/components/SearchForm.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faBook,
  faPhone,
  faRoute,
  faCircleNotch,
  faCircleCheck,
  faExternalLink,
  faInfoCircle,
  faArrowUpRightDots,
  faWandMagicSparkles,
  faMagnifyingGlassLocation,
  faPeopleCarryBox,
  faCodePullRequest
} from '@fortawesome/free-solid-svg-icons';

import { getMetrics } from '@/api/metrics';
import { getRecentSources } from '@/api/data-sources';
import { formatDateForSearchResults } from '@/util/dateFormatters';
// import { getRecentRequests } from "@/api/data-requests";

// Get metrics

const metrics = ref({
  agencyCount: 0,
  countyCount: 0,
  stateCount: 0
});

const metricsLoaded = ref(false);

onMounted(async () => {
  try {
    const response = await getMetrics();
    metrics.value = {
      sourceCount: response.source_count,
      agencyCount: response.agency_count,
      countyCount: response.county_count,
      stateCount: response.state_count
    };
    metricsLoaded.value = true;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    metricsLoaded.value = false;
  }
});

// Get recent data sources

const recentSources = ref([]);
const sourcesLoaded = ref(false);

onMounted(async () => {
  try {
    recentSources.value = await getRecentSources();
    sourcesLoaded.value = true;
  } catch (error) {
    console.error('Error loading recent sources:', error);
  }
});

// Format dates

const formattedSources = computed(() =>
  recentSources.value.map((source) => ({
    ...source,
    formattedCreatedAt: formatDateForSearchResults(source.createdAt)
  }))
);

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

// get stats and "good first issues" from GitHub

const repoCount = ref(0);
const mergeCount = ref(0);
const goodFirstIssues = ref([]);

onMounted(async () => {
  try {
    const reposResponse = await axios.get(
      `https://api.github.com/orgs/Police-Data-Accessibility-Project/repos`
    );
    repoCount.value = reposResponse.data.length;

    const mergesResponse = await axios.get(
      `https://api.github.com/search/issues?q=org:Police-Data-Accessibility-Project+is:pr+is:merged`
    );
    mergeCount.value = mergesResponse.data.total_count;

    const issuesResponse = await axios.get(
      `https://api.github.com/search/issues?q=org:Police-Data-Accessibility-Project+label:"good first issue"+state:open+-label:"resolved in dev"&sort=created&order=desc&per_page=3`
      // gets issues with "good first issue" label and applies other filters
    );

    goodFirstIssues.value = issuesResponse.data.items.map((issue) => ({
      title: issue.title,
      url: issue.html_url
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
</script>
