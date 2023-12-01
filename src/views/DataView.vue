<template>
	<GridContainer component="section" :columns="1">
		<GridItem component="h1">Data</GridItem>
		<GridItem>
			<p>
				We keep track of data about criminal legal systems
				(police, courts, and jails) across the United States.
			</p>
			<p>
				Information about state, local, and federal government activity in the United States is
				<a href="https://en.wikipedia.org/wiki/Freedom_of_information_in_the_United_States">
					generally public record</a>.
			</p>
		</GridItem>
		<GridItem component="FlexContainer">
			<a href="https://data-sources.pdap.io/" class="pdap-button-primary">Search our database</a>
			<p>If you have a question to answer, we may already know about helpful data in your area.</p>
		</GridItem>
		<GridItem component="FlexContainer">
			<a href="https://airtable.com/shrbFfWk6fjzGnNsk" class="pdap-button-primary"
				>Make a request</a
			>
			<p>If we're missing something, or if you're just not a data person, we can help.
				When you ask questions, our database gets stronger.</p>
		</GridItem>
		<GridItem component="FlexContainer">
			<a href="https://docs.pdap.io/api/introduction" class="pdap-button-primary">Use our API</a>
			<p>If you'd like to access our data programmatically.</p>
		</GridItem>
	</GridContainer>

	<section>
		<GridContainer :columns="1">
			<GridItem component="h2">How our data is used</GridItem>
			<GridItem component="p"
				>We serve as a “data help desk”, where people can use our tools to answer
				questions.</GridItem
			>
			<GridItem component="p">
				Police in the United States are decentralized, and managed at the municipal and county
				level. By organizing locally and working backward from community needs, we ensure our work
				is impactful and relevant to the people who use data about the police every day.
			</GridItem>
		</GridContainer>

		<GridContainer :columns="2">
			<GridItem component="h2" :span-column="2"
				><i class="fa fa-book"></i> Sharing access to Traffic Stop data</GridItem
			>
			<GridItem component="p" :span-column="2"
				>What is the reality of traffic enforcement in Pittsburgh, given changed policies about
				enforcing minor traffic violations?</GridItem
			>
			<GridItem component="p">
				Several independent groups in Pittsburgh were trying to answer this question, so we
				requested data from the City of Pittsburgh and
				<a href="https://data-sources.pdap.io/search/traffic%20stops/pittsburgh"
					>shared it in our database</a
				>. Among other things, it led to this article in Public Source.
			</GridItem>
			<GridItem component="p">
				To see traffic stop data from other places,
				<a href="https://data-sources.pdap.io/search/traffic/all">start here</a>.
			</GridItem>
			<GridItem component="h2" :span-column="2"
				><i class="fa fa-phone"></i> Preserving Calls for Service data in Oakland CA</GridItem
			>
			<GridItem component="p" :span-column="2"
				>How are police in Oakland, CA dispatched to address community needs?</GridItem
			>
			<GridItem component="p">
				Calls for police service were published by the city, but only stayed online for 1&ndash;2
				days. We made a
				<a href="https://github.com/Police-Data-Accessibility-Project/github-actions-demo/tree/main"
					>web scraper</a
				>
				to automatically collect the data daily, for free.
			</GridItem>
			<GridItem component="p">
				We archived data for 3 months before their site went down, and helped a journalist with her
				research. Our open-source work is a model for future zero-budget research projects.
			</GridItem>
			<GridItem component="p">
				Calls for police service were published by the city, but only stayed online for 1&ndash;2
				days. We made a
				<a href="https://github.com/Police-Data-Accessibility-Project/github-actions-demo/tree/main"
					>web scraper</a
				>
				to automatically collect the data daily, for free.
			</GridItem>
			<GridItem component="p">
				We archived data for 3 months before their site went down, and helped a journalist with her
				research. Our open-source work is a model for future zero-budget research projects.
			</GridItem>
		</GridContainer>

		<GridContainer>
			<GridItem component="h2" :span-column="2"
				><i class="fa fa-sitemap"></i> Consolidating records about the Allegheny County
				Jail</GridItem
			>
			<GridItem component="p" :span-column="2">
				This facility has faced mounting scrutiny, as dozens of people have died in custody in
				recent years.
			</GridItem>
			<GridItem component="p"
				>How many people are in jail because they cannot afford bail? <br
			/></GridItem>
			<GridItem component="p">
				<a href="https://data-sources.pdap.io/data-sources/recn5peRrGMNEksXI"
					>County jail holding status dashboard</a
				>
			</GridItem>
			<GridItem component="p"
				>How often are people placed in solitary confinement after it was banned in 2022?</GridItem
			>
			<GridItem component="p">
				<a href="https://data-sources.pdap.io/data-sources/recabQ04zvUH4RKQ0"
					>Segregated Housing reports</a
				>
			</GridItem>
			<GridItem component="p"
				>Do people in the jail receive medical attention when they request it?</GridItem
			>
			<p>
				<a href="https://data-sources.pdap.io/data-sources/recPdBv9M0QhyKKZN">2021</a> &
				<a href="https://data-sources.pdap.io/data-sources/recFUDsFf9RPpCZX6">2022</a> surveys of
				incarcerated population
			</p>
			<GridItem component="p"
				>Has the city documented any health code violations at the Allegheny County Jail?</GridItem
			>
			<GridItem component="p">
				<a href="https://data-sources.pdap.io/search/health%20/allegheny"
					>Inspection records from the Health Department</a
				>
			</GridItem>
		</GridContainer>
	</section>
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
