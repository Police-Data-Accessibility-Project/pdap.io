<template>
	<GridContainer class="px-4 md:px-8 mb-12" component="section" :columns="2">
		<GridItem component="h1" :span-column="2">Donate to PDAP</GridItem>
		<GridItem component="p" :span-column="2"
			>Thank you for your interest in helping our mission!</GridItem
		>
		<GridItem component="div" class="text-lg">
				<iframe
					src="https://donorbox.org/embed/pdap"
					name="donorbox"
					allowpaymentrequest="allowpaymentrequest"
					seamless
					frameborder="0"
					scrolling="no"
					ref="iframe"
					height="700px"
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
		</GridItem>
		<GridItem component="FlexContainer" class="text-lg">
			<h3 class="mt-0">We can't fix what we can't measure.</h3>
			<p>
				The ability of the criminal legal system to impact people's lives demands a higher 
				degree of scrutiny regarding its fairness. 
				Right now, it is hard to answer the most basic questions about most police agencies.
			</p>
			<p>
				We work toward better shared access to data about our police system. 
				This is the foundation of any research, advocacy, journalism, accountability, 
				or reform.
			</p>
			<h3>Testimonials</h3>
			<div class="p-4 my-2 mx-0 border-2 border-solid border-brand-wine border-opacity-20">
				<p>
					“PDAP's work was invaluable in helping us find and access data we wouldn't have been able
					to otherwise.”
				</p>
				<p class="italic mb-0">
					&mdash;Dr. Jesse Wozniak, Director of Law & Public Policy at the
					<a href="https://apa-pgh.org/">Alliance for Police Accountability</a>
				</p>
			</div>
			<div class="p-4 my-2 mx-0 border-2 border-solid border-brand-wine border-opacity-20">
				<p>
					“PDAP's feedback helped us revise our published data to be more beneficial to the public.”
				</p>
				<p class="italic mb-0">
					&mdash;Philip Lukens, Chief of Police in
					<a href="https://www.cityofalliance.net/186/Police">Alliance, NE</a>
				</p>
			</div>
			<div class="p-4 my-2 mx-0 border-2 border-solid border-brand-wine border-opacity-20">
				<p>
					“PDAP provides data necessary to understand how police use-of-force incidents are
					processed in the courts, which reveals whether legal accountability mechanisms actually
					work on-the-ground.”
				</p>
				<p class="italic mb-0">
					&mdash;<a href="https://www.kylabourne.net/">Dr. Kyla Bourne</a>, UC Berkeley
				</p>
			</div>
			<h3>How we spend money</h3>
			<p>85% goes toward our program.</p>
			<p>15% goes toward operations.</p>
			<h3>How we spend our time</h3>
			<ul class="list-disc list-inside">
				<li>Helping people find data and answer questions about local criminal legal systems.</li>
				<li>Connecting skilled volunteers and collaborators with impactful projects.</li>
				<li>
					Sharing best practices for publishing data with people who work in local government.
				</li>
			</ul>
		</GridItem>
	</GridContainer>
</template>

<script>
import { FlexContainer, GridContainer, GridItem } from 'pdap-design-system';

export default {
	name: 'DonateView',
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
