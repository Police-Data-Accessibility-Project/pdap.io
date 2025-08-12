import { createWebHistory, createRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';
import { refreshMetaTagsByRoute } from '@/util/routeHelpers.js';
/**
 * Special cases: redirecting to log in for routes that are partially public but have sub-components that require auth.
 *
 * Add the route's path to this set to include in auth redirect logic after routing to `/sign-in`
 */
const NON_AUTH_ROUTES_WITH_AUTH_COMPONENTS = new Set(['/search/results', '/']);

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If this is a navigation from the map component, restore the saved scroll position
    if (to.state && to.state.fromMap) {
      return { top: to.state.scrollPosition || 0 };
    }

    // If there's a saved position (like from back/forward navigation), use it
    if (savedPosition) {
      return savedPosition;
    }

    // If the routes are the same path, don't scroll
    if (to.path === from.path) {
      return false;
    }

    // Otherwise, scroll to top
    return { top: 0 };
  }
});

if (import.meta.hot && !import.meta.test) {
  handleHotUpdate(router);
}

router.beforeEach(async (to, from, next) => {
  // Update meta tags per route
  refreshMetaTagsByRoute(to);

  // redirect to login page if not logged in and trying to access a restricted page
  const auth = useAuthStore();

  // Special cases: redirecting to log in for routes that are partially public but have sub-components that require auth
  if (
    to.path === '/sign-in' &&
    NON_AUTH_ROUTES_WITH_AUTH_COMPONENTS.has(from.path)
  ) {
    auth.$patch({ redirectTo: from });
  }

  if (to.meta.auth) auth.$patch({ redirectTo: to });

  if (to.path === '/sign-in') {
    next();
  }

  if (to.meta?.auth && !auth.isAuthenticated()) {
    next({ path: '/sign-in' });
  } else {
    next();
  }
});

router.afterEach((to, from, failure) => {
  if (failure) console.error('router failure', { failure, to, from });
});

router.onError((error) => {
  console.error('router error', error);
});

export default router;
