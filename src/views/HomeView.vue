<template>
	<GridContainer component="section" :columns="2">
		<GridItem :span-column="2">
			<h1 class="font-medium leading-4 mt-0 text-4xl md:text-5xl">
				Learning about our police&nbsp;systems
				starts with public data.
			</h1>
			<p>
				We envision a world where better access to public records helps us 
				create fair infrastructure for all of us. 
			</p>
			<p>
				We focus on the criminal legal system because its
				<strong>power to impact people</strong> demands a
				<strong>higher degree of&nbsp;oversight.</strong>
			</p>
		</GridItem>
		<GridItem class="border-2 border-brand-wine p-8" :span-column="2">
			<h3 class="mt-0">Search our database</h3>
			<p class="text-s">
				If you have a question to answer, we may already know about helpful data in your area.
			</p>
			<QuickSearchForm></QuickSearchForm> <!-- TODO: import it below when merged into design system -->
			<p>
				To get help or find collaborators, you can
				<a href="https://airtable.com/shrbFfWk6fjzGnNsk">make a request <i class="fa fa-external-link"></i></a>
			</p>
			<p>
				To learn about the data,
				<RouterLink to="/data">read more here</RouterLink>
			</p>
			<p>
				To contribute code or data,
				<RouterLink to="/volunteer">start here</RouterLink>
			</p>
		</GridItem>
	</GridContainer>
</template>

<script>
import { Button, Form, FlexContainer, GridContainer, GridItem, /* QuickSearchForm */ } from 'pdap-design-system';

export default {
	name: 'HomeView',
	components: {		
		Button,
		Form,
		FlexContainer,
		GridContainer,
		GridItem,
		// QuickSearchForm,
	},
};
</script>