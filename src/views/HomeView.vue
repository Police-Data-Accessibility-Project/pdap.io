<template>
	<main>
		<section>
			<FlexContainer>
				<GridContainer :columns="2">
					<GridItem :span-column="2">
						<h1 class="shout">
							We make public records about police systems more accessible to everyone.
						</h1>
						<p>
							Our vision: a world where accessible data helps us create fair government systems. We
							focus on the criminal legal system because its
							<strong>power to impact people</strong> demands a
							<strong>higher degree of oversight.</strong>
						</p>
					</GridItem>
					<GridItem component="h3" :span-column="2">What we do</GridItem>
					<GridItem>
						<i class="fa fa-question"></i>
						<p>
							People* usually find us when they're trying to answer a basic question about their
							local police, courts, or jails.
						</p>
						<a class="pdap-button-primary" href="https://airtable.com/shrbFfWk6fjzGnNsk">
							Share your question
						</a>
						<p>
							*anyone impacted by policing: residents, journalists, activists, researchers,
							municipal employees
						</p>
					</GridItem>
					<GridItem>
						<i class="fa fa-map-o"></i>
						<p>
							Our database helps them get started by locating public records* needed to answer the
							question.
						</p>
						<RouterLink class="pdap-button-primary" to="/data">Explore the data</RouterLink>
						<p>
							*information about government activity is
							<a href="https://en.wikipedia.org/wiki/Freedom_of_information_in_the_United_States"
								>usually public in the United States</a
							>.
						</p>
					</GridItem>
					<GridItem component="h3" :spanColumn="2">How it leads to better systems</GridItem>
					<GridItem>
						<div>
							<i class="fa fa-asterisk"></i>
							<p>
								Our network* of experts and volunteers uses our resource kit to turn records into
								data, then analyze the data to create information.
							</p>
							<a
								class="pdap-button-primary"
								href="https://airtable.com/app473MWXVJVaD7Es/shrS4PAZTYVT1zSq8"
							>
								Join the community
							</a>
							<p>
								*people with any experience level who are interested in volunteering, collaborating,
								or receiving updates about a certain region or type of data
							</p>
						</div>
					</GridItem>
					<GridItem class="right">
						<div>
							<i class="fa fa-repeat"></i>
							<p>
								As records are located and questions are answered, our growing database can help us
								document all 20,000+ police agencies in the United States.
							</p>
							<a class="pdap-button-primary" href="https://airtable.com/shrbFfWk6fjzGnNsk">
								Get the newsletter
							</a>
							<p>We only write when we have news to share.</p>
						</div>
					</GridItem>
				</GridContainer>
			</FlexContainer>
		</section>
	</main>
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
.pdap-grid-item.right {
	padding-top: 24px;
}
</style>
