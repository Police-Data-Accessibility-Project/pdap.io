# PDAP Client Web Application - Contributing

So you're ready to contribute to PDAP? Great!

Please familiarize yourself with the `README` and follow the quick start instructions to begin.

[Open issues for this application](https://github.com/Police-Data-Accessibility-Project/pdap.io/issues) can be found here.

A list of [good first issues](https://github.com/orgs/Police-Data-Accessibility-Project/projects/25/views/1) across the PDAP org can be found here. And if you want them filtered only for front end issues, you can find those [here](https://github.com/orgs/Police-Data-Accessibility-Project/projects/25/views/1?filterQuery=front+end).

If you have questions as you're working, you can reach out to PDAP staff on [Discord](https://discord.gg/vKhDv7nC8B) for help.

Please raise a PR against the `dev` branch (unless otherwise specified), only after you have done the following:

- Verified that your changes resolve the problem or enhancement described in the issue.
- Ensured that all existing unit and E2E tests pass. Or, if your changes make some part of the affected tests obsolete, please update the tests accordingly.
- Updated E2E tests if your changes affect user-facing functionality.
- Ensured that the linter runs without errors.
- Thoroughly completed the PR request template

## Some things to know

The client app is a Vue 3 SPA, styled with Tailwind. Caching and data fetching are handled with Tanstack. Client state is handled with Pinia.

Feel free to use either the options or composition API, but composition seems to be winning out in this codebase. It's also easier to work with many of the modern Vue libraries, which are built for the composition API first.

### State management

We use a two-pronged strategy for state management.

API-related state is handled using [Tanstack Vue Query](https://tanstack.com/query/latest/docs/framework/vue/overview)

- Tanstack automatically caches responses based on query keys passed to `useQuery`
- We have set up some nice invalidation logic on calls of mutation functions returned by `useMutation`
- The net effect of this is that our async data fetching is extremely efficient.
- If you are adding any functionality related to async data, use the tanstack hooks and ensure

Any client-only state is tracked using [Pinia](https://pinia.vuejs.org/) stores.

- See the [stores](./src/stores/) directory for more details and examples.
- _Do not_ use Pinia for API-related state.

### Code organization

Currently code is organized by kind

- [async fetching logic](./src/api) in the `src/api` directory.
- [client-side data stores](./src/stores) in the `src/stores` directory.
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

## End-to-End Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. Tests are located in the `e2e/` directory.

### Setup

1. Install Playwright browsers:

   ```shell
   npx playwright install
   ```

2. Set up environment variables for testing:

```shell
  # Test credentials (get from PDAP staff)
  E2E_PASSWORD_AUTH_EMAIL_TEST=email@example.com
  E2E_PASSWORD_AUTH_PASSWORD_TEST=pw
  E2E_PW_RESET_EMAIL_TEST=email@example.com
  E2E_SIGNUP_EMAIL_TEST=email@example.com

  # Mailgun for email testing
  MAILGUN_KEY=key
  MAILGUN_DOMAIN=domain
```

### Running Tests

```shell
# Run all E2E tests
npm run test:e2e

# Run with UI mode for debugging
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/auth/sign-in.spec.js
```

### Writing Tests

1. Use the `TEST_IDS` object from `e2e/fixtures/test-ids.js` for element selectors
2. Import test users from `e2e/fixtures/users.js`
3. Follow the existing test patterns for consistency
4. Add new test IDs to both the fixture and corresponding page components
5. Always add new tests if routes are being updated.

### CI/CD

E2E tests run automatically on:

- Pull requests (against dev environment for prs to dev or feature/\*\* branches, against prod on prs to main)
- Hourly monitoring (production health checks)

<!-- ### Resources

TODO: make table of core dependencies, and documentation.
Include:

- Pdap [API docs](https://docs.pdap.io/api/introduction)
- unplugin-vue-router
- pinia/tanstack
- vitest
- playwright -->
