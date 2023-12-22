<template>
	<GridContainer class="px-4 md:px-8" component="section" :columns="2">
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
			<QuickSearchForm />
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