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
				<strong>higher degree of oversight.</strong>
			</p>
		</GridItem>
		<GridItem class="border-brand-wine" :span-column="2">
			<h3>Search our database</h3>
			<!--Replace this with quick search form-->
			<Form :schema="formSchema" :on-submit="handleSubmit" id="quick-search" name="data-request-form">
					<Button intent="primary" type="submit">Search Data Sources</Button>
			</Form>
			<!--Replace this with quick search form-->
		</GridItem>
		<GridItem>
			<a class="pdap-button-secondary" href="https://airtable.com/shrbFfWk6fjzGnNsk">
				Make a request
			</a>
		</GridItem>
		<GridItem>
			<RouterLink class="pdap-button-secondary" to="/data">
				Learn about the data
			</RouterLink>
		</GridItem>
		<GridItem component="h3" :span-column="2">How it leads to better systems</GridItem>
		<GridItem>
			<div>
				<i class="fa fa-asterisk"></i>
				<p>
					Our network of experts and volunteers uses our resource kit to turn records into data,
					then analyze the data to create information.
				</p>
				<a
					class="pdap-button-primary"
					href="https://airtable.com/app473MWXVJVaD7Es/shrS4PAZTYVT1zSq8"
				>
					Join the community
				</a>
			</div>
		</GridItem>
		<GridItem class="right">
			<div>
				<i class="fa fa-repeat"></i>
				<p>
					As we help people answer questions, our database grows. Eventually, it will help us
					document all 20,000+ police agencies in the United States.
				</p>
				<a class="pdap-button-primary" href="https://airtable.com/shrbFfWk6fjzGnNsk">
					Get the newsletter
				</a>
			</div>
		</GridItem>
	</GridContainer>
</template>

<script>
import { Button, Form, FlexContainer, GridContainer, GridItem } from 'pdap-design-system';

export default {
	name: 'HomeView',
	components: {		
		Button,
		Form,
		FlexContainer,
		GridContainer,
		GridItem,
	},
	data() {
    return {
      formSchema: [
        {
          id: 'searchTerm',
          name: 'searchTerm',
          label: 'Type of data',
          type: 'text',
          placeholder: 'A keyword like "complaints" or "all"',
          value: '',
		  validators: {
            minLength: {
              value: 3
            },
          },
        },
        {
          id: 'searchJurisdiction',
          name: 'searchJurisdiction',
          label: 'Area or jurisdiction',
          type: 'text',
          placeholder: 'e.g. Allegheny County or Louisiana',
          value: '',
          validators: {
            minLength: {
              value: 3
            },
          },
        }
      ]
    }
  },
  methods: {
    handleSubmit: async function(data) {
      await doRequestStuff(data);
      this.$router.push('/')
    }
  },
};
</script>