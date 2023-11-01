<script setup>
import { RouterView } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
	<Header></Header>
	<RouterView />
	<Footer></Footer>
</template>

<style>
/* TODO: Remove all of these styles once design system version is bumped to ^1.1.0 */
@media (max-width: 1024px) {
	.hide-max-lg {
		display: none;
	}
}

@media (min-width: 1025px) {
	.hide-min-lg {
		display: none;
	}
}

@media screen and (max-width: 991px) {
	.nav[data-collapse='medium'] .nav-menu:not(.hide-max-lg) {
		display: flex;
	}
}
@media (prefers-color-scheme: dark) and (max-width: 1025px) {
	.nav-menu {
		background-color: #000;
	}
}

@media screen and (max-width: 1024) {
	.navbar {
		margin-left: -10px;
		margin-right: -10px;
		padding: 20px 10px;
	}
}

@media screen and (max-width: 991px) {
	.navbar {
		padding: 20px;
	}
}

@media screen and (max-width: 767px) {
	.navbar {
		padding: 20px 10px;
	}
}

.lock-scroll {
	overflow: hidden;
}

.nav::before,
.nav::after {
	content: none;
	display: none;
}

.nav-open-button {
	cursor: pointer;
}
</style>
