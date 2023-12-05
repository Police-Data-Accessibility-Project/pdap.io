<template>
	<GridContainer component="section" :columns="2">
		<GridItem :span-column="2">
			<h1 class="shout">
				We make public records about police systems more accessible to everyone.
			</h1>
			<p>
				Our vision: a world where accessible data helps us create fair government systems. We focus
				on the criminal legal system because its
				<strong>power to impact people</strong> demands a
				<strong>higher degree of&nbsp;oversight.</strong>
			</p>
		</GridItem>
		<GridItem class="border-2 border-brand-wine p-8" :span-column="2">
			<h3 class="mt-0">Search our database</h3>
			
			<QuickSearchForm></QuickSearchForm>
			
			<a class="pdap-button-secondary" href="https://airtable.com/shrbFfWk6fjzGnNsk">
				Make a request
			</a>
			<RouterLink class="pdap-button-secondary" to="/data">
				Learn about the data
			</RouterLink>
		</GridItem>
		<GridItem :span-column="2">
			<div>
				<i class="fa fa-repeat"></i>
				<p>
					Our network of experts and volunteers turns public records into data,
					and data into information.
				</p>
				<p>
					We share success stories and updates in our
					newsletter&mdash;we only write when we have updates to share.
				</p>
				<a class="pdap-button-primary" href="https://newsletter.pdap.io">
					Get the newsletter
				</a>
				<RouterLink to="/about" class="pdap-button-secondary">
					About us
				</RouterLink>
			</div>
		</GridItem>
	</GridContainer>
</template>

<script>
import { Button, Form, FlexContainer, GridContainer, GridItem, QuickSearchForm } from 'pdap-design-system';

export default {
	name: 'HomeView',
	components: {		
		Button,
		Form,
		FlexContainer,
		GridContainer,
		GridItem,
		QuickSearchForm,
	},
	data() {
    return {
      }
  },
  methods: {
  },
};
</script>