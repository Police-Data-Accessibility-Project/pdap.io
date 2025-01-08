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
    <section class="col-span-full">
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
        <button>Help label Data Sources</button>
      </div>
      <div>
        <img
            src="/assets/searching.svg"
            class="w-11/12 place-self-center hidden lg:block"
            alt="An eye looking through a magnifying glass at a police website."
        />
        <p>Project-based scraping and records requests</p>
        <button>Improve access to data in your area</button>
      </div>
      <div>
        <img
          src="/assets/sharing.svg"
          class="w-9/12 place-self-start hidden md:block"
          alt="A piece of police data being distributed to several people."
        />
        <p>Connecting projects to data & resources</p>
        <button>Open a Data Request</button>
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
  </main>
</template>

<script setup>
import SearchForm from "@/components/SearchForm.vue";
</script>
