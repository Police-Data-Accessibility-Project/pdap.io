# pdap.io Vue site

This is the official voice of PDAP.

## Info for Developers

### Tech

The current iteration of this site is built with Vue.js. It was originally designed in Webflow and exported.

### Etiquette

Head to [\#outreach](https://discord.com/channels/828274060034965575/853442226034442260/) in our [Discord](https://discord.gg/vKhDv7nC8B) if you'd like to collect feedback from the wider group.

Test your changes **locally first**, if possible. Include **screenshots with your PR** if you're changing something visual.

### Prerequisites

1. Install Node.js and npm - [https://nodejs.org/en](https://nodejs.org/en)
3. (Optional) Install and use VS Code. This repo is configured with recommended extensions to aid in development, so using VS Code will provide the best experience.

### Setup

1. [Clone the repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).
2. `cd pdap.io`
3. `npm install` to install dependencies
4. `npm run dev` to start the site in development mode. Editing most files will trigger an automatic refresh of the page thanks to Vite's excellent dev server.
5. `npm run build` to build the site for production.
6. `npm run preview` will boot up a local static web server that serves the files from dist at `http://localhost:4173`. It's an easy way to check if the production build looks OK in your local environment.

### Staging

Merge into the `dev` branch and visit pdap.dev.

### Helpful links

- [Vue.js home](https://vuejs.org/)
- [Vite Configuration Reference](https://vitejs.dev/config)
