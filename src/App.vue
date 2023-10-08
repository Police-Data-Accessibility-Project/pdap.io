<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import lockupSvg from "pdap-design-system/system/images/lockup.svg"
import acronymSvg from "pdap-design-system/system/images/acronym.svg"
const copyrightYear = new Date().getFullYear();
</script>

<template>
  <header>
    <div class="navbar nav">
      <RouterLink class="brand nav-brand" to="/">
        <img v-bind:src="lockupSvg" class="logo" alt="Police Data Accessibility Project Logo" loading="lazy"
          width="250" />
      </RouterLink>

      <div class="nav-container-last">
        <div class="nav-container container">
          <div class="menu-button nav-button">
            <div class="nav-menu-icon"><i class="fa fa-bars"></i></div>
          </div>
        </div>
      </div>

      <nav class="nav-menu" role="navigation">
        <RouterLink class="nav-link" to="/">Home</RouterLink>
        <RouterLink class="nav-link" to="/data-sources">Data Sources</RouterLink>
        <RouterLink class="nav-link" to="/donate">Donate</RouterLink>
        <RouterLink class="nav-link" to="/about">About</RouterLink>
        <RouterLink class="nav-link" to="/jobs">Jobs</RouterLink>
        <a class="nav-link" href="https://docs.pdap.io/" target="_blank">Docs and Resources</a>
      </nav>
    </div>
  </header>

  <RouterView />
  <div class="footer section">
    <div class="container container">
      <div class="footer-actions">
        <a href="https://github.com/orgs/Police-Data-Accessibility-Project" class="button button-footer"
          target="_blank">GitHub</a>
        <a href="https://discord.gg/wMqex8nKZJ" class="button button-footer" target="_blank">Discord</a>
        <a href="https://www.linkedin.com/company/pdap" class="button button-footer" target="_blank">LinkedIn</a>
      </div>
      <p class="footer-p">© {{ copyrightYear }} Police Data Accessibility Project<br></p>
      <p class="footer-p">PDAP is a non-profit. EIN: 85-4207132. <a
          href="https://docs.pdap.io/meta/policy/pdap-privacy-policy" alt="Privacy Policy">Privacy Policy</a>. <a
          href="mailto:contact@pdap.io">contact@pdap.io</a><br><br></p>
      <p class="footer-p"><a href="https://www.guidestar.org/profile/85-4207132" target="_blank"><img
            src="https://widgets.guidestar.org/gximage2?o=9973356&l=v4" /></a><img v-bind:src="acronymSvg" loading="lazy"
          width="150" alt="" class="footer-logo"></p>
    </div>
  </div>
</template>

