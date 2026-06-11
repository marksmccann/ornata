# Ornata

Ornata is a small npm workspaces monorepo for a type-safe framework for building distributable interactive UI components for HTML-first applications.

The repository contains the publishable `ornata` package alongside its documentation site. If you are looking for package installation, quick start examples, or browser/CDN usage, use the package README and docs site.

## Packages

- `packages/ornata`: the publishable Ornata library
- `apps/ornata-docs`: the Astro Starlight documentation site

## Documentation

- Docs site: [https://marksmccann.github.io/ornata/](https://marksmccann.github.io/ornata/)
- Package README: [packages/ornata/README.md](/Users/mfamily/Sites/ornata/packages/ornata/README.md)

Use the docs site and package README for installation, API usage, typed examples, and browser build guidance.

## Development

### Install dependencies

```bash
npm install
```

### Common commands

```bash
npm test
npm run build
npm run start:docs
npm run format
```

## Repository Layout

- `packages/ornata/src`: library source and tests
- `packages/ornata/dist`: generated package output
- `apps/ornata-docs/src/content/docs`: docs content

## Releasing

Publishing is managed from this monorepo with the existing `lerna` and npm release scripts.

## License

MIT
