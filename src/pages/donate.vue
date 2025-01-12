<template>
  <section
    class="pdap-grid-container pdap-grid-container-columns-2 px-4 md:px-8 mb-12"
  >
    <div class="col-span-full">
      <h1>Donate to PDAP</h1>
      <p class="col-span-full">
        Thank you for your interest in helping our mission!
      </p>
    </div>
    <h2 class="col-span-full mt-0">2025 General Support fund</h2>
    <div class="text-lg">
      <iframe
        src="https://donorbox.org/embed/2025-general-support?default_interval=o"
        name="donorbox"
        allowpaymentrequest="allowpaymentrequest"
        seamless="true"
        frameborder="0"
        scrolling="no"
        height="770px"
        width="100%"
        style="max-width: 500px; min-width: 310px; max-height: none !important"
        allow="payment"
      />
      <p>PDAP is a non-profit, so your donations may be tax deductible.</p>

      <h3 class="pt-4">Send a check</h3>
      <p>
        Police Data Accessibility Project Inc.
        <br />
        239 Fourth Avenue, Suite 1401 #3180
        <br />
        Pittsburgh, PA 15222
      </p>
      <h3 class="pt-4">Donation match</h3>
      <p>
        If your employer offers a donation match, submit your receipt to your
        employer and have them reach out to
        <a href="mailto:operations@pdap.io">operations@pdap.io</a>
        .
      </p>
    </div>
    <div class="pdap-flex-container text-lg">
      <h3>We can't fix what we can't measure.</h3>
      <p>
        The ability of police systems to impact people's lives demands a higher
        degree of scrutiny regarding their fairness. Right now, it is hard to
        answer the most basic questions about most police agencies.
      </p>
      <p>
        We work toward better shared access to data about our police system.
        This is the foundation of any research, advocacy, journalism,
        accountability, or reform.
      </p>
      

      <!-- TODO: uncomment this when we figure out how to get donorbox data into the browser because they do not have a solution for this 🙄 -->
      <!-- <h3 class="pt-4">Our Donors</h3>
			<p>
				We have received
				<strong>${{ amount }}</strong>
				from
				<strong>${{ donorCount }}</strong>
				individual donors since January 9, 2023.
			</p> -->
      <h3 class="pt-4">How we spend money</h3>
      <p>85% goes toward our program.</p>
      <p>15% goes toward operations.</p>
      <h3 class="pt-4">How we spend our time</h3>
      <ul class="list-disc list-inside">
        <li>
          Helping people find data and answer questions about local criminal
          legal systems.
        </li>
        <li>
          Connecting skilled volunteers and collaborators with impactful
          projects.
        </li>
        <li>
          Sharing best practices for publishing data with people who work in
          local government.
        </li>
      </ul>
    </div>
  </section>
</template>
