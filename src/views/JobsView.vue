<template>
	<FlexContainer class="px-4 md:px-8" component="section">
		<div class="container">
			<div>
				<h1>Jobs at PDAP</h1>
				<h3>Open positions</h3>
				<a href="#regional-data-experts">Regional data experts</a><br />
				<a href="#software-development-opportunities">Software development opportunities</a><br />
				<h3>How to apply</h3>
				<p>
					Send an email to <a href="mailto:operations@pdap.io">operations@pdap.io</a>. Please
					include a resume, personal website, LinkedIn profile, GitHub profile, or combination of
					these.
				</p>
				<div class="text-lg">
					<h3>Context</h3>
					<p>
						Our mission is to help people locate, understand, and share public records about every
						U.S. police system.
					</p>
					<p>
						Our project has been in motion since 2020, powered by volunteers for the first two
						years. We put down roots in Pittsburgh as a non-profit and received grant funding in
						July of 2022. Our second funded year begins in July 2023.
					</p>
					<h3>Equal Opportunity Employment</h3>
					<p>
						We are an equal opportunity employer, and make hiring decisions based on merit. Valuing
						diversity and inclusiveness will help us build the strongest possible community and
						project.
					</p>
					<p>
						<strong
							>People who have been impacted by the criminal legal system are especially encouraged
							to apply.</strong
						>
					</p>
				</div>
				<div class="top-45">
					<h2 id="regional-data-experts">Regional Data Experts</h2>
					<h4><i class="fa fa-info-circle"></i> Remote, temporary</h4>
					<p>
						Each police jurisdiction has different data practices. We work best when we have a PDAP
						ally embedded in a county or city data ecosystem, using our tools to track Data Sources,
						Volunteers, and Requests in the region.
					</p>
					<p>
						We are looking for people with a personal interest in the transparency of their local
						legal system.
					</p>
					<div class="text-lg">
						<h3>Responsibilities</h3>
						<ul>
							<li>
								Check our database for completion and accuracy of the Agencies in your county.
							</li>
							<li>
								Perform internet research for existing Data Sources in your county, adding them to
								our database.
							</li>
							<li>
								Do in-person, phone, or email research with local experts like records clerks,
								attorneys, journalists, activists, and municipal employees to uncover more obscure
								Data Sources.
							</li>
							<li>
								Identify topical areas of interest in local community, capturing Requests for data
								and sharing our database where helpful.
							</li>
							<li>
								When public records are not published online, make FOIA requests and
								otherwise work with local records departments to get data published.
							</li>
							<li>
								Capture and respond to Requests in your region, either by connecting Volunteers or
								sharing relevant data.
							</li>
						</ul>
						<h3>Time commitment</h3>
						<p>
							Flexible. There's more work to do up front for the initial research, and a slow
							trickle of hours for maintenance and coordination over time. We will agree on a
							schedule of work and check-ins which fits your availability.
						</p>
						<h3>Compensation</h3>
						<p>$25 per hour minimum.</p>
						<h3>Characteristics of strong applicants</h3>
						<ul>
							<li>Understands our mission, and is excited about contributing to it.</li>
							<li>Demonstrates proficiency in web research and navigation with a browser.</li>
							<li>
								Is comfortable reaching out to local experts and municipal offices in-person and
								remotely for research.
							</li>
							<li>
								Has miscellaneous additional skills related to this work: data analysis, public
								policy, web crawling, research, etc.
							</li>
						</ul>
					</div>
				</div>
				<div class="top-45">
					<h2 id="software-development-opportunities">Software development opportunities</h2>
					<h4><i class="fa fa-info-circle"></i> Remote, temporary</h4>
					<p>
						We're not actively interviewing for these roles, but will keep your resume on file for
						future work.
					</p>
					<p>
						These are flexible short-term fellowships, internships, or contracts. They may last a
						few weeks, up to 6 months depending on the project and your availability.
					</p>
					<p>
						We are looking for skilled applicants of any experience level to work on our software
						projects. During an initial interview, we will discuss which issues on
						<a href="https://github.com/orgs/Police-Data-Accessibility-Project/projects/21/views/2"
							>the roadmap</a
						>
						seem like a good fit for your skills.
					</p>
					<p>When you apply, please let us know if you're interested in a particular project.</p>
					<h3>Responsibilities</h3>
					<div class="text-lg">
						<ul>
							<li>Submit code toward one or more of the issues on the roadmap.</li>
							<li>Write tests for new code, and help with documentation.</li>
						</ul>
						<h3>Time commitment</h3>
						<p>
							We will agree on a schedule of work and check-ins which fits your availability for the
							duration of each project.
						</p>
						<h3>Compensation</h3>
						<p>
							$25 per hour minimum. Our annual budget for this work is $50,000&ndash;100,000, scaled
							based on experience and time commitment.
						</p>
						<h3>Characteristics of strong applicants</h3>
						<ul>
							<li>Can exhibit basic knowledge of Python.</li>
							<li>Feels excited about contributing to our mission.</li>
							<li>Is comfortable with feedback and iteration.</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</FlexContainer>
</template>

<script>
import { FlexContainer } from 'pdap-design-system';

export default {
	name: 'JobsView',
	components: {
		FlexContainer,
	},
};
</script>
