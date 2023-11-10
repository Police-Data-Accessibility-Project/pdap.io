<script setup>
  import HelpTextIcon from '@/components/HelpTextIcon.vue';
</script>

<template>
  <div class="section">
    <div class="container">
      <h1>Volunteer</h1>
      <p>Even at a local level, this project is complex and multidisciplinary. People need help,
        so no matter what your level of experience, you can be a valuable contributor!
        The two most important skills in this work are <strong>collaboration</strong> and <strong>persistence</strong>.</p>
      <h2>Types of volunteer projects</h2>
      <p>
        PDAP collects questions, and shares access to data which could provide answers. Our community does the rest.
      </p>
      <div class="layout-grid-3 small">
        <div>
          <h3><i class="fa fa-institution"></i> Research</h3>
          <p>
            When records can't be found online or in our database,
            you could request records from relevant agencies to help answer research questions.
          </p>
        </div>
        <div>
          <h3><i class="fa fa-eye-slash" aria-hidden="true"></i> Scraping</h3>
          <p>
            Some records are online, but difficult to effectively access. To turn them into useful data, you could use Python 
            to write a web scraper. <help-text-icon>Help!</help-text-icon>
          </p>
        </div>
        <div>
          <h3><i class="fa fa-file-code-o"></i> Analysis</h3>
          <p>
            With data in hand, you could work with a requestor to analyze their data and create a one-page data presentation 
            with Python Notebooks or R&nbsp;Markdown files.
          </p>
        </div>
      </div>
      <p> <br>
          To contribute code for infrastructure projects, check out our 
          <a href="https://github.com/orgs/Police-Data-Accessibility-Project/projects/25">Good First Issues</a> in GitHub.
        </p>
    </div>
  </div>
  <div class="section">
    <div class="container">
        <h2>Open requests</h2>
        <p>
          You can click on a request below to see more details. If you want to volunteer or learn more about a specific request,
          <a href="https://airtable.com/app473MWXVJVaD7Es/shrS4PAZTYVT1zSq8">use this form</a> 
          or email <a href="mailto:operations@pdap.io">operations@pdap.io</a> 
          and reference the number above the request.
        </p>
      </div>
    <div class="airtable-box">
      <iframe class="airtable-embed" 
      src="https://airtable.com/embed/app473MWXVJVaD7Es/shrpwCQ0z5hOFQuOV?backgroundColor=gray&viewControls=on" 
      frameborder="0" onmousewheel="" 
      width="100%" height="850" style="background: transparent; border: 1px solid #512a4f;"></iframe>
      </div>
    </div>
</template>


