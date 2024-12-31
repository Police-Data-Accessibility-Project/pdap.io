<script setup>
import { RouterView } from 'vue-router';
import { Header, Footer } from 'pdap-design-system';
import { provide } from 'vue';

provide('navLinks', [
	{
		path: '/',
		text: 'Data',
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
	{
		path: '/api',
		text: 'API',
	}
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
	<Header />
	<main>
		<RouterView />
	</main>
	<Footer />
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

.pdap-grid-container{
	padding: 32px;
}

.pdap-grid-container-columns-2{
	grid-template-columns: repeat(auto-fit, minmax(336px, 1fr));
}
.loading-shimmer{
	animation-duration: 800ms;
}

h3{
	margin-top: 0px;
}

</style>
