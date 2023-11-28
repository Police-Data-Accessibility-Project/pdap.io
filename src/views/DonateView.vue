<template>
	<GridContainer :columns="2">
		<GridItem component="h1" :span-column="2">How to contribute</GridItem>
		<GridItem component="p" :span-column="2"
			>Thank you for your interest in helping our mission!</GridItem
		>
		<GridItem component="FlexContainer">
			<h2>Donate</h2>
			<div class="bottom-20 small">
				<iframe
					src="https://donorbox.org/embed/pdap"
					name="donorbox"
					allowpaymentrequest="allowpaymentrequest"
					seamless
					frameborder="0"
					scrolling="no"
					ref="iframe"
					height="900px"
					width="100%"
				></iframe>
				<p>PDAP is a non-profit, so your donations may be tax deductible.</p>
				<h3>Send a check</h3>
				<p>
					Police Data Accessibility Project Inc. <br />239 Fourth Avenue, Suite 1401 #3180
					<br />Pittsburgh, PA 15222
				</p>
				<h3>Donation match</h3>
				<p>
					If your employer offers a donation match, submit your receipt to your employer and have
					them reach out to <a href="mailto:operations@pdap.io">operations@pdap.io</a>.
				</p>
				<h3>How we spend money</h3>
				<p>85% goes toward our program.</p>
				<p>15% goes toward operations.</p>
			</div>
		</GridItem>

		<GridItem component="FlexContainer" class="small">
			<h3 class="top-0">We can't fix what we can't measure.</h3>
			<p>
				The ability of the criminal legal system to impact people's lives demands a higher degree of
				scrutiny regarding its fairness.
			</p>
			<p>
				Access to data about our police system is the foundation of any research, advocacy,
				journalism, and accountability, or reform.
			</p>
			<h3>Testimonials</h3>
			<div class="boxed">
				<p class="quote">
					“PDAP's work was invaluable in helping us find and access data we wouldn't have been able
					to otherwise.“
				</p>
				<p class="citation">
					&mdash;Dr. Jesse Wozniak, Director of Law & Public Policy at the
					<a href="https://apa-pgh.org/">Alliance for Police Accountability</a>
				</p>
			</div>
			<div class="boxed">
				<p class="quote">
					“PDAP’s feedback helped us revise our published data to be more beneficial to the public.“
				</p>
				<p class="citation">
					&mdash;Philip Lukens, Chief of Police in
					<a href="https://www.cityofalliance.net/186/Police">Alliance, NE</a>
				</p>
			</div>
			<div class="boxed">
				<p class="quote">
					“PDAP provides data necessary to understand how police use-of-force incidents are
					processed in the courts, which reveals whether legal accountability mechanisms actually
					work on-the-ground.“
				</p>
				<p class="citation">
					&mdash;<a href="https://www.kylabourne.net/">Dr. Kyla Bourne</a>, UC Berkeley
				</p>
			</div>
			<h3>How we spend our time</h3>
			<ul>
				<li>Helping people find data and answer questions about local criminal legal systems.</li>
				<li>Connecting skilled volunteers and collaborators with impactful projects.</li>
				<li>
					Sharing best practices for publishing data with people who work in local government.
				</li>
			</ul>
		</GridItem>
	</GridContainer>

	<GridContainer :columns="2">
		<GridItem component="h2" :span-column="2">Other ways to contribute</GridItem>
		<GridItem component="h3">Collect data</GridItem>
		<GridItem component="p" class="small">
			If you can use a web browser, you can contribute to our mission.
			<a href="https://docs.pdap.io">Start with the docs</a>
		</GridItem>
		<GridItem component="h3">Share your perspective</GridItem>
		<GridItem component="p" class="small">
			Have you ever downloaded public records? Do you work in local government? Do you see risks we
			should address? Reach out to <a href="mailto:contact@pdap.io">contact@pdap.io</a> or join our
			<a href="https://discord.gg/wMqex8nKZJ"> Discord</a>. We'll incorporate your feedback into our
			work.
		</GridItem>
		<GridItem component="h3">Share our work</GridItem>
		<GridItem component="p" class="small"
			>If you know anyone who might appreciate our work, please send this their way!</GridItem
		>
	</GridContainer>
</template>

<script>
import { FlexContainer, GridContainer, GridItem } from 'pdap-design-system';

export default {
	name: 'HomeView',
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
