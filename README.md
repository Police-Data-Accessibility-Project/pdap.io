# PDAP.IO

The web application for all things PDAP.

## Quick start for local development

1. Clone the repo
2. Copy environment examples and fill in real values (two stages only: dev and prod):
   - Run `npm run setup` to create `.env.development` and `.env.production` from `.env.example` (will not overwrite existing files).
   - Update `.env.development` with your dev values and `.env.production` with production values (you'll need `VITE_API_KEY` from PDAP staff — reach out in [Discord](https://discord.gg/vKhDv7nC8B)).
   - Defaults in `.env.example` point to the dev API; swap to the prod API (`https://data-sources.pdap.io/api/v2`) or a local backend as needed. In hosted production (e.g., DigitalOcean), set `VITE_*` vars in the shell/env; the app will read from the environment at build time.
3. From the root of the project:

```shell
npm i && npm run dev:dev
```

4. Navigate to `localhost:8888` in any browser and you should be up and running.

### NPM Scripts

| Script              | What it does                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `setup`             | Copies `.env.example` to `.env.development` and `.env.production` if missing             |
| `dev` / `dev:dev`   | Runs the dev server using `.env.development` (via `--mode development`)                  |
| `dev:prod`          | Runs the dev server using `.env.production` (via `--mode production`)                    |
| `build`             | Builds the application using `.env.production` or shell env values                       |
| `build:dev`         | Builds the application using `.env.development` (helpful for local dev-targeted bundles) |
| `serve`             | Serves the built assets.  Requires `build` first                                         |
| `lint`              | Lints the codebase with `eslint` and `prettier`                                          |
| `lint:fix`          | Lints the codebase with `eslint` and `prettier` and fixes all auto-fixable issues        |
| `test:unit`         | Runs unit tests with debug output                                                        |
| `test:unit:ci`      | Runs unit tests quietly                                                                  |
| `test:unit:changed` | Runs unit tests on changed files only                                                    |
| `test:e2e`          | Runs end-to-end tests with Playwright                                                    |
| `test:e2e:ui`       | Runs end-to-end tests with Playwright UI mode                                            |


### Contributing
Interested in contributing code to pdap.io? Check out our guidelines [here](./CONTRIBUTING.md).
