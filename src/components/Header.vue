<script setup lang="ts">
import { RouterLink } from "vue-router";
import lockupSvg from "pdap-design-system/system/images/lockup.svg"
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
</template>