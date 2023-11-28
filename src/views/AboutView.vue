<template>
	<GridContainer component="section" :columns="1">
		<GridItem component="h1">About</GridItem>
		<GridItem component="h2">Contact</GridItem>
		<GridItem component="p">
			Email us at <a href="mailto:contact@pdap.io">contact@pdap.io</a> or
			<a href="https://discord.gg/wMqex8nKZJ">join the Discord</a> to get in touch. We also have a
			<a href="https://newsletter.pdap.io">newsletter</a>.
		</GridItem>
		<GridItem component="FlexContainer">
			<h2>People</h2>
			<p>
				Every local police system has people studying it&mdash;this is the community that created
				PDAP.
			</p>
			<p>
				We're headquartered in Pittsburgh, PA. We have paid staff and volunteers from around the
				United States and beyond.
			</p>
			<p>
				The board is
				<a href="https://www.linkedin.com/in/eddie-johnbrown/">Eddie&nbsp;Brown</a>,
				<a href="https://www.linkedin.com/in/wakin/">Alec&nbsp;Akin</a>, and
				<a href="https://www.linkedin.com/in/joshlintag/">Josh&nbsp;Lintag</a>.
			</p>
			<p>
				Our Executive Director is
				<a href="https://www.linkedin.com/in/josh-chamberlain/">Josh Chamberlain</a>.
			</p>
		</GridItem>
		<GridItem component="FlexContainer" :span-column="1">
			<h2>Funding</h2>
			<p>
				We are proud to receive generous support from
				<a href="https://www.heinz.org/">The Heinz Endowments</a>, early believers in our vision in
				2022 who renewed their grant in 2023.
			</p>
			<p>
				We are also grateful for the financial and advisory support of
				<a href="https://ye.gg/">Gabriel Weinberg</a>.
			</p>
		</GridItem>
	</GridContainer>
	<GridContainer component="section" :columns="1">
		<GridItem component="h2">Operating principles</GridItem>
		<GridItem component="p">
			We create tools to help people work with local data: police systems are locally operated, and
			records need to be in their original context to be understood.
		</GridItem>
		<GridItem component="p">
			We are not creating a massive, interoperable database. This data is most useful in a local
			context, and this is a defense mechanism against aggregating data about criminalized people.
		</GridItem>
		<GridItem component="p">
			The people impacted by a local agency know best which public records are important and how
			they should be accessed.
		</GridItem>
		<GridItem component="p">
			We are only interested in solutions which could survive the collapse of our organization. Our
			work is open-source, and our planning is transparent.
		</GridItem>
	</GridContainer>
	<GridContainer component="section" :columns="2">
		<GridItem component="h2" :span-column="2">Frequently Asked Questions</GridItem>
		<GridItem component="h3">What kind of data do you collect?<br /></GridItem>
		<GridItem component="p">
			Anything published by or about a criminal legal system agency: courts, jails, and law
			enforcement (police). You can read more about
			<a href="https://docs.pdap.io/activities/data-sources/what-is-a-data-source"
				>what a Data Source is</a
			>
			in our docs.<br />
		</GridItem>
		<GridItem component="h3">Who is this data for?<br /></GridItem>
		<GridItem component="p">Everybody! Public records are for all of us.</GridItem>
		<GridItem component="h3">Why are you different from police watchdog groups?<br /></GridItem>
		<GridItem component="p">
			Our activism is data collection and accessibility. We aren't targeting "bad apples." We're
			documenting local systems for the benefit of anyone who believes they are worth studying.<br />
		</GridItem>
		<GridItem component="h3">Is this legal?</GridItem>
		<GridItem component="p">
			Yes. We're consolidating public information, in accordance with
			<a href="https://docs.pdap.io/meta/legal">established legal precedents</a>.<br />
		</GridItem>
		<GridItem component="h3">Are you affiliated with a political party?<br /></GridItem>
		<GridItem component="p">
			No. Our only motivation is to provide better access to public records in an age of
			disinformation. Our members have diverse perspectives and goals for police institutions, but
			we are united by the common goal of transparency.<br />
		</GridItem>
	</GridContainer>
</template>

<script>
import { FlexContainer, GridContainer, GridItem } from 'pdap-design-system';

export default {
	name: 'DataView',
	components: {
		FlexContainer,
		GridContainer,
		GridItem,
	},
};
</script>

<style scoped>
h3.pdap-grid-item {
	margin-top: 0;
}
</style>
