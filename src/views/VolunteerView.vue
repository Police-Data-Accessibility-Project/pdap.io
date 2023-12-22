<template>
	<GridContainer class="px-4 md:px-8" component="section" :columns="3">
		<GridItem component="h1" :span-column="3">Volunteer</GridItem>
		<GridItem component="div" :span-column="3">
			<p>
				Most requests are for help <strong>answering questions about local police systems.</strong>
				No matter what your level of experience, you can be a valuable contributor! 
			</p>
		</GridItem>
		<GridItem component="h2" :span-column="3">Volunteering for data requests</GridItem>
		<GridItem class="text-xl hyphens-auto" lang="en">
			<h3><i class="fa fa-map-o" aria-hidden="true"></i> Locate sources</h3>
			<p>
				Some public records are already online, waiting to be classified and used to answer questions.
				You could find data sources to track, making it more accessible to everyone.
			</p>
		</GridItem>
		<GridItem class="text-xl hyphens-auto" lang="en">
			<h3><i class="fa fa-eye-slash"></i> Research</h3>
			<p>
				Many useful public records can't be easily found online. We work with local experts and request records from
				relevant agencies, making it easier to answer important questions.
			</p>
		</GridItem>
		<GridItem class="text-xl hyphens-auto" lang="en">
			<h3><i class="fa fa-file-code-o"></i> Code</h3>
			<p>
				Everything you see is open source, built by a small team of volunteers and staff. 
				To contribute code for infrastructure projects, check out our
				<a href="https://github.com/orgs/Police-Data-Accessibility-Project/projects/25">
					Good First Issues
				</a> in GitHub.
			</p>
		</GridItem>
	</GridContainer>

	<FlexContainer component="section">
		<p>
			This work is multidisciplinary, and beginner-friendly.
			The two most important skills are <strong>collaboration</strong> and <strong>persistence</strong>.
		</p>
		<p>
			<a href="https://airtable.com/app473MWXVJVaD7Es/shrS4PAZTYVT1zSq8">
			<i class="fa fa-external-link"></i> Use this form</a>
			or email <a href="mailto:operations@pdap.io">operations@pdap.io</a>
			to volunteer or learn more about a request.
		</p>
		<div class="airtable-box">
			<iframe
				class="airtable-embed"
				src="https://airtable.com/embed/app473MWXVJVaD7Es/shrpwCQ0z5hOFQuOV?backgroundColor=gray&viewControls=on"
				frameborder="0"
				onmousewheel=""
				width="100%"
				height="850"
				style="background: transparent; border: 1px solid #512a4f"
			></iframe>
		</div>
	</FlexContainer>
</template>

<script>
import { FlexContainer, GridContainer, GridItem } from 'pdap-design-system';
import HelpTextIcon from '@/components/HelpTextIcon.vue';

export default {
	name: 'VolunteerView',
	components: {
		FlexContainer,
		GridContainer,
		GridItem,
	},
};
</script>