<template>
	<FlexContainer component="section">
		<h1>
			Data Sources
		</h1>
			<p>
				We track of any source of data about criminal legal systems across the United States, which is 
				<a href="https://en.wikipedia.org/wiki/Freedom_of_information_in_the_United_States" target="blank">
					generally public record.</a>
			</p>
			<p>
				Police in the United States are decentralized, and managed locally.
				In response, we facilitate local research and organizing to keep the data in context.
				The goal is a <strong>relevant</strong> database, and <strong>impactful</strong> open-source tools.
			</p>
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
	</FlexContainer>
	<FlexContainer component="section">
		<h1>
			Case studies
		</h1>
		<p>
			We serve as a <strong>data help desk</strong>, where people can use our tools to answer
			questions. With each successful request, our database grows stronger.
		</p>
	</FlexContainer>
	<section>
		<GridContainer class="pt-0 text-xl" :columns="2">
			<GridItem component="h2" :span-column="2">
					<i class="fa fa-book"></i> Sharing access to Traffic Stop data
			</GridItem>
			<GridItem component="div">
				<p>
					Several researchers in Pittsburgh were asking:
				</p>
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
					<a href="https://www.publicsource.org/pittsburgh-police-traffic-stop-disparity-accountability-race/">
						this article in Public Source</a>, 
						among other research.
				</p>
			</GridItem>
		</GridContainer>
	</section>
		<GridContainer class="pt-0 text-xl" :columns="2">
			<GridItem component="h2" :span-column="2">
				<i class="fa fa-phone"></i> Preserving Calls for Service data in Oakland CA
			</GridItem>
			<GridItem component="div">
				<p class="mb-4">
					A journalist in Oakland, CA asked:
				</p>
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
					<a href="https://docs.pdap.io/activities/terms-and-definitions" target="blank">
						<i class="fa fa-question-circle"></i>
					</a>
					to archive the data every day, automatically, for free.
					<a href="https://github.com/Police-Data-Accessibility-Project/github-actions-demo/tree/main">
						We made it open-source</a>, so it can be reused by anyone for future zero-budget research projects.
				</p>
				<p>
					We archived data for 3 months before their site went down.
				</p>
			</GridItem>
		</GridContainer>

		<GridContainer class="pt-0 text-xl" :columns="2">
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
				<a href="https://data-sources.pdap.io/data-sources/recn5peRrGMNEksXI"
					>County jail holding status dashboard</a
				>
			</GridItem>
			<GridItem component="p" class="border-l-2 border-brand-wine/20 pl-4 italic">
				How often are people placed in solitary confinement after it was banned in 2022?
			</GridItem>
			<GridItem component="p">
				<a href="https://data-sources.pdap.io/data-sources/recabQ04zvUH4RKQ0">
					Segregated Housing reports
				</a>
			</GridItem>
			<GridItem component="p" class="border-l-2 border-brand-wine/20 pl-4 italic">
				Do people in the jail receive medical attention when they request it?
			</GridItem>
			<p>
				<a href="https://data-sources.pdap.io/data-sources/recPdBv9M0QhyKKZN">2021</a> &
				<a href="https://data-sources.pdap.io/data-sources/recFUDsFf9RPpCZX6">2022</a> surveys of
				incarcerated population
			</p>
			<GridItem component="p" class="border-l-2 border-brand-wine/20 pl-4 italic">
				Has the city documented any health code violations at the Allegheny County Jail?
			</GridItem>
			<GridItem component="p">
				<a href="https://data-sources.pdap.io/search/health%20/allegheny">
					Inspection records from the Health Department
				</a>
			</GridItem>
		</GridContainer>
</template>

<script>
import { FlexContainer, GridContainer, GridItem } from 'pdap-design-system';
import HelpTextIcon from '../components/HelpTextIcon.vue';

export default {
	name: 'DataView',
	components: {
		FlexContainer,
		GridContainer,
		GridItem,
		HelpTextIcon,
	},
};
</script>
