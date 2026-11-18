# AGENTS.md

AST Explorer is a client-only Nuxt app (`ssr: false`, deployed with `nuxt generate`) that loads parsers from CDNs at runtime and shows the AST they produce. It is deployed on Vercel: `main` goes to the dev channel, the `release` branch to [ast-explorer.dev](https://ast-explorer.dev/).

## Commands

- `pnpm dev`: dev server. Pass `--host` to reach it from another machine.
- `pnpm lint`, `pnpm typecheck`: run both before you commit. There are no unit tests.
- `pnpm build`: production build. If it runs out of memory, set `NODE_OPTIONS=--max-old-space-size=7000`.
- `pnpm build-parser`: checks that the bundled typescript-eslint parser (`scripts/build-parser.ts`) still builds and parses.

## Layout

- `app/parser/`: one `Parser` per parser, grouped into a `LanguageOption` per language. `app/parser/index.ts` defines the `Parser` interface and `LANGUAGES`. Code templates are in `app/parser/template/`. Option GUIs are the `*Gui.vue` files next to them.
- `app/state/`: global state as module-level refs, with no store library. `state/parser/` holds the selected parser (`parser.ts`), version resolution (`version.ts`), parser options (`options.ts`), and module loading and parsing (`module.ts`). `state/url.ts` syncs everything into the URL hash.
- `app/components/`: UI. `output/` is the AST tree and JSON views, `ast/` is the tree nodes.
- `app/monaco/`: Monaco setup, Shiki grammars and themes, Prettier formatting. It is loaded lazily through `loadMonaco()` and `loadMonacoLanguage()` in `app/composables/monaco.ts`.
- `modules/build-parser.ts`: bundles `@typescript-eslint/parser` for the browser at build time.

## Adding a parser

1. Add a `Parser` object in the language's file under `app/parser/` and list it in that language's `parsers`.
2. Load the module from a CDN through `pkgName` and, if needed, `getModuleUrl` or `init`. Don't add parsers to the app bundle.
3. Set `getNodeLocation` (usually `genGetNodeLocation(...)` from `~/composables/location`) so hovering the AST highlights the source.
4. Use `version: getModuleVersion` (from `~/parser/utils`) when the module exports its own `version`; otherwise the version is read from the package's `package.json`.
5. For a new editor language, add it to `MonacoLanguage` and give it a Shiki grammar in `app/monaco/highlighter.ts`. If Monaco doesn't know the language, also register it in `app/monaco/setup.ts`.
6. Add the parser to the "Languages and Parsers" section of `README.md`.

## Conventions

- Auto-imports are off (`nuxt-explicit-imports` in strict mode). Import everything explicitly, including Vue APIs, composables and components. `nuxi build` fails on any implicit use, and `npx nuxt-explicit-imports check` lists them.
- Use a single `<script setup>` per SFC. With a second `<script>` block, the `import/first` autofix moves statements from one block into the other.
- Keep the first render free of heavy dependencies: Monaco, Shiki grammars and parsers are loaded on demand. Run `pnpm build` and check the entry chunk size when you add an import to app code.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `perf:`, `refactor:`, `chore:`, ...).
