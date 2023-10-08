<script setup>
import sourcesSvg from "pdap-design-system/system/images/icons/sources.svg";
import scrapersSvg from "pdap-design-system/system/images/icons/scrapers.svg";
import automationSvg from "pdap-design-system/system/images/icons/automation.svg";
import standardSvg from "pdap-design-system/system/images/icons/standard.svg";
</script>

<template>
  <main>
    <div class="section">
      <div class="container">
        <div class="layout-grid grid-2">
          <div class="shout-box grid-span-2">
            <h1 class="shout">
              We make public records about police systems more accessible to
              everyone.<br />
            </h1>
            <p class="bottom-0">Accessible public data is the foundation of fair government systems. To achieve this,
              we're building a space for people to access data, share best practices, and collaborate with others.</p>
          </div>
          <div>
            <h3>Get help finding data</h3>
            <p>
              If you're looking for data, we can help! Our community has
              assembled to help each other find public records.
            </p>
            <a href="https://airtable.com/shrbFfWk6fjzGnNsk">
              <div class="button">Request data</div>
            </a>
          </div>
          <div>
            <h3>Volunteer</h3>
            <p>
              If you want to help make police records easily accessible, you can
              contribute with any experience level!
            </p>
            <a href="https://airtable.com/shrS4PAZTYVT1zSq8">
              <div class="button">Volunteer</div>
            </a>
          </div>
        </div>
        <div class="layout-grid grid-3">
          <h2 class="grid-span-3 top-45 bottom-0">What we've done so far</h2>
          <div>
            <p>
              We've made progress on the most important part of our toolkit: a
              <a href="https://docs.pdap.io/activities/data-sources">national directory of public records</a>
              about every U.S. police agency. People use it to find and share
              Data Sources.
            </p>
          </div>
          <div>
            <p>
              We've started making case studies
              <a href="https://github.com/Police-Data-Accessibility-Project/github-actions-demo">like this Calls for
                Service web scraper</a>
              by working with data users to understand their needs.
            </p>
          </div>
          <div>
            <p>
              We made a
              <a href="https://airtable.com/shr43ihbyM8DDkKx4">living database of agencies</a>
              in the criminal legal system. We're not aware of a more complete
              one.
            </p>
          </div>
        </div>
        <div class="section">
          <div>
            <div class="form">
              <h3>Get the newsletter</h3>
              <p class="small">
                We only write when there's news.
                <a href="https://newsletter.pdap.io/">View the archives here</a>.
              </p>
              <form action="https://buttondown.email/api/emails/embed-subscribe/pdap" method="post" target="popupwindow"
                onsubmit="window.open('https://buttondown.email/pdap', 'popupwindow')" style="max-width: 500px">
                <input type="email" class="input-text input" maxlength="256" name="email" id="bd-email"
                  placeholder="Your email..." />
                <input type="submit" class="button" value="Get Updates"
                  onclick="gtag_report_conversion('https://pdap.io/index.html')" />
              </form>
            </div>
            <div>
              <h3>Donate</h3>
              <p class="small">
                We're a small non-profit with ambitious goals. Every bit helps!
              </p>
              <a href="donate.html">
                <div class="button">Make a donation</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="layout-grid grid-2 top-45">
          <h2 class="grid-span-2">What does better data accessibility mean?</h2>
          <div>
            <img class="tile-icon" v-bind:src="sourcesSvg" />

            <h3>Directory of data sources</h3>
            <p>
              We're indexing police
              <a href="data-sources.html">Data Sources</a> for every agency in
              the U.S. criminal legal system.
            </p>
            <p>
              Currently, local groups use data independently. At best, we trade
              information via email and spreadsheet.
            </p>
            <p>
              We're making tools to help people organize and
              <a href="https://airtable.com/shrUAtA8qYasEaepI">share their Data Sources</a>
              so they can
              <strong>spend less time finding data and more time using it.</strong>
            </p>
          </div>
          <div>
            <img class="tile-icon" v-bind:src="scrapersSvg" />
            <h3>Scrape records for data</h3>
            <p>
              <a href="https://www.google.com/search?q=web+scraping">Web scraping</a>
              is a common technique for answering deeper questions about the
              police.
            </p>
            <p>
              The community maintains an open-source code repository with shared
              resources for extracting useful information from records found at
              any Data Source.
            </p>
            <p>
              Data users of any experience level can
              <strong>develop skills as they collaborate</strong> with other
              community members.
            </p>
          </div>
          <div>
            <img class="tile-icon" v-bind:src="automationSvg" />
            <h3>Automation</h3>
            <p>
              Some sources of data are vulnerable, or regularly removed. PDAP
              publishes models and resources for low-cost archiving of critical
              data.
            </p>
            <p>
              The community of people already using police data decide which
              records should be preserved. As we add community archives to our
              Data Sources database,
              <strong>valuable data is kept secure</strong> from loss due to
              risks like mismanagement, technical failure, and policy changes.
            </p>
          </div>
          <div>
            <img class="tile-icon" v-bind:src="standardSvg" />
            <h3>Benchmarks</h3>
            <p>
              By documenting the data available in every local criminal legal
              system, we're developing a gold standard for police transparency
              and data accessibility.
            </p>
            <p>
              Citizens and governments can evaluate local departments against
              this standard, and transparency advocates can help
              <strong>incentivize police administrators to provide data</strong>
              in more accessible formats.
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
