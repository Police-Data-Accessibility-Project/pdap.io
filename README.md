# PDAP.IO

The web application for all things PDAP.

## Quick start for local development

1. Clone the repo
2. Create a `.env` file at the root of the project. You'll need the `VITE_API_KEY` value from the PDAP staff (reach out in [Discord](https://discord.gg/vKhDv7nC8B)). Once you have it, your env file should look something like this:

```shell
# API
VITE_API_KEY=key_from_pdap_staff
VITE_API_URL=https://data-sources.pdap.dev/api # Or 'https://data-sources.pdap.io/api' for the prod DB, or 'http://localhost:5000' if you're working with the API locally.

# V2 feature flags - these are **temporary**. They should be set to "enabled" for development.
VITE_V2_FEATURE_ENHANCED_SEARCH=enabled
VITE_V2_FEATURE_AUTHENTICATE=enabled
VITE_V2_FEATURE_CREATE_RECORDS=enabled
VITE_V2_FEATURE_SHOW_REQUESTS=enabled
VITE_V2_FEATURE_SIGNUP=enabled

# Include the below only if you want to use Mock Service Worker to mock API responses
# This should not be included in production
VITE_MSW_ENABLED=true
```

_Note: You can also override these vars when starting the dev server if you'd rather not update an env file every time you need a different value, by passing the value to the command line before running the server i.e:_ `VITE_API_URL=localhost:5000 npm run dev`

3. From the root of the project:

```shell
npm i && npm run dev
```

4. Navigate to `localhost:8888` in any browser and you should be up and running.

### NPM Scripts

| Script         | What it does                                                                      |
| -------------- | --------------------------------------------------------------------------------- |
| `build`        | Builds the application in production mode                                         |
| `serve`        | Serves the built assets. Requires `build` to be run first                         |
| `lint`         | Lints the codebase with `eslint` and `prettier`                                   |
| `lint:fix`     | Lints the codebase with `eslint` and `prettier` and fixes all auto-fixable issues |
| `test`         | Runs unit tests with debug output                                                 |
| `test:ci`      | Runs unit tests quietly                                                           |
| `test:changed` | Runs unit tests on changed files only                                             |
| `coverage`     | Runs unit tests and outputs coverage report                                       |



### Contributing
Interested in contributing code to pdap.io? Check out our guidelines [here](./CONTRIBUTING.md).
