<script setup>
const copyrightYear = new Date().getFullYear();
import acronymSvg from "pdap-design-system/system/images/acronym.svg"
</script>

<template>
    <div class="footer section">
        <div class="container container">
            <div class="footer-actions">
                <a href="https://github.com/orgs/Police-Data-Accessibility-Project" class="button button-footer"
                    target="_blank">GitHub</a>
                <a href="https://discord.gg/wMqex8nKZJ" class="button button-footer" target="_blank">Discord</a>
                <a href="https://www.linkedin.com/company/pdap" class="button button-footer" target="_blank">LinkedIn</a>
                <router-link to="/jobs" class="button button-footer">Jobs</router-link>
            </div>
            <p class="footer-p">© {{ copyrightYear }} Police Data Accessibility Project<br></p>
            <p class="footer-p">PDAP is a non-profit. EIN: 85-4207132. <a
                    href="https://docs.pdap.io/meta/policy/pdap-privacy-policy" alt="Privacy Policy">Privacy Policy</a>. <a
                    href="mailto:contact@pdap.io">contact@pdap.io</a><br><br></p>
            <p class="footer-p"><a href="https://www.guidestar.org/profile/85-4207132" target="_blank"><img
                        src="https://widgets.guidestar.org/gximage2?o=9973356&l=v4" /></a><img v-bind:src="acronymSvg"
                    loading="lazy" width="150" alt="" class="footer-logo"></p>
        </div>
    </div>
</template>