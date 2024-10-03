<template>
	<section class="pdap-grid-container px-4 md:px-8">
		<div class="col-span-full"> 
			<h1 class="font-medium mt-0 text-4xl md:text-5xl md:leading-tight">
				We help people use public data for police oversight.
			</h1>
			<p>
				We collect data about legal systems because their
				<strong>power to impact people</strong> demands the
				<strong>highest degree of transparency.</strong>
			</p>
			<p>
				If you have a question to answer, we can help. 
				 <a href="https://airtable.com/shrbFfWk6fjzGnNsk">
					Make a request <i class="fa fa-external-link"></i>
				</a>
			</p>
		</div>
		<div class="col-span-full border-2 border-brand-gold p-4 md:p-6">
			<QuickSearchForm :baseUrlForRedirect="baseUrlForRedirect" />
		</div>
	</section>
	<section class="pdap-grid-container">
		<div class="col-span-full">
		<h2><i class="fa fa-check-square-o"></i> Completed Data Requests</h2>
		<p>Completed <strong> {{ requests }} data requests</strong> since January 9, 2023.</p>
		<a href="https://airtable.com/shrbFfWk6fjzGnNsk">
			<i class="fa fa-external-link"></i> Make a request
		</a>
	</div>
	</section>
	<section class="pdap-grid-container">
		<div class="col-span-full">
		<h1>Case studies</h1>
		<p>
			We find data and share resources to help each other <strong>answer questions
			and strengthen our database</strong> over time.
		</p>
	</div>
	</section>
	<section>
		<div class="pdap-grid-container pdap-grid-container-columns-2 pt-0 text-xl mt-0">
			<h2 class="col-span-full">
				<i class="fa fa-book"></i> Sharing access to Traffic Stop data
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
		</div>
	</section>
	<div class="pdap-grid-container pdap-grid-container-columns-2 pt-0 text-xl mt-0" >
		<h2 class="col-span-full">
			<i class="fa fa-phone"></i> Preserving Calls for Service data in Oakland CA
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
				<a
					href="https://github.com/Police-Data-Accessibility-Project/github-actions-demo/tree/main"
				>
					We made it open-source</a
				>, so it can be reused by anyone for future zero-budget research projects.
			</p>
		</div>
	</div>
	<div class="pdap-grid-container pdap-grid-container-columns-2 pt-0 text-xl mb-12 mt-0">
		<h2 class="col-span-full">
			<i class="fa fa-sitemap"></i> Consolidating records about the Allegheny County Jail
		</h2>
		<p>
			This facility has faced mounting scrutiny, and we have helped answer several questions:
		</p>
		<GridItem component="div"></GridItem>
		<p class="border-l-2 border-brand-wine/20 pl-4 italic">
			How many people are in jail because they cannot afford bail?
		</p>
		<p>
			<a href="https://data-sources.pdap.io/search/interactive%20population/allegheny%20county%20jail"
				>County jail holding status dashboard</a
			>
		</p>
		<p class="border-l-2 border-brand-wine/20 pl-4 italic">
			How often are people placed in solitary confinement after it was banned in 2022?
		</p>
		<p>
			<a href="https://data-sources.pdap.io/search/segregated%20housing/allegheny%20county%20jail">
				Segregated Housing reports
			</a>
		</p>
		<p class="border-l-2 border-brand-wine/20 pl-4 italic">
			Do people in the jail receive medical attention when they request it?
		</p>
		<p>
			<a href="https://data-sources.pdap.io/search/survey/allegheny%20county%20jail">
				2021 & 2022 surveys
			</a> of the incarcerated population
		</p>
		<p class="border-l-2 border-brand-wine/20 pl-4 italic">
			Has the city documented any health code violations at the Allegheny County Jail?
		</p>
		<p>
			<a href="https://data-sources.pdap.io/search/health%20/allegheny%20county%jail">
				Inspection records from the Health Department
			</a>
		</p>
	</div>
</template>

<script>
import { Button, Form, QuickSearchForm } from 'pdap-design-system';
import { RouterLink } from 'vue-router';

const airtable_api_key = import.meta.env.VITE_AIRTABLE_API_KEY;

const headers = {
  'Authorization': `Bearer ${airtable_api_key}`,
  'Content-Type': 'application/json'
};

export default {
	name: 'HomeView',
	components: {
    Button,
    Form,
    QuickSearchForm,
    RouterLink
	},
	data: () => ({
		requests: 0,
		baseUrlForRedirect: import.meta.env.MODE === 'production' 
		? 'https://data-sources.pdap.io' 
		: 'https://data-sources.pdap.dev'
	}),
	mounted: async function(){
			const dataRequests = await (await fetch(`https://api.airtable.com/v0/app473MWXVJVaD7Es/Data%20Requests?filterByFormula=%28%7Bstatus (deprecated)%7D%3D%27Complete%27%29`, { 
				method: 'GET',
				headers: headers
			})
			).json();
			this.requests = dataRequests.records.length;
		},
	};
</script>