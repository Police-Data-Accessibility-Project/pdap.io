<template>
	<GridContainer class="px-4 md:px-8" component="section" :columns="1">
		<GridItem component="h1">About</GridItem>
		<GridItem component="h2">Contact</GridItem>
		<GridItem component="p">
			Email us at <a href="mailto:contact@pdap.io">contact@pdap.io</a> or
			<a href="https://discord.gg/wMqex8nKZJ">join the Discord</a> to get in touch.
		</GridItem>
		<GridItem component="FlexContainer">
			<h2>People</h2>
			<p>
				Every local police system has people studying it&mdash;that's how most of us found this project. 
				Our community includes anyone impacted by policing: 
				residents, journalists, activists, researchers, municipal employees.
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
			<p>
				Our Lead Software Engineer is <a href="https://www.linkedin.com/in/maxachis/">Max Chis</a>.
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
	<GridContainer component="section" class="mb-12" :columns="2">
		<GridItem component="h2" :span-column="2">Frequently Asked Questions</GridItem>
		<GridItem component="h3">What makes you experts?</GridItem>
		<GridItem component="p">We have done thousands of hours of user research with people
			who use police data. If you have feedback to share, email 
			<a href="mailto:contact@pdap.io">contact@pdap.io</a>.</GridItem>
		<GridItem component="h3">What kind of data do you collect?<br /></GridItem>
		<GridItem component="div">
			<p>
			Anything published by or about a criminal legal system agency: courts, jails, and law
			enforcement (police). You can read more about
			<a href="https://docs.pdap.io/activities/data-sources/what-is-a-data-source"
				>what a Data Source is</a
			>
			in our docs.</p>
			<p>
				We are not creating a massive, interoperable database. 
				This is a defense mechanism against aggregating data about criminalized people.
			</p>
		</GridItem>
		<GridItem component="h3">Who is this data for?<br /></GridItem>
		<GridItem component="p">Everybody! Public records are for all of us. We are only interested in solutions which could survive the collapse of our organization. Our
			work is open-source, and our planning is transparent.</GridItem>
		<GridItem component="h3">Why are you different from police watchdog groups?<br /></GridItem>
		<GridItem component="p">
			Our activism is data collection and accessibility. We document systems, not "bad apples." 
		</GridItem>
		<GridItem component="h3">Is this legal?</GridItem>
		<GridItem component="p">
			Yes. We're consolidating public information, in accordance with
			<a href="https://docs.pdap.io/meta/operations/legal">established legal precedents</a>.<br />
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
	name: 'AboutView',
	components: {
		FlexContainer,
		GridContainer,
		GridItem,
	},
};
</script>
