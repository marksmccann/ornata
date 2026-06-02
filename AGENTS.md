# AGENTS.md

## Project

`ornata` is a small npm workspaces monorepo for a progressive enhancement framework for server-rendered websites.

- Root workspace management lives in [package.json](/Users/mfamily/Sites/ornata/package.json) and [lerna.json](/Users/mfamily/Sites/ornata/lerna.json).
- The publishable library lives in [packages/ornata](/Users/mfamily/Sites/ornata/packages/ornata).
- The docs site lives in [apps/ornata-docs](/Users/mfamily/Sites/ornata/apps/ornata-docs).

## Source Of Truth

- Runtime library implementation: [packages/ornata/src](/Users/mfamily/Sites/ornata/packages/ornata/src)
- Library public entrypoint and exported types: [packages/ornata/src/index.ts](/Users/mfamily/Sites/ornata/packages/ornata/src/index.ts)
- Browser global entrypoint: [packages/ornata/src/global.ts](/Users/mfamily/Sites/ornata/packages/ornata/src/global.ts)
- Behavior coverage: `packages/ornata/src/*.test.ts`
- Package metadata and scripts: [packages/ornata/package.json](/Users/mfamily/Sites/ornata/packages/ornata/package.json)
- User-facing docs: [packages/ornata/README.md](/Users/mfamily/Sites/ornata/packages/ornata/README.md)
- Docs site content: [apps/ornata-docs/src/content/docs](/Users/mfamily/Sites/ornata/apps/ornata-docs/src/content/docs)

When behavior and docs disagree, trust the code and tests first.

## Monorepo Layout

- `packages/ornata`: the framework package that is built and published.
- `apps/ornata-docs`: Astro Starlight documentation site.
- `test.html`: likely a lightweight manual playground for browser testing.
- `dist/` under the package is generated output and should not be edited by hand.

## Public API

The current library entrypoint exposes three main runtime exports:

- `defineComponent`
- `isComponent`
- `createInitializer`

The TypeScript namespace in [packages/ornata/src/index.ts](/Users/mfamily/Sites/ornata/packages/ornata/src/index.ts) also defines the package’s core public types and option shapes for component state, elements, methods, computed values, watch callbacks, and render options.

If a task changes runtime behavior, exported types, or the initialization story, update tests and the relevant docs in the same change.

## Build And Tooling

- Package manager: `npm`
- Workspace orchestration: `lerna`
- Language: TypeScript with strict mode enabled
- Test runner: `vitest`
- Bundler: `tsup`
- Docs app: `astro` with `@astrojs/starlight`
- Formatting: `prettier`
- Commit conventions: `commitlint` plus `commitizen`

Formatting conventions in the existing codebase:

- double quotes
- semicolons
- four-space indentation

## Important Commands

From the repo root:

- Install dependencies: `npm install`
- Build all workspaces: `npm run build`
- Run workspace dev builds: `npm run dev`
- Run all tests: `npm test`
- Run all tests in watch mode: `npm run test:watch`
- Start docs locally: `npm run start:docs`
- Format the repo: `npm run format`
- Check formatting: `npm run format:check`
- Create a conventional commit: `npm run commit`

From `packages/ornata`:

- Build the package: `npm run build -w ornata`
- Run package tests: `npm test -w ornata`
- Watch package tests: `npm run test:watch -w ornata`

From `apps/ornata-docs`:

- Run the docs dev server: `npm run dev -w ornata-docs`
- Build the docs site: `npm run build -w ornata-docs`

## Validation

- After library code changes, run at least `npm test -w ornata`.
- After changes that affect bundling or entrypoints, also run `npm run build -w ornata`.
- After docs site changes, run `npm run build -w ornata-docs` when practical.
- After broad repo changes, prefer `npm test` and `npm run build`.
- If public API behavior changes, add or update tests in `packages/ornata/src/*.test.ts`.
- If user-facing behavior or setup instructions change, update [packages/ornata/README.md](/Users/mfamily/Sites/ornata/packages/ornata/README.md) and the docs content in [apps/ornata-docs/src/content/docs](/Users/mfamily/Sites/ornata/apps/ornata-docs/src/content/docs).

## Editing Guidance

- Keep the core package framework-agnostic unless a task explicitly calls for framework-specific integration.
- Prefer small, focused edits in `packages/ornata/src` rather than adding new layers prematurely.
- Do not edit generated files in `packages/ornata/dist/`.
- Preserve the IIFE global build behavior defined in [packages/ornata/tsup.config.ts](/Users/mfamily/Sites/ornata/packages/ornata/tsup.config.ts), including the named-export global entrypoint in [packages/ornata/src/global.ts](/Users/mfamily/Sites/ornata/packages/ornata/src/global.ts).
- The docs are intentionally early-stage and currently sparse; avoid overstating features that are not implemented or tested yet.
- Use `npm run commit` when creating commits so the existing conventional commit workflow is followed.
