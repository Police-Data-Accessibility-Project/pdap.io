# pdap.io Vue site

This website serves as the official voice of PDAP.

## Info for Developers

### Tech
This site is built with [Vue](https://vuejs.org/) and [Tailwind](https://tailwindcss.com/).

### Etiquette
Head to [\#outreach](https://discord.com/channels/828274060034965575/853442226034442260/) in our [Discord](https://discord.gg/vKhDv7nC8B) if you'd like to collect feedback from the wider group.

Test your changes **locally first**, if possible. Include **screenshots with your PR** if you're changing something visual.

### Setup

1. [Clone the repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

In your terminal:

2. `cd pdap.io`
3. `npm install` to install dependencies
4. `npm run dev` to start the site in development mode. Editing most files will trigger an automatic refresh of the page thanks to Vite's excellent dev server.
5. `npm run build` to build the site for production.
6. `npm run preview` will boot up a local static web server that serves the files from dist at `http://localhost:4173`. It's an easy way to check if the production build looks OK in your local environment.

### Staging

Merge into the `dev` branch, allow 5 minutes for the auto-deploy, and visit pdap.dev.

### For local development: Add environment secrets

Either add a `.env` file to your local root directory or manually export these secrets. Reach out to contact@pdap.io or make noise in Discord if you'd like access. 

#### Sample `.env` file
```
# Local development
#Airtable API key
VITE_AIRTABLE_API_KEY=secret

#PDAP data sources API key
VITE_PDAP_API_KEY=secret
```

#### shell
```
export VITE_AIRTABLE_API_KEY=secret
export VITE_PDAP_API_KEY=secret
```
