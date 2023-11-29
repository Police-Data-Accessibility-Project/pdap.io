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

<style scoped>
h3.pdap-grid-item {
	margin-top: 0;
}
</style>

<template>
	<GridContainer component="section" :columns="3">
		<GridItem component="h1" :span-column="3">Volunteer</GridItem>
		<GridItem component="p" :span-column="3">
			Even at a local level, this project is complex and multidisciplinary. People need help, so no
			matter what your level of experience, you can be a valuable contributor! The two most
			important skills in this work are <strong>collaboration</strong> and
			<strong>persistence</strong>.
		</GridItem>
		<GridItem component="h2" :span-column="3">Types of volunteer projects</GridItem>
		<GridItem component="p" :span-column="3">
			PDAP collects questions, and shares access to data which could provide answers. Our community
			does the rest.
		</GridItem>
		<GridItem>
			<h3><i class="fa fa-institution"></i> Research</h3>
			<p>
				When records can't be found online or in our database, you could request records from
				relevant agencies to help answer research questions.
			</p>
		</GridItem>
		<GridItem>
			<h3><i class="fa fa-eye-slash" aria-hidden="true"></i> Scraping</h3>
			<p>
				Some records are online, but difficult to effectively access. To turn them into useful data,
				you could use Python to write a web scraper.
				<help-text-icon>Help!</help-text-icon>
			</p>
		</GridItem>
		<GridItem>
			<h3><i class="fa fa-file-code-o"></i> Analysis</h3>
			<p>
				With data in hand, you could work with a requestor to analyze their data and create a
				one-page data presentation with Python Notebooks or R&nbsp;Markdown files.
			</p>
		</GridItem>
		<GridItem component="p" :span-column="3">
			To contribute code for infrastructure projects, check out our
			<a href="https://github.com/orgs/Police-Data-Accessibility-Project/projects/25"
				>Good First Issues</a
			>
			in GitHub.
		</GridItem>
	</GridContainer>

	<GridContainer component="section">
		<h2>Open requests</h2>
		<p>
			You can click on a request below to see more details. If you want to volunteer or learn more
			about a specific request,
			<a href="https://airtable.com/app473MWXVJVaD7Es/shrS4PAZTYVT1zSq8">use this form</a>
			or email <a href="mailto:operations@pdap.io">operations@pdap.io</a>
			and reference the number above the request.
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
	</GridContainer>
</template>
