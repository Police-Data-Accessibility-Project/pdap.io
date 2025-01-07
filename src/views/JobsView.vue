<template>
	<section class="pdap-grid-container px-4 md:px-8 mb-12">
	  <div class="container">
		<div>
		  <h1>Jobs at PDAP</h1>
		  <br>
		  <h3>Open positions</h3>
		  <a href="#software-development-opportunities">Software development opportunities</a><br />
		  <br>
		  <h3>How to apply</h3>
		  <p>
			Send an email to <a href="mailto:operations@pdap.io">operations@pdap.io</a>. Please
			include a resume, personal website, LinkedIn profile, GitHub profile, or combination of
			these.
		  </p>
		  <div class="text-lg">
			<br>
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
			<br>
			<h3>Equal Opportunity Employment</h3>
			<p>
			  We are an equal opportunity employer, and make hiring decisions based on merit. Valuing
			  diversity and inclusiveness will help us build the strongest possible community and
			  project.
			</p>
			<p>
			  <strong>People who have been impacted by the criminal legal system are especially encouraged
				to apply.</strong>
			</p>
		  </div>
		  <div class="mt-12">
			<h2 id="software-development-opportunities">Software development opportunities</h2>
			<h4><FontAwesomeIcon :icon="faInfoCircle" /> Remote, temporary</h4>
			<p>
			  These are flexible short-term contracts meant to help us make progress on specific goals.
			  They may last from a few weeks, up to 6 months or more depending on the project and your availability.
			</p>
			<p>
			  We are looking for skilled applicants of any experience level to work on our software
			  projects. During an initial interview, we will discuss which issues on
			  <a href="https://github.com/orgs/Police-Data-Accessibility-Project/projects/21/views/2">the roadmap</a>
			  seem like a good fit for your skills.
			</p>
			<p>When you apply, please let us know if you're interested in a particular project.</p>
			<br>
			<h3>Responsibilities</h3>
			<div class="text-lg">
			  <ul class="list-disc list-inside">
				<li>Submit code toward one or more of the issues on the roadmap.</li>
				<li>Write tests for new code, and help with documentation.</li>
			  </ul>
			  <br>
			  <h3>Time commitment</h3>
			  <p>
				We will agree on a schedule of work and check-ins which fits your availability for the
				duration of each project.
			  </p>
			  <br>
			  <h3>Compensation</h3>
			  <p>
				$25 per hour minimum, scaled based on experience and time commitment. Our annual budget for this work is $150,000&ndash;200,000.
			  </p>
			  <br>
			  <h3>Characteristics of strong applicants</h3>
			  <ul class="list-disc list-inside">
				<li>Can exhibit basic knowledge of Python.</li>
				<li>Feels excited about contributing to our mission.</li>
				<li>Is comfortable with feedback and iteration.</li>
				<li>Has worked on software which can be used or tested somewhere.</li>
			  </ul>
			</div>
		  </div>
		</div>
	  </div>
	</section>
  </template>
  
  <script>
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
  
  export default {
	name: 'JobsView',
	components: {
	  FontAwesomeIcon
	},
	data: () => ({
		faInfoCircle
	})
  };
  </script>