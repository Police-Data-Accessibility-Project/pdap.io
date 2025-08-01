import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import VueRouter from "unplugin-vue-router/vite";
import path from "path";
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      VueRouter({
        routesFolder: "src/pages",
        exclude: ["**/_*/{*,_*}.*"],
        extendRoute(route) {
          // Add meta from meta map (see below)
          if (ROUTES_TO_META.has(route.name)) {
            route.meta = { ...route.meta, ...ROUTES_TO_META.get(route.name) };
          }

          // Hide authentication routes if flag set to disabled
          if (
            env.VITE_V2_FEATURE_AUTHENTICATE === "disabled" &&
            [
              "change-password",
              "reset-password",
              "sign-in",
              "sign-out",
              "sign-up",
              "profile",
            ].some((pathFrag) => route.fullPath.includes(pathFrag))
          ) {
            route.delete();
          }

          if (route.fullPath.startsWith("/test/") && mode === "production") {
            route.delete();
          }
        },
      }),
      vue(),
      svgLoader({ defaultImport: "url" }),
    ],
    build: {
      minify: "terser",
      terserOptions: {
        parse: {
          html5_comments: false,
        },
      },
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'fontawesome': [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-brands-svg-icons',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/vue-fontawesome'
          ],
          'd3': ['d3', 'd3-scale', 'd3-scale-chromatic']
        }
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    
    server: {
      port: 8888,
    },
    test: {
      coverage: {
        all: true,
        include: ["src/components/*.vue", "src/util/**/*.js"],
        provider: "v8",
        reportsDirectory: "./coverage",
      },
      environment: "happy-dom",
      exclude: ["node_modules"],
      globals: true,
      include: ["src/{components,util}/{__tests__,__spec__}/*.test.js"],
      setupFiles: ["tools/testing/setup.js"],
    },
  };
});

/**
 * To override or add meta to a route, add a tuple to this `Map` which contains the route as the zeroth index and the meta object as the first index
 * Defining in vite.config rather than util/router because of import issues.
 *
 * TODO: remove this nonsense and set up in <route> tags at the page level instead.
 */
const ROUTES_TO_META = new Map([
  [
    "/",
    {
      title: "Police Data Access Point - Search",
      metaTags: [
        {
          property: "og:title",
          title: "Police Data Access Point - Search",
        },
      ],
    },
  ],
]);