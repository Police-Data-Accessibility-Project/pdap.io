# PDAP Organization Website

This repository houses all of the code and content for the Police Data Accessibility Project organization website. The site is powered by [Gatsby](https://www.gatsbyjs.org/) and content is written in [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

1. [Project Overview](#project-overview)
2. [Info for Developers](#info-for-developers)
3. [Info for Content Managers](#info-for-content-managers)

## Project Overview

At this early stage our goals for this project are as follows:

- Establish an on-brand online presence quickly
- Keep technical and monetary overhead low
  - By keeping our solution confined to GitHub's set set of free tools we negate the need to maintain multiple tools and content sources, and keeps our options open.
- Build a front-end foundation that can scale
  - As our needs grow we can migrate from Markdown content to one of many headless CMS options without the need for a complete rewrite or shift to an entirely new tool set.
  - The Gatsby framework offers a vast plugin ecosystem and can be easily configured to consume different types of content from a variety of sources. Additionally, React components written for this Gatsby site can later be used in potential future projects.

## Info for Developers

### Tech

This site is built with Gatsby, a React-based static site generator that utilizes GraphQL to query content.

If you are new to these frameworks you can familiarize yourself via their docs:

- [React](https://reactjs.org/docs/getting-started.html)
- [Gatsby](https://www.gatsbyjs.org/docs/)
- [GraphQL](https://graphql.org/code/#javascript)

### Config

This project builds static pages dynamically via the [Gatsby Node API](https://www.gatsbyjs.org/docs/node-apis/).

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

You can run tests via the `npm test` command.

## Info for Content Managers

Coming soon
