<template>
	<GridContainer class="px-4 md:px-8" component="section" columns="3">
		<GridItem component="h1" :span-column="3"> Data Sources </GridItem>
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
		<GridItem component="div" :span-column="3">
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
		</GridItem>
		<GridItem component="div" class="mb-12" :span-column="3">
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
