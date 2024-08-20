<template>
	<section class="pdap-grid-container px-4 md:px-8">
		<h1 class="col-span-full"> Data Sources </h1>
		<img
			src="/images/searching.svg"
			class="w-11/12 place-self-center hidden lg:block"
			alt="An eye looking through a magnifying glass at a police website."
		/>
		<img
			src="/images/mapping.svg"
			class="w-6/12 place-self-start md:w-10/12 md:place-self-center"
			alt="A map scattered with icons representing different kinds of data."
		/>
		<img
			src="/images/sharing.svg"
			class="w-9/12 place-self-start hidden md:block"
			alt="A piece of police data being distributed to several people."
		/>
		<div class="col-span-full">
			<p>
				We <strong>locate, describe, and share</strong> sources of data about police agencies across
				the United States, which are
				<a
					href="https://en.wikipedia.org/wiki/Freedom_of_information_in_the_United_States"
					target="blank"
				>
					generally public&nbsp;record.</a
				>
			</p>
			<p>
				Criminal legal systems in the United States are decentralized, and managed locally. In
				response, we facilitate local research and organizing to keep the data in context. The goal
				is a <strong>relevant</strong> database, and <strong>impactful</strong> open-source tools.
			</p>
		</div>
		<div class="col-span-full">
			<p>
				<a href="https://data-sources.pdap.io">
					<i class="fa fa-external-link"></i> Search our database
				</a>
				to see if anything interests you.
			</p>
			<p>
				<a href="https://airtable.com/shrbFfWk6fjzGnNsk">
					<i class="fa fa-external-link"></i> Make a request
				</a>
				to get help or find collaborators.
			</p>
			<p>
				<a href="https://airtable.com/app473MWXVJVaD7Es/shrJafakrcmTxHU2i">
					<i class="fa fa-external-link"></i> Submit data
				</a>
				if you have something to share.
			</p>
		</div>
		<div class="col-span-full loading-shimmer h-48 bg-neutral-500">
			<h2><i class="fa fa-globe"></i> Geographic Coverage</h2>
			<p>
				Our database currently documents data sources from <br>
				<strong>{{ agenciesCount }} agencies</strong> in <strong>{{ countiesCount }} counties</strong> across all <strong>{{ statesCount }} states </strong> and the District of Columbia.
			</p>
			<a href="https://data-sources.pdap.io"><i class="fa fa-external-link"></i> Explore the data</a>
		</div>
	</section>
	<section class="pdap-grid-container pdap-grid-container-columns-2 px-4 md:px-8 mb-12">
		<h2 class="col-span-full">
			Other things we're building with data
		</h2>
		<div>
			We create <a href="https://github.com/Police-Data-Accessibility-Project/automatic-archives">automatic archives</a> of 
			data sources, so they are not lost to time and poor data retention policies. Fragile URLs are turned into lasting resources for future use. 
		</div>
		<div>
			We're <a href="https://github.com/Police-Data-Accessibility-Project/data-source-map">mapping what is available</a> in each jurisdiction, and advocating for transparency.
			What kinds of research are possible? What does model transparency look like?
		</div>
	</section>
</template>

<script>
// import { FlexContainer, GridContainer, GridItem } from 'pdap-design-system';
import HelpTextIcon from '../components/HelpTextIcon.vue';

const baseUrl = "https://data-sources.pdap.io/api/";
const api_key = import.meta.env.VITE_PDAP_API_KEY;

const headers = {
  'Authorization': `Bearer ${api_key}`,
  'Content-Type': 'application/json'
};

export default {
	name: 'DataView',
	// components: {
	// 	FlexContainer,
	// 	GridContainer,
	// 	GridItem,
	// 	HelpTextIcon,
	// },
	data: () => ({
		agenciesCount: 0,
		countiesCount: 0,
		statesCount: 0,
	}),
	mounted: async function(){
			
			let tempAgencyCount = 1;
			let page = 1;
			let states = [];
			let counties = [];
			let agencies =[];

			while (tempAgencyCount !== 0) {
				const tempAgencies = await (await fetch(`${baseUrl}agencies/${page}`, {
					method: 'GET',
					headers: headers,
				})).json();

				for (const entry of tempAgencies.data){
					if (entry.count_data_sources > 0){
						const tempAgency = entry.name;
						if (!agencies.includes(tempAgency)) {
							agencies.push(tempAgency);
						}
						const tempState = entry.state_iso;
						if (!states.includes(tempState)) {
							states.push(tempState);
						}
						const tempCounty = entry.county_fips;
						if (!counties.includes(tempCounty)) {
							counties.push(tempCounty);
						}
					}
				}
				page += 1; 
				tempAgencyCount = tempAgencies.count;
			}
			this.statesCount = states.length-2;
			this.countiesCount = counties.length;
			this.agenciesCount = agencies.length;
		},
	};
</script>
