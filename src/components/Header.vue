<script setup>
import { RouterLink } from 'vue-router';
import lockupSvg from 'pdap-design-system/system/images/lockup.svg';

function handleMenuExpansion() {
	var body = document.querySelector('body');
	var navMenu = document.querySelector('.nav-menu');
	if (navMenu.classList.contains('hide-max-lg')) {
		// Hide class
		navMenu.classList.remove('hide-max-lg');
		// a11y
		navMenu.setAttribute('aria-expanded', true);
		// Lock scroll on body while nave is open
		body.classList.add('lock-scroll');
	} else {
		navMenu.classList.add('hide-max-lg');
		navMenu.setAttribute('aria-expanded', false);
		body.classList.remove('lock-scroll');
	}
}
</script>

<template>
	<header>
		<div
			class="navbar nav"
			data-collapse="medium"
			data-animation="default"
			data-duration="400"
			role="banner"
		>
			<RouterLink class="brand nav-brand" to="/">
				<img
					v-bind:src="lockupSvg"
					class="logo"
					alt="Police Data Accessibility Project Logo"
					loading="lazy"
					width="250"
				/>
			</RouterLink>

			<div
				@click="handleMenuExpansion"
				aria-controls="nav"
				class="nav-open-button hide-min-lg"
				role="button"
			>
				<div class="nav-menu-icon"><i class="fa fa-bars"></i></div>
			</div>

			<nav class="nav-menu hide-max-lg" role="navigation">
				<RouterLink class="nav-link" to="/">Home</RouterLink>
				<RouterLink class="nav-link" to="/data">Data</RouterLink>
				<RouterLink class="nav-link" to="/strategy">Strategy</RouterLink>
				<RouterLink class="nav-link" to="/about">About</RouterLink>
				<RouterLink class="nav-link" to="/donate">Donate</RouterLink>
				<RouterLink class="nav-link" to="/volunteer">Volunteer</RouterLink>
				<a class="nav-link" href="https://docs.pdap.io/" target="_blank">Docs</a>
			</nav>
		</div>
	</header>
</template>
