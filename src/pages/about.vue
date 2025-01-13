<template>
  <section class="pdap-grid-container px-4 md:px-8">
    <h1 class="col-span-full">About</h1>
    <div class="col-span-full">
      <h2>Contact</h2>
      <p>
        Email us at
        <a href="mailto:contact@pdap.io">contact@pdap.io</a>
        or
        <a href="https://discord.gg/wMqex8nKZJ">join the Discord</a>
        to get in touch.
      </p>
      <p>
        You can also sign up for our newsletter to receive updates about our
        software and data projects. You'll be the first to be invited to create
        a PDAP account.
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
            class="h-12 text-lg px-2 gap-4 leading-normal w-full dark:bg-neutral-950 border border-neutral-500 border-solid px-3 py-2 text-[rgba(0,0,0)"
          />
          <label
            for="bd-email"
            class="max-w-[max-content] text-lg py-1 mt-0 font-medium"
          >
            Enter your email
          </label>
        </div>
        <div class="flex flex-row">
          <input
            type="submit"
            class="pdap-button-primary h-[max-content]"
            value="Sign up"
            style="margin: 0px 4px 0px 4px"
          />
          <button
            class="pdap-button-secondary h-[max-content]"
            value="Archives"
            onclick="window.open('https://newsletter.pdap.io/archive', '_blank')"
            style="margin: 0px 4px 0px 4px"
          >
            View archives
          </button>
        </div>
      </form>
    </div>
    <div class="pdap-flex-container col-span-full">
      <h2>People</h2>
      <p>
        Every local police system has people studying it&mdash;that's how most
        of us found this project. Our community includes anyone impacted by
        policing: residents, journalists, activists, researchers, and municipal
        employees.
      </p>
      <p>
        The Police Data Access Point is published by the Police Data Accessibility Project, 
				a U.S. nonprofit headquartered in Pittsburgh, PA. We have paid staff 
				and volunteers from around the United States and beyond.
      </p>

      <p>
        The board is
        <span>
          <a
            href="https://www.linkedin.com/in/eddie-johnbrown/"
            target="_blank"
            rel="noreferrer"
          >
            Eddie&nbsp;Brown,
          </a>
        </span>
        <a
          href="https://www.linkedin.com/in/wakin/"
          target="_blank"
          rel="noreferrer"
        >
          Alec&nbsp;Akin,
        </a>
        and
        <a
          href="https://www.linkedin.com/in/joshlintag/"
          target="_blank"
          rel="noreferrer"
        >
          Josh&nbsp;Lintag.
        </a>
      </p>
      <p>
        Our Executive Director is
        <a
          href="https://www.linkedin.com/in/josh-chamberlain/"
          target="_blank"
          rel="noreferrer"
        >
          Josh Chamberlain.
        </a>
      </p>
      <p>
        Our Lead Back-end Software Engineer is
        <a
          href="https://www.linkedin.com/in/maxachis/"
          target="_blank"
          rel="noreferrer"
        >
          Max Chis.
        </a>
      </p>
      <p>
        Our Lead Front-end Software Engineer is
        <a
          href="https://www.linkedin.com/in/joshuadgraber/"
          target="_blank"
          rel="noreferrer"
        >
          Joshua Graber.
        </a>
      </p>
    </div>
    <div class="pdap-flex-container col-span-full">
      <h2>Funding</h2>
      <p>
        We are proud to receive generous support from
        <a href="https://www.heinz.org/" target="_blank" rel="noreferrer">
          The Heinz Endowments,
        </a>
        early believers in our vision in 2022 who renewed their grant in 2023.
      </p>
      <p>
        We are also grateful for the financial and advisory support of
        <a href="https://ye.gg/" target="_blank" rel="noreferrer">
          Gabriel Weinberg.
        </a>
      </p>
    </div>
  </section>
  <section
    class="pdap-grid-container pdap-grid-container-columns-2 mb-12 px-4 md:px-8"
  >
    <h2 class="col-span-full">Frequently Asked Questions</h2>
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
    <div>
      <p>
        Anything published by or about a criminal legal system agency: courts,
        jails, and law enforcement (police). You can read more about
        <a
          href="https://docs.pdap.io/activities/data-sources/what-is-a-data-source"
          target="_blank"
          rel="noreferrer"
        >
          what a Data Source is
        </a>
        in our docs.
      </p>
      <p>
        We are not creating a massive, interoperable database. This is a defense
        mechanism against aggregating data about criminalized people.
      </p>
    </div>
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
        rel="noreferrer"
      >
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
      an age of disinformation. Our members have diverse perspectives and goals
      for police institutions, but we are united by the common goal of
      transparency.
      <br />
    </p>
  </section>
</template>
