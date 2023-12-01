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
		path: '/about',
		text: 'About',
	},
	{
		path: '/donate',
		text: 'Donate',
	},
	{
		path: '/volunteer',
		text: 'Volunteer',
	},
	{
		href: 'https://docs.pdap.io/',
		text: 'Docs and Resources',
	},
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
