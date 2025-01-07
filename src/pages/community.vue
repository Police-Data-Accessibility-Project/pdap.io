<template>
  <section class="pdap-grid-container px-4 md:px-8">
    <h1 class="col-span-full">Join our community</h1>
    <div class="col-span-full">
      <p>
        To find collaborators or ask questions, join us in
        <a href="https://discord.gg/wMqex8nKZJ">Discord</a>
        and see our activity in
        <a href="https://github.com/Police-Data-Accessibility-Project">
          GitHub.
        </a>
      </p>
      <p>
        You can also sign up below to receive occasional updates about our
        software and data projects. You'll be the first to be invited to create
        a PDAP account.
      </p>
      <p>We only write when we have updates.</p>
      <form
        action="https://buttondown.email/api/emails/embed-subscribe/pdap"
        method="post"
        target="popupwindow"
        onsubmit="window.open('https://newsletter.pdap.io', 'popupwindow')"
        class="grid grid-cols-1 mt-4 sm:grid-cols-2 h-[max-content] gap-4 leading-normal mb-3 w-full"
      >
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
    <h1 class="col-span-full mt-0">Volunteer for data requests</h1>
    <div class="col-span-full">
      <p>
        Most data requests are for help
        <strong>answering questions about local police systems.</strong>
        They usually come to us
        <a href="https://airtable.com/shrbFfWk6fjzGnNsk">via this form</a>
        .
      </p>
      <p>
        <a href="https://airtable.com/appcYa6x4nS7W8IR3/shrk9c5sBsBr3cdJJ">
          Use this form to volunteer
        </a>
        , or email
        <a href="mailto:operations@pdap.io">operations@pdap.io</a>
        .
      </p>
    </div>
    <div class="col-span-full">
      <h2>
        <i class="fa fa-code-fork" />
        Merged Pull Requests
      </h2>
      <p v-if="repoCount && mergeCount">
        We have merged
        <strong>{{ mergeCount }} pull requests</strong>
        across
        <strong>{{ repoCount }} repositories</strong>
        .
      </p>
      <a
        href="https://github.com/orgs/Police-Data-Accessibility-Project/projects/25/views/1"
      >
        <i class="fa fa-external-link" />
        Good first issues
      </a>
    </div>
    <div class="text-xl hyphens-auto" lang="en">
      <h3>
        <i class="fa fa-map-o" aria-hidden="true" />
        Locate sources
      </h3>
      <p>
        Some public records are already online, waiting to be classified and
        used to answer questions. You could find data sources to track, making
        it more accessible to everyone.
      </p>
    </div>
    <div class="text-xl hyphens-auto" lang="en">
      <h3>
        <i class="fa fa-eye-slash" />
        Research
      </h3>
      <p>
        Many useful public records can't be easily found online. We work with
        local experts and request records from relevant agencies, making it
        easier to answer important questions.
      </p>
    </div>
    <div class="text-xl hyphens-auto" lang="en">
      <h3>
        <i class="fa fa-file-code-o" />
        Code
      </h3>
      <p>
        Everything you see is open source, built by a small team of volunteers
        and staff. To contribute code for infrastructure projects, check out our
        <a
          href="https://github.com/orgs/Police-Data-Accessibility-Project/projects/25"
        >
          Good First Issues
        </a>
        in GitHub.
      </p>
    </div>
  </section>
  <section class="pdap-grid-container mb-12">
    <p>
      This work is multidisciplinary, and beginner-friendly. No matter what your
      level of experience, you can be a valuable contributor! The two most
      important skills are
      <strong>collaboration</strong>
      and
      <strong>persistence</strong>
      .
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const repoCount = ref(0);
const mergeCount = ref(0);

onMounted(async () => {
  // TODO: move this fetching to a utility function and cache data with Tanstack when implemented
  const repos = await await axios.get(
    `https://api.github.com/orgs/Police-Data-Accessibility-Project/repos`,
  );

  const merges = await await axios.get(
    `https://api.github.com/search/issues?q=org:Police-Data-Accessibility-Project+is:pr+is:merged`,
  );

  repoCount.value = repos.data.length;
  mergeCount.value = merges.data.total_count;
});
</script>
