# Static site
This is the official voice of PDAP.

## Info for Developers

### Tech
This site is built with HTML. It was designed in Webflow and exported.

### Etiquette
Head to [\#outreach](https://discord.com/channels/828274060034965575/853442226034442260/) in our [Discord](https://discord.gg/vKhDv7nC8B) if you'd like to collect feedback from the wider group.

Test your changes **locally first**, if possible. Include **screenshots with your PR** if you're changing something visual.


### Setup

1. [Clone the repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

2. Open the index.html file in your browser.

3. Open the codebase in your text editor of choice.

4. Make changes to the code, save, and refresh your browser.

### Design System

This static site uses the npm package `pdap-design-system`, but because it's hosted as a static site, we add `package.json` and `package-lock.json` files to `.gitignore` so that DigitalOcean doesn't get confused.


### Staging

Merge into the `dev` branch and visit pdap.dev.

# pdap-io

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
