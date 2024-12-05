<template>
	<section class="pdap-grid-container pdap-grid-container-columns-2 px-4 md:px-8 mb-12">
		<h1 class="col-span-full">Donate to PDAP</h1>
		<p class="col-span-full"
			>Thank you for your interest in helping our mission!</p
		>
		<h2 class="col-span-full">2025 General Support fund</h2>
		<div class="text-lg">
			<iframe 
				src="https://donorbox.org/embed/2025-general-support?default_interval=o" 
				name="donorbox" 
				allowpaymentrequest="allowpaymentrequest" 
				seamless="seamless" 
				frameborder="0" 
				scrolling="no" 
				height="900px" 
				width="100%" 
				style="max-width: 500px; 
				min-width: 310px; 
				max-height:none!important" 
				allow="payment">
			</iframe>
				<p>PDAP is a non-profit, so your donations may be tax deductible.</p>
				<br>
				<h3>Send a check</h3>
			<p>
				Police Data Accessibility Project Inc. <br />239 Fourth Avenue, Suite 1401 #3180
				<br />Pittsburgh, PA 15222
			</p>
			<br>
			<h3>Donation match</h3>
			<p>
				If your employer offers a donation match, submit your receipt to your employer and have
				them reach out to <a href="mailto:operations@pdap.io">operations@pdap.io</a>.
			</p>
		</div>
		<div class="pdap-flex-container text-lg" style="padding:0 32 32 32">
			<h3>We can't fix what we can't measure.</h3>
			<p>
				The ability of the criminal legal system to impact people's lives demands a higher 
				degree of scrutiny regarding its fairness. 
				Right now, it is hard to answer the most basic questions about most police agencies.
			</p>
			<p>
				We work toward better shared access to data about our police system. 
				This is the foundation of any research, advocacy, journalism, accountability, 
				or reform.
			</p>
			<br>
			<h3>Our Donors</h3>
			<p>
				Received <strong>${{ amount }}</strong> from <strong>${{ donorCount }}</strong> donors since January 9, 2023.
			</p>
			<br>
			<h3>Testimonials</h3>
			<div class="p-4 my-2 mx-0 border-2 border-solid border-brand-wine border-opacity-20">
				<p>
					“PDAP's work was invaluable in helping us find and access data we wouldn't have been able
					to otherwise.”
				</p>
				<p class="italic mb-0">
					&mdash;Dr. Jesse Wozniak, Director of Law & Public Policy at the
					<a href="https://apa-pgh.org/">Alliance for Police Accountability</a>
				</p>
			</div>
			<div class="p-4 my-2 mx-0 border-2 border-solid border-brand-wine border-opacity-20">
				<p>
					“PDAP's feedback helped us revise our published data to be more beneficial to the public.”
				</p>
				<p class="italic mb-0">
					&mdash;Philip Lukens, Chief of Police in
					<a href="https://www.cityofalliance.net/186/Police">Alliance, NE</a>
				</p>
			</div>
			<div class="p-4 my-2 mx-0 border-2 border-solid border-brand-wine border-opacity-20">
				<p>
					“PDAP provides data necessary to understand how police use-of-force incidents are
					processed in the courts, which reveals whether legal accountability mechanisms actually
					work on-the-ground.”
				</p>
				<p class="italic mb-0">
					&mdash;<a href="https://www.kylabourne.net/">Dr. Kyla Bourne</a>, UC Berkeley
				</p>
			</div>
			<br>
			<h3>How we spend money</h3>
			<p>85% goes toward our program.</p>
			<p>15% goes toward operations.</p>
			<br>
			<h3>How we spend our time</h3>
			<ul class="list-disc list-inside">
				<li>Helping people find data and answer questions about local criminal legal systems.</li>
				<li>Connecting skilled volunteers and collaborators with impactful projects.</li>
				<li>
					Sharing best practices for publishing data with people who work in local government.
				</li>
			</ul>
		</div>
	</section>
</template>

<script>

const donorbox_api_key = import.meta.env.VITE_DONORBOX_API_KEY;
const donorbox_email = import.meta.env.VITE_DONORBOX_EMAIL;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${donorbox_api_key}`, // Assuming the API uses Bearer tokens
};

export default {
  name: "DonateView",
  data: () => ({
    amount: 0,
    donorCount: 0,
  }),
  mounted: async function () {
    try {
      const response = await fetch("https://donorbox.org/api/v1/donations", {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(`${donorbox_email}:${donorbox_api_key}`)}`, // Encode email and API key
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("API error:", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      console.log(data); // Debugging: Inspect the API response

      // Replace these keys with actual ones from the API response
      this.amount = data.total_donations || 0;
      this.donorCount = data.total_donors || 0;
    } catch (error) {
      console.error("Error fetching donation data:", error);
    }
  },
};
</script>

<style scoped>
h3.pdap-grid-item {
	margin-top: 0;
}
</style>
