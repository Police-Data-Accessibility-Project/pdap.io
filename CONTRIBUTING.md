# PDAP Client Web Application - Contributing

So you're ready to contribute to PDAP? Great!

Please familiarize yourself with the `README` and follow the quick start instructions to begin.

[Open issues for this application](https://github.com/Police-Data-Accessibility-Project/pdap.io/issues) can be found here.

A list of [good first issues](https://github.com/orgs/Police-Data-Accessibility-Project/projects/25/views/1) across the PDAP org can be found here. And if you want them filtered only for front end issues, you can find those [here](https://github.com/orgs/Police-Data-Accessibility-Project/projects/25/views/1?filterQuery=front+end).

If you have questions as you're working, you can reach out to PDAP staff on [Discord](https://discord.gg/vKhDv7nC8B) for help.

Please raise a PR against the `dev` branch (unless otherwise specified), only after you have done the following:

- Verified that your changes resolve the problem or enhancement described in the issue.
- Ensured that all existing unit and e2e tests pass. Or, if your changes make some part of the affected tests obsolete, please update the tests accordingly.
- Ensured that the linter runs without errors.
- Thoroughly completed the PR request template

## Some things to know

The client app is a Vue 3 SPA, styled with Tailwind. We currently use Pinia for state management, although we have plans to migrate to Tanstack for better caching.

Feel free to use either the options or composition API, but composition seems to be winning out in this codebase. It's also easier to work with many of the modern Vue libraries, which are built for the composition API first.

### State management

We use `pinia` for global state management. Check out [the docs](https://pinia.vuejs.org/).

Some implementation details specific to the PDAP application

- Pinia is for storing state. Async fetching is defined separately. While you _can_ define async actions in pinia stores, we have made the decision to decouple the fetching logic from the state management.
- Many of the stores are set up for caching certain responses. It's a bit hacky and overly simple (no invalidation, etc). We'll move this to Tanstack shortly. But for now, if caching is needed, follow the pattern in [search](./src/stores/search.js).

### Code organization

- [async fetching logic](./src/api) in the `src/api` directory.
- [client-side data stores and caching](./src/stores) in the `src/stores` directory.
- [UI components](./src/components) in the `src/components` directory.
- [routes](./src/pages) in the `src/pages` directory.
- [utilities](./src/util) in the `src/util` directory.

### Routing

Routing is handled by file-based routing provided by `unplugin-vue-router`. Everything in the `src/pages` directory becomes a route (i.e. `pages/data-source/create.vue` becomes `/data-source/create`, and`pages/search/results.vue` becomes `/search/results`), with the exception of a couple of special rules for files named index, dynamic route parameters, catchall routes, and such things as you can [read more about in the docs](https://uvr.esm.is/introduction).

There are two exceptions to the routing rules that are both defined by our configuration, rather than features of `unplugin-vue-router` itself.

- if a directory or route is prefixed with an "\_", we ignore its name (and all of the names of its contents) in the route tree at build time. See `src/pages/data-source/_components` for an example.
- Anything in the `src/pages/test/` directory is also ignored in the route tree in production builds of the application.

### Testing

#### Unit testing

Currently, there are unit tests for the `src/util` and `src/component` directories, with relatively paltry coverage. The goal is to increase the level of coverage without being obsessive about it. Chasing 100% coverage has quickly diminishing returns. We want to cover core functionality, but let's not muck around too much with edge cases.

#### E2E testing

E2e testing ~~is~~ will be done using playwright.

<!-- ### Resources

TODO: make table of core dependencies, and documentation.
Include:

- Pdap [API docs](https://docs.pdap.io/api/introduction)
- unplugin-vue-router
- pinia/tanstack
- vitest
- playwright -->
