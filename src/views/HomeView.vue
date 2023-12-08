<template>
	<GridContainer component="section" :columns="2">
		<GridItem :span-column="2">
			<h1 class="font-medium mt-0 text-4xl md:text-5xl md:leading-tight">
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
		<GridItem class="border-2 border-brand-gold p-4 md:p-6" :span-column="2">
			<h2 class="mt-0">Search our database</h2>
			<p class="pb-4 md:pb-8">
				If you have a question to answer, we may already know about helpful data in your area.
				<RouterLink to="/data">Learn more about the data here.</RouterLink>
			</p>
			<QuickSearchForm></QuickSearchForm>
		</GridItem>
	</GridContainer>
</template>

<script>
import { Button, Form, FlexContainer, GridContainer, GridItem, QuickSearchForm } from 'pdap-design-system';
import { RouterLink } from 'vue-router';

export default {
	name: 'HomeView',
	components: {
    Button,
    Form,
    FlexContainer,
    GridContainer,
    GridItem,
    QuickSearchForm,
    RouterLink
},
};
</script>