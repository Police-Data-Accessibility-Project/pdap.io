import { createRouter, createWebHistory } from "vue-router";
import AboutView from "@/views/AboutView.vue";
import DataSourcesView from "@/views/DataSourcesView.vue";
import DonateView from "@/views/DonateView.vue";
import HomeView from "@/views/HomeView.vue";
import JobsView from "@/views/JobsView.vue";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/donate",
      name: "donate",
      component: DonateView,
    },
    {
      path: "/data-sources",
      name: "data-sources",
      component: DataSourcesView,
    },
    {
      path: "/jobs",
      name: "jobs",
      component: JobsView,
    },

    {
      path: "/docs-and-resources",
      name: "docsAndResources",
      component: HomeView,
    },
  ],
  linkActiveClass: "current"
});

export default router;
