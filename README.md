# AST Explorer

AST Explorer - For most popular front-end languages and parsers.

- Stable Release: [ast.sxzz.moe](https://ast.sxzz.moe/)
- Dev Channel: [ast-explorer.vercel.app](https://ast-explorer.vercel.app/)

Feel free to add more parsers and languages via PR!

## Overview

Welcome to the AST Explorer project, a comprehensive tool designed to parse and explore Abstract Syntax Trees (ASTs) for various programming languages. This project is built using TypeScript and Vue.js, and it provides a user-friendly interface for loading and parsing code, changing languages, selecting parsers, and viewing the resulting AST in a structured format. The project also includes features such as toggling between dark and light modes, compressing and decompressing strings, and handling backward compatibility with old unicode hacks.

## Technologies and Frameworks

The AST Explorer project uses and supports the following technologies and frameworks:

- TypeScript: A statically typed superset of JavaScript that adds optional types.
- Vue.js: A progressive JavaScript framework for building user interfaces.
- Nuxt.js: A framework for creating Vue.js applications, with server-side rendering, routing, and other features.
- Monaco Editor: A browser-based code editor that provides rich IntelliSense, validation for TypeScript, JavaScript, CSS, LESS, SCSS, JSON, HTML.
- Unocss: A library for defining CSS shortcuts, presets, and transformers.
- Simple-git: A library for performing Git operations.
- json-to-ast: A library for converting JSON to an abstract syntax tree.
- json5: A library for parsing and serializing JSON5, a superset of JSON.
- zlib: A library for compressing and decompressing data.
- @vue/compiler-sfc and @vue/compiler-dom: Libraries for compiling Vue 3 Single File Components (SFC) and Vue 3 DOM.
- @sxzz/eslint-config: A configuration module for ESLint.
- floating-vue: A package for floating Vue components.
- Various parsers for JavaScript, Vue, Svelte, and JSON.
- CSS: For styling the user interface.
- Git: For version control.

## Installation

Follow these steps to install and setup the project:

1. Clone the repository to your local machine using Git:

```bash
git clone https://github.com/sxzz/ast-explorer.git
```

2. Navigate to the project directory:

```bash
cd ast-explorer
```

3. Install the required dependencies. The project uses the pnpm package manager. If you don't have it installed, you can enable it using corepack:

```bash
corepack enable
```

Then, install the project dependencies:

```bash
pnpm install
```

This will start the development server. You can access the application by navigating to `http://localhost:3000` in your web browser.

## Credit

- https://astexplorer.net/

## License

[AGPL-3.0](./LICENSE) License © 2023-PRESENT [三咲智子](https://github.com/sxzz)
