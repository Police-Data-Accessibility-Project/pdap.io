import { createWebHistory, createRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';
import { refreshMetaTagsByRoute } from '@/util/routeHelpers.js';
import { toast } from 'vue3-toastify';
/**
 * Special cases: redirecting to log in for routes that are partially public but have sub-components that require auth.
 *
 * Add the route's path to this set to include in auth redirect logic after routing to `/sign-in`
 */
const NON_AUTH_ROUTES_WITH_AUTH_COMPONENTS = new Set(['/search/results']);

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
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

  if (to.meta.auth) auth.$patch({ redirectTo: to });

  // Special cases: redirecting to log in for routes that are partially public but have sub-components that require auth
  if (
    to.path === '/sign-in' &&
    NON_AUTH_ROUTES_WITH_AUTH_COMPONENTS.has(from.path)
  ) {
    auth.$patch({ redirectTo: from });
  }

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
  toast.error('An error occurred. Please try again later.', {
    autoClose: false
  });
});

export default router;
