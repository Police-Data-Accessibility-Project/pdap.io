<script setup>
import { RouterView } from 'vue-router';
import { Header, Footer } from 'pdap-design-system';
import { provide } from 'vue';

// Images needed at root
import acronym from 'pdap-design-system/images/acronym.svg';
import lockup from 'pdap-design-system/images/lockup.svg';

provide('navLinks', [
	{
		path: '/',
		text: 'Home',
	},
	{
		path: '/data',
		text: 'Data',
	},
	{
		path: '/community',
		text: 'Community',
	},
	{
		path: '/about',
		text: 'About',
	},
	{
		path: '/donate',
		text: 'Donate',
	},
	{
		href: 'https://docs.pdap.io/',
		text: 'Docs',
	},
]);
provide('footerLinks', [
	{
		href: 'https://newsletter.pdap.io',
		text: 'Newsletter',
	},	
	{
		href: 'https://github.com/orgs/Police-Data-Accessibility-Project',
		text: 'Github',
	},
	{
		href: 'https://discord.gg/wMqex8nKZJ',
		text: 'Discord',
	},
	{
		href: 'https://www.linkedin.com/company/pdap',
		text: 'LinkedIn',
	},
	{
		path: '/jobs',
		text: 'Jobs',
	}
]);
</script>

<template>
	<Header :logo-image-src="lockup" />
	<main>
		<RouterView />
	</main>
	<Footer :logo-image-src="acronym" />
</template>

<style>
/* Global styles */
.airtable-box {
	margin: 10px;
}

:root {
	overflow: hidden;
}

body {
	overflow: auto;
}
</style>
