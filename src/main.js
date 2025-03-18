
import { createApp } from 'vue';

import { createPinia } from 'pinia';
import piniaPersistState from 'pinia-plugin-persistedstate';
import Vue3Toastify from 'vue3-toastify';
import { VueQueryPlugin } from '@tanstack/vue-query';

import App from './App.vue';
import router from './router';
import './main.css';
import 'vue3-toastify/dist/index.css';
import 'pdap-design-system/styles';

async function optionallyEnableMocking() {
  if (import.meta.env.VITE_MSW_ENABLED) {
    const { worker } = await import('./mocks/browser');
    await worker.start();
  }
}

// Ensure MSW starts before mounting the app
optionallyEnableMocking().then(() => {
  /* Plugins, etc. -- order matters */
  const app = createApp(App);

  /* Pinia - client state */
  const pinia = createPinia();
  pinia.use(piniaPersistState);
  app.use(pinia);

  /* Tanstack - API state */
  app.use(VueQueryPlugin);

  /* Router */
  app.use(router);

  /* Toaster */
  app.use(Vue3Toastify, {
    autoClose: 5000,
    containerClassName: 'pdap-toast-container',
    toastClassName: 'pdap-toast',
    style: {
      opacity: 0.95
    },
    theme: 'auto'
  });

  /* And away we go */
  app.mount('#app');
});
