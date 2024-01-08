import { createRouter, createWebHistory } from 'vue-router';
import AboutView from '@/views/AboutView.vue';
import DataView from '@/views/DataView.vue';
import DonateView from '@/views/DonateView.vue';
import HomeView from '@/views/HomeView.vue';
import JobsView from '@/views/JobsView.vue';
import CommunityView from '@/views/CommunityView.vue';

const router = createRouter({
	history: createWebHistory('/'),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/about',
			name: 'about',
			component: AboutView,
		},
		{
			path: '/donate',
			name: 'donate',
			component: DonateView,
		},
		{
			path: '/data',
			name: 'data',
			component: DataView,
		},
		{
			path: '/jobs',
			name: 'jobs',
			component: JobsView,
		},
		{
			path: '/community',
			name: 'community',
			component: CommunityView,
		},
	],
	linkActiveClass: 'current',
});

export default router;
