# PDAP.IO

Powered by [Gatsby](https://www.gatsbyjs.org/), written in [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

1. [Project Overview](#project-overview)
2. [Info for Developers](#info-for-developers)

## Project Overview

### We're here to build a front-end foundation that can scale.

We're currently in Markdown. Down the road, we may migrate to a headless CMS.

Gatsby offers a vast plugin ecosystem and can consume content from many sources. PDAP is open source, so React components written for this Gatsby site can be used in future projects.

## Info for Developers

### Tech

This site is built with Gatsby, a React-based static site generator that utilizes GraphQL to query content.

If you are new to these frameworks you can familiarize yourself via their docs:

- [React](https://reactjs.org/docs/getting-started.html)
- [Gatsby](https://www.gatsbyjs.org/docs/)
- [GraphQL](https://graphql.org/code/#javascript)
- [Remark](https://remark.js.org/) is used to parse files from Markdown to HTML.

### Etiquette 

Make a Pull Request and request approval from Josh Lintag, or Josh Chamberlain. **Head to #copywriting in Slack** if you'd like to collect feedback from the wider group.

Test your changes **locally first**, if possible. Include **screenshots with your PR** if you're changing something visual.

### Background

We build static pages via the [Gatsby Node API](https://www.gatsbyjs.org/docs/node-apis/).

Markdown files in the top level `content` directory are sourced via the [gatsby-source-filesystem](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/?=file) plugin and parsed via the [gatsby-transformer-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/?=markd) plugin. The content is fed as props to the React templates via [GraphQL page queries](https://www.gatsbyjs.org/docs/page-query/).

The static site content is hosted on [Github Pages](https://pages.github.com/) from the gh-pages branch. The static files are built and deployed to this branch automatically via [GitHub Actions](https://github.com/features/actions) whenever changes are merged to the master branch.

You can see a demo static site [here](https://milespratt.github.io/Police-Data-Accessibility-Project.github.io).

### Setup

1. Clone the repository
   `git clone https://github.com/milespratt/Police-Data-Accessibility-Project.github.io.git`
2. Install dependencies
   `npm install`
3. Start the development server
   `npm start`

The development preview can be accessed at [localhost:8000](http://localhost:8000)
The GraphQL playground can be accessed at [localhost:8000/\_\_\_playground](http://localhost:8000/___playground)

### Testing

Testing is configured according to Gatsby's [Unit Testing](https://www.gatsbyjs.org/docs/unit-testing/) docs.

You can run tests via the `npm test` command

