<route>
	{
		alias: '/search',
	}
</route>

<template>
  <main class="p-6 py-10 pdap-grid-container @container w-full">
    <section class="col-span-full">
      <h1>Explore data about police systems</h1>
      <SearchForm />
    </section>
    <section class="col-span-full text-lg">
			<h2>About the data</h2>
			<p> We document Data Sources (<a href="https://docs.pdap.io/activities/terms-and-definitions/what-is-a-data-source"><i class="fa fa-question-circle"></i></a>), places on the internet where public records can be found. 
				Each one describes one of the ~20,000 agencies we have indexed.</p>
			<p v-if="dataLoaded">
				Our database contains Sources from <br>
				<strong>{{ agenciesCount }} agencies</strong> in 
				<strong>{{ countiesCount }} counties</strong> across 
				<strong>{{ statesCount }} states </strong> and the District of Columbia.
				They are published by both government agencies and independent organizations.
			</p>
			<p v-else>
				Our database contains Sources from agencies 
				in hundreds of counties across all 50 states and the 
				District of Columbia. They are published by both government agencies 
				and independent organizations.
			</p>
		</section>
    <section class="pdap-grid-container col-span-full">
      <h1 class="col-span-full">
        Programs
      </h1>
      <div>
        <img
          src="/assets/mapping.svg"
          class="w-6/12 place-self-start md:w-10/12 md:place-self-center"
          alt="A map scattered with icons representing different kinds of data."
        />
        <p>Finding and cataloguing sources of data</p>
        <Button class="mt-4">
          Help label Data Sources
        </Button>
      </div>
      <div>
        <img
            src="/assets/searching.svg"
            class="w-11/12 place-self-center hidden lg:block"
            alt="An eye looking through a magnifying glass at a police website."
        />
        <p>Project-based scraping and records requests</p>
        <Button class="mt-4">
          Improve access to data in your area
        </Button>
      </div>
      <div>
        <img
          src="/assets/sharing.svg"
          class="w-9/12 place-self-start hidden md:block"
          alt="A piece of police data being distributed to several people."
        />
        <p>Connecting projects to data & resources</p>
        <Button class="mt-4">
          Open a Data Request
        </Button>
      </div>
      <p class="col-span-full">
        The problem we address is the inaccessibility of data about the systems 
        with the greatest impact on our lives. 
        Records which should be public are disorganized, 
        scattered across obscure municipal websites, 
        kept behind tedious request processes,
        or not published at all.
      </p>
      <p class="col-span-full">
        We envision a future where every person in the United States can easily 
        access and understand well-documented public data about local police systems.
        Police agencies will be reshaped by the demand for transparency, 
        with leading communities setting positive examples for others to follow. 
        Our impartial, open-source work will enable people to track data about 
        any public system that impacts their community.
      </p>
	  </section>
    <section class="pdap-flex-container col-span-full text-lg">
      <h2>Praise for our work</h2>
      <div
        class="p-4 my-2 mx-0 border-2 border-solid border-wineneutral-300"
      >
        <p>
          “PDAP's work was invaluable in helping us find and access data we
          wouldn't have been able to otherwise.”
        </p>
        <p class="italic mb-0">
          &mdash;Dr. Jesse Wozniak, Director of Law & Public Policy at the
          <a href="https://apa-pgh.org/">Alliance for Police Accountability</a>
        </p>
      </div>
      <div
        class="p-4 my-2 mx-0 border-2 border-solid border-wineneutral-300"
      >
        <p>
          “PDAP's feedback helped us revise our published data to be more
          beneficial to the public.”
        </p>
        <p class="italic mb-0">
          &mdash;Philip Lukens, Chief of Police in
          <a href="https://www.cityofalliance.net/186/Police">Alliance, NE</a>
        </p>
      </div>
      <div
        class="p-4 my-2 mx-0 border-2 border-solid border-wineneutral-300"
      >
        <p>
          “PDAP provides data necessary to understand how police use-of-force
          incidents are processed in the courts, which reveals whether legal
          accountability mechanisms actually work on-the-ground.”
        </p>
        <p class="italic mb-0">
          &mdash;
          <a href="https://www.kylabourne.net/">Dr. Kyla Bourne</a>, UC Berkeley
        </p>
      </div>
    </section>
    <section class="col-span-full pdap-flex-container">
      <h1>Join our Community</h1>
      <p>
        This work is multidisciplinary and beginner-friendly.
        No matter what your level of experience, you can be a valuable contributor!
        The most important skill is <strong>persistence.</strong>
      </p>
      <div>
        <h2>Locate sources</h2>
        <p>
          Some public records are already online, waiting to be indexed and used. Adding them to our database makes them more accessible to everyone. 
        </p>
        <button>Help label data sources</button>
      </div>
      <div>
        <h2>Research requests</h2>
        <p>
          Some research projects could benefit from extra help. We need people to help with data analysis, web scraping, or local records requests.
        </p>
        <h3>Open data requests</h3>
        <p>request 1</p>
        <p>request 2</p>
        <button>View more data requests</button>
      </div>
      <div>
        <h2>Open source code</h2>
        <p>
          Everything you see is open source, built by a small team of volunteers and staff. We use Python for most backend and web scraping, and VueJS for front end.
        </p>
        <h3>Good first issues</h3>
        <p>issue 1</p>
        <p>issue 2</p>
      </div>
    </section>
    <section class="col-span-full pdap-grid-container grid-cols-2">
      <div class="col-span-full">
        <h1>Examples of our work</h1>
        <p>
          Access to data and collaborators helps people answer questions. Ultimately, our goal is to make new research possible.
        </p>
      </div>
			<h2 class="col-span-full">
				<FontAwesomeIcon :icon="faBook" /> Sharing access to Traffic Stop data
			</h2>
			<div>
				<p>Several researchers in Pittsburgh were asking:</p>
				<p class="border-l-2 border-brand-wine/20 pl-4 my-5 italic">
					What is the reality of traffic enforcement in Pittsburgh, given changed policies about
					enforcing minor traffic violations?
				</p>
      </div>
			<div>
				<p>
					We requested data from the City of Pittsburgh and
					<a href="https://data-sources.pdap.io/search/traffic%20stops/pittsburgh">
						shared it in our database.
					</a>
				</p>
				<p>
					It led to
					<a
						href="https://www.publicsource.org/pittsburgh-police-traffic-stop-disparity-accountability-race/"
					>
						this article in Public Source</a
					>, among other research.
				</p>
			</div>
      <h2 class="col-span-full">
			  <FontAwesomeIcon :icon="faPhone" /> Preserving Calls for Service data in Oakland CA
      </h2>
      <div>
        <p class="mb-4">A journalist in Oakland, CA asked:</p>
        <p class="border-l-2 border-brand-wine/20 pl-4 italic">
          How does Oakland dispatch its police force to address community needs?
        </p>
      </div>
      <div>
        <p>
          Calls for police service were published by the city, but only stayed online for 1&ndash;2
          days.
        </p>
        <p>
          We made a web scraper
          <a href="https://docs.pdap.io/activities/terms-and-definitions/terminology" target="blank">
            <i class="fa fa-question-circle"></i>
          </a>
          to archive the data every day, automatically, for free.
          <a href="https://github.com/Police-Data-Accessibility-Project/github-actions-demo/tree/main">
          We made it open-source</a>, so it can be reused by anyone for future zero-budget research projects.
        </p>
      </div>
		</section>
    <section class="col-span-full pdap-flex-container">
      <h1>Software documentation</h1>
      <p><a href="https://docs.pdap.io">docs.pdap.io</a> is the starting point for using our tools to do things with data.</p>
      <p><a href="https://docs.pdap.io/api">docs.pdap.io/api</a> are the Data Sources API docs.</p>
      <p>The <a href="https://github.com/Police-Data-Accessibility-Project/data-source-identification">Data Source Identification repo</a> houses our code for collecting sources for the database.</p>
      <p>The <a href="https://github.com/Police-Data-Accessibility-Project/data-sources-app">Data Sources App repo</a> is the back end for our Data Sources API.</p>
      <h2><FontAwesomeIcon :icon="faCodeFork" /> High-level roadmap</h2>
      <p v-if="repoCount && mergeCount">
        We have merged
        <strong>{{ mergeCount }} Pull Requests</strong>
        across
        <strong>{{ repoCount }} code repositories</strong>.
      </p>
      <p v-else>
        We have merged over 1000 Pull Requests across our code repositories.
      </p>
      <ul>
        <li>
          <FontAwesomeIcon :icon="faCircleCheck" /> develop a database for tracking sources of police data
        </li>
        <li>
          <FontAwesomeIcon :icon="faCircleCheck" /> seed the database with volunteer-collected sources and low-hanging fruit
        </li>
        <li>
          <FontAwesomeIcon :icon="faCircleCheck" /> build an app for searching our database
        </li>
        <li>
          <FontAwesomeIcon :icon="faCircleNotch" /> give people the ability to create an account and “follow” any search location
        </li>
        <li>
          <FontAwesomeIcon :icon="faCircleNotch" /> expand our toolset for locating and documenting sources of data
        </li>
        <li>
          <FontAwesomeIcon :icon="faCircleNotch" /> locate data automatically and grow the database
        </li>
      </ul>

    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import SearchForm from "@/components/SearchForm.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBook,
  faPhone,
  faCodeFork,
  faCircleNotch,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
// import Button from 'pdap-design-system';

// TODO: get agenciesCount, countiesCount, statesCount from the PDAP API once endpoints are surfaced

// TODO: get 3 recent data requests from the API, with a graceful fallback

// TODO: get 3 good first issues from github, with a graceful fallback


const repoCount = ref(0);
const mergeCount = ref(0);

onMounted(async () => {
  // TODO: move this fetching to a utility function and cache data with Tanstack when implemented
  try {
    const repos = await axios.get(
      `https://api.github.com/orgs/Police-Data-Accessibility-Project/repos`
    );

    const merges = await axios.get(
      `https://api.github.com/search/issues?q=org:Police-Data-Accessibility-Project+is:pr+is:merged`
    );

    repoCount.value = repos.data.length;
    mergeCount.value = merges.data.total_count;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>
