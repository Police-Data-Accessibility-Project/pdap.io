<template>
  <main class="pdap-grid-container mb-24">
    <section class="col-span-full pdap-flex-container">
      <h1 class="col-span-full">About</h1>
      <p>
        The Police Data Access Point is published by the Police Data
        Accessibility Project, a U.S. nonprofit headquartered in Pittsburgh, PA.
        We have paid staff and volunteers from around the United States and
        beyond.
      </p>
      <p>
        In every state, county, and locality, there is a network of people
        dedicated to understanding the criminal legal system using data. This is
        our community. We are a
        <strong>national project with a local focus.</strong>
      </p>
      <p>
        Most people find this project when they go looking for data, and come up
        short. Our community includes data users and publishers, as well as
        anyone impacted by policing: residents, journalists, activists,
        researchers, and municipal employees.
      </p>
      <h2>Board</h2>
      <p>
        Our Board President,
        <a
          href="https://www.linkedin.com/in/eddie-johnbrown/"
          target="_blank"
          rel="noreferrer">
          Eddie&nbsp;Brown,
        </a>
        is a is a leader with 35+ years of public service and commercial
        business experience. He designed and led innovative Department of
        Defense programs for meeting Federal Government technology needs. He
        provides strategy expertise for organizations in every phase of
        development.
      </p>
      <p>
        Our Board Treasurer & Director of Security is
        <a
          href="https://www.linkedin.com/in/wakin/"
          target="_blank"
          rel="noreferrer">
          Alec&nbsp;Akin,
        </a>
        a cybersecurity expert with 10+ years of experience. His knowledge of
        commercial and government information systems has helped him advise PDAP
        on how third-party software can support our foundational goals and
        processes.
      </p>
      <p>
        Our Board Secretary,
        <a
          href="https://www.linkedin.com/in/joshlintag/"
          target="_blank"
          rel="noreferrer">
          Josh&nbsp;Lintag,
        </a>
        is a Senior Software Engineer and DevOps expert with 7+ years of
        experience. He helped establish the founding principles and mission of
        PDAP with self-service tools for a nascent community of volunteers.
      </p>
      <h2>Key contributors</h2>
      <p class="font-semibold text-brand-wine-200 dark:text-brand-wine-200">
        We must first acknowledge the contributions of the hundreds of
        volunteers who have contributed since 2020: they seeded our database,
        formed the non-profit organization, created proofs of concept, and kept
        the lights on in moments of uncertainty.
      </p>
      <p>
        Our Executive Director is
        <a
          href="https://www.linkedin.com/in/josh-chamberlain/"
          target="_blank"
          rel="noreferrer">
          Joshua&nbsp;Chamberlain.
        </a>
        Joshua is a user-centered design expert with 8+ years of experience with
        collaborative design processes, and serves as steward the PDAP vision.
        They have met with hundreds of requesters, experts, and people impacted
        by policing.
      </p>
      <p>
        Our Lead Back End Software Engineer is
        <a
          href="https://www.linkedin.com/in/maxachis/"
          target="_blank"
          rel="noreferrer">
          Max Chis.
        </a>
        With 8+ years of experience in programming, data engineering, web app
        development, and AI research, Max was previously the Executive Director
        of Code for Pittsburgh.
      </p>
      <p>
        Our Lead Front End Developer is
        <a
          href="https://www.linkedin.com/in/joshuadgraber/"
          target="_blank"
          rel="noreferrer">
          Joshua Graber,
        </a>
        a full stack engineer with 5 years of experience building resilient,
        accessible, scalable web applications. In addition to his non-profit
        work, Joshua has worked in the cybersecurity, higher education, and
        hospitality industries, bringing a user-centric approach to software
        development.
      </p>
      <h2>Funding</h2>
      <p>
        We are grateful for the generous financial and advisory support of
        <a href="https://ye.gg/" target="_blank" rel="noreferrer">
          Gabriel Weinberg.
        </a>
      </p>
      <p>
        We received support from
        <a href="https://www.heinz.org/" target="_blank" rel="noreferrer">
          The Heinz Endowments,
        </a>
        who funded our core staff from 2022&ndash;2024.
      </p>
      <p>
        We have primarily been funded by major grants and donations to establish
        our core programs, supplemented by individual contributions.
      </p>
      <p>
        Now that our core programs are built, we may rely more heavily on
        individual contributions for maintenance. We are open to funding our
        work through partnerships with data publishers or consumers. We will
        never charge for access to data.
      </p>
    </section>
    <section
      class="pdap-flex-container col-span-full pt-6 mt-8 border-t-[3px] border-wineneutral-100">
      <div class="col-span-full">
        <h1>Contact</h1>
        <p>
          Email us at
          <a href="mailto:contact@pdap.io">contact@pdap.io</a>
          or
          <a href="https://discord.gg/wMqex8nKZJ">join the Discord</a>
          to get in touch.
        </p>
        <p>
          You can also sign up for our newsletter to receive updates about our
          software and data projects. You'll be the first to be invited to
          create a PDAP account.
        </p>
        <h3>Newsletter</h3>
        <p>We only write when we have updates.</p>
        <form
          action="https://buttondown.email/api/emails/embed-subscribe/pdap"
          method="post"
          target="popupwindow"
          onsubmit="window.open('https://newsletter.pdap.io', 'popupwindow')"
          class="grid grid-cols-1 mt-4 sm:grid-cols-2 h-[max-content] gap-4 leading-normal mb-3 w-full">
          <div class="flex flex-col">
            <input
              id="bd-email"
              type="email"
              name="email"
              placeholder="placeholder@email.com"
              class="h-12 text-lg px-2 py-2 gap-4 leading-normal w-full dark:bg-neutral-950 border border-neutral-500 border-solid text-[rgba(0,0,0)" />
            <label
              for="bd-email"
              class="max-w-[max-content] text-lg py-1 mt-0 font-medium">
              Enter your email
            </label>
          </div>
          <div class="flex flex-row">
            <input
              type="submit"
              class="pdap-button-primary h-[max-content]"
              value="Sign up"
              style="margin: 0px 4px 0px 4px" />
            <button
              class="pdap-button-secondary h-[max-content]"
              value="Archives"
              onclick="window.open('https://newsletter.pdap.io/archive', '_blank')"
              style="margin: 0px 4px 0px 4px">
              View archives
            </button>
          </div>
        </form>
      </div>
    </section>
    <section
      class="pdap-flex-container col-span-full pt-6 mt-8 border-t-[3px] border-wineneutral-100">
      <h1 class="mb-0">Frequently Asked Questions</h1>
      <h3>What makes you experts?</h3>
      <p>
        We have done thousands of hours of user research with people who use
        police data. If you have feedback to share, email
        <a href="mailto:contact@pdap.io">contact@pdap.io.</a>
      </p>
      <h3>
        What kind of data do you collect?
        <br />
      </h3>
      <p>
        Anything published by or about a criminal legal system agency: courts,
        jails, and law enforcement (police). You can read more about
        <a
          href="https://docs.pdap.io/activities/data-sources/what-is-a-data-source"
          target="_blank"
          rel="noreferrer">
          what a Data Source is
        </a>
        in our docs.
      </p>
      <p>
        We are not creating a massive, interoperable database. This is a defense
        mechanism against aggregating data about criminalized people.
      </p>
      <h3>
        Who is this data for?
        <br />
      </h3>
      <p>
        Everybody! Public records are for all of us. We are only interested in
        solutions which could survive the collapse of our organization. Our work
        is open-source, and our planning is transparent.
      </p>
      <h3>
        Why are you different from police watchdog groups?
        <br />
      </h3>
      <p>
        Our activism is data collection and accessibility. We document systems,
        not "bad apples."
      </p>
      <h3>Is this legal?</h3>
      <p>
        Yes. We're consolidating public information, in accordance with
        <a
          href="https://docs.pdap.io/meta/operations/legal"
          target="_blank"
          rel="noreferrer">
          established legal precedents.
        </a>
        <br />
      </p>
      <h3>
        Are you affiliated with a political party?
        <br />
      </h3>
      <p>
        No. Our only motivation is to provide better access to public records in
        an age of disinformation. Our members have diverse perspectives and
        goals for police institutions, but we are united by the common goal of
        transparency.
        <br />
      </p>
    </section>
  </main>
</template>
