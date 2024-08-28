<template>
	<GridContainer class="px-4 md:px-8" component="section" :columns="2">
		<GridItem :span-column="2">
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
		</GridItem>
		<GridItem class="border-2 border-brand-gold p-4 md:p-6" :span-column="2">
			<QuickSearchForm :baseUrlForRedirect="baseUrlForRedirect" />
		</GridItem>
	</GridContainer>
	<FlexContainer component="section">
		<h1>Case studies</h1>
		<p>
			We find data and share resources to help each other <strong>answer questions
			and strengthen our database</strong> over time.
		</p>
	</FlexContainer>
	<section>
		<GridContainer class="pt-0 text-xl" :columns="2">
			<GridItem component="h2" :span-column="2">
				<i class="fa fa-book"></i> Sharing access to Traffic Stop data
			</GridItem>
			<GridItem component="div">
				<p>Several researchers in Pittsburgh were asking:</p>
				<p class="border-l-2 border-brand-wine/20 pl-4 my-5 italic">
					What is the reality of traffic enforcement in Pittsburgh, given changed policies about
					enforcing minor traffic violations?
				</p>
			</GridItem>
			<GridItem component="div">
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
			</GridItem>
		</GridContainer>
	</section>
	<GridContainer class="pt-0 text-xl" :columns="2">
		<GridItem component="h2" :span-column="2">
			<i class="fa fa-phone"></i> Preserving Calls for Service data in Oakland CA
		</GridItem>
		<GridItem component="div">
			<p class="mb-4">A journalist in Oakland, CA asked:</p>
			<p class="border-l-2 border-brand-wine/20 pl-4 italic">
				How does Oakland dispatch its police force to address community needs?
			</p>
		</GridItem>
		<GridItem component="div">
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
		</GridItem>
	</GridContainer>
	<GridContainer class="pt-0 text-xl mb-12" :columns="2">
		<GridItem component="h2" :span-column="2">
			<i class="fa fa-sitemap"></i> Consolidating records about the Allegheny County Jail
		</GridItem>
		<GridItem component="p">
			This facility has faced mounting scrutiny, and we have helped answer several questions:
		</GridItem>
		<GridItem component="div"></GridItem>
		<GridItem component="p" class="border-l-2 border-brand-wine/20 pl-4 italic">
			How many people are in jail because they cannot afford bail?
		</GridItem>
		<GridItem component="p">
			<a href="https://data-sources.pdap.io/search/interactive%20population/allegheny%20county%20jail"
				>County jail holding status dashboard</a
			>
		</GridItem>
		<GridItem component="p" class="border-l-2 border-brand-wine/20 pl-4 italic">
			How often are people placed in solitary confinement after it was banned in 2022?
		</GridItem>
		<GridItem component="p">
			<a href="https://data-sources.pdap.io/search/segregated%20housing/allegheny%20county%20jail">
				Segregated Housing reports
			</a>
		</GridItem>
		<GridItem component="p" class="border-l-2 border-brand-wine/20 pl-4 italic">
			Do people in the jail receive medical attention when they request it?
		</GridItem>
		<p>
			<a href="https://data-sources.pdap.io/search/survey/allegheny%20county%20jail">
				2021 & 2022 surveys
			</a> of the incarcerated population
		</p>
		<GridItem component="p" class="border-l-2 border-brand-wine/20 pl-4 italic">
			Has the city documented any health code violations at the Allegheny County Jail?
		</GridItem>
		<GridItem component="p">
			<a href="https://data-sources.pdap.io/search/health%20/allegheny%20county%jail">
				Inspection records from the Health Department
			</a>
		</GridItem>
	</GridContainer>
</template>

<script>
import { Button, Form, FlexContainer, GridContainer, GridItem, QuickSearchForm } from 'pdap-design-system';
import { RouterLink } from 'vue-router';

export default {
	name: 'HomeView',
	components: {
    Button,
    Form,
    FlexContainer,
    GridContainer,
    GridItem,
    QuickSearchForm,
    RouterLink
	},
	data() {
		return {
			baseUrlForRedirect: import.meta.env.MODE === 'production' 
			? 'https://data-sources.pdap.io' 
			: 'https://data-sources.pdap.dev'
		};
	}
};
</script>