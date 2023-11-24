<script setup>
import { RouterView } from 'vue-router';
import { Header, Footer } from 'pdap-design-system';
import { provide } from 'vue';

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
	<Header />
	<div class="router-view-container">
		<RouterView />
	</div>
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

.router-view-container {
	margin-top: 120px;
}

@media (min-width: 768px) {
	.airtable-box {
		margin: 40px;
	}
}
</style>
