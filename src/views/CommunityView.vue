<template>
	<GridContainer class="px-4 md:px-8" component="section" :columns="3">
		<GridItem component="h1" :span-column="3">Join our community</GridItem>
		<GridItem :span-column="3">
			<p>
				To find collaborators or ask questions, join us in
				<a href="https://discord.gg/wMqex8nKZJ">Discord</a> 
				and see our activity in
				<a href="https://github.com/Police-Data-Accessibility-Project">GitHub.</a>
			</p>
			<p>
				You can also sign up below to receive occasional updates about our software and data projects.
				You'll be the first to be invited to create a PDAP account.
			</p>
			<p>
				We only write when we have updates.
			</p>
			<form
			action="https://buttondown.email/api/emails/embed-subscribe/pdap"
			method="post"
			target="popupwindow"
			onsubmit="window.open('https://newsletter.pdap.io', 'popupwindow')"
			class="grid grid-cols-1 mt-4 sm:grid-cols-2 h-[max-content] gap-4 leading-normal mb-3 w-full "
			>
				<div class="flex flex-col">
					<input 
						type="email" 
						name="email" 
						placeholder="placeholder@email.com" 
						id="bd-email"
						class="h-12 text-lg px-2 gap-4 leading-normal w-full dark:bg-neutral-950 border border-neutral-500 border-solid px-3 py-2 text-[rgba(0,0,0)" 
					/>
					<label 
						for="bd-email" 
						class="max-w-[max-content] text-lg py-1 mt-0 font-medium"
					>
						Enter your email
					</label>
				</div>
				<div class="flex flex-row">
					<input 
						type="submit" 
						class="pdap-button-primary h-[max-content]" 
						value="Sign up" 
					/>
					<button
						class="pdap-button-secondary h-[max-content]"
						value="Archives"
						onclick="window.open('https://newsletter.pdap.io/archive', '_blank')"
					>
						View archives
					</button>
				</div>
			</form>
		</GridItem>
		<GridItem component="h1" :span-column="3">Volunteer for data requests</GridItem>
		<GridItem component="div" :span-column="3">
			<p>
				Most data requests are for help <strong>answering questions about local police systems.</strong> 
				They usually come to us 
				<a href="https://airtable.com/shrbFfWk6fjzGnNsk">via this form</a>. 
			</p>
			<p>
				<a href="https://airtable.com/appcYa6x4nS7W8IR3/shrk9c5sBsBr3cdJJ">
					Use this form to volunteer</a>,
				or email 
				<a href="mailto:operations@pdap.io">
						operations@pdap.io</a>.
			</p>
			<h2><i class="fa fa-code-fork"></i> Merged Pull Requests</h2>
				<p>We have merged <strong>{{ mergeCount }} pull requests</strong> across <strong>{{ repoCount }} repositories</strong>.</p>
				<a href="https://github.com/orgs/Police-Data-Accessibility-Project/projects/25/views/1">
					<i class="fa fa-external-link"></i> Good first issues
				</a>
		</GridItem>
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
	<FlexContainer component="section" class="mb-12">
		<p>
			This work is multidisciplinary, and beginner-friendly.
			No matter what your level of experience, you can be a valuable contributor! 
			The two most important skills are <strong>collaboration</strong> and <strong>persistence</strong>.
		</p>
	</FlexContainer>
</template>

<script>
// import { FlexContainer, GridContainer, GridItem } from 'pdap-design-system';
import HelpTextIcon from '@/components/HelpTextIcon.vue';

export default {
	name: 'CommunityView',
	// components: {
	// 	FlexContainer,
	// 	GridContainer,
	// 	GridItem,
	// },
	data: () => ({
		repoCount: 0,
		mergeCount: 0,
	}),
	mounted: async function (){
			const repos = await (await fetch(`https://api.github.com/orgs/Police-Data-Accessibility-Project/repos`)).json()
			this.repoCount = repos.length;
			const merges = await (await fetch(`https://api.github.com/search/issues?q=org:Police-Data-Accessibility-Project+is:pr+is:merged`)).json()
			this.mergeCount = merges.total_count
		},
	};
</script>
