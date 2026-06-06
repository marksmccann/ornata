# Ornata

A progressive enhancement framework for server-rendered websites.

Ornata helps you build HTML-first sites that work without JavaScript, then progressively enhance them with interactivity where needed.

It is also TypeScript-friendly by default, with strong inference for component options and a clear path to explicit typed component contracts when you want them.

## Documentation

The full documentation site lives at:

- [https://marksmccann.github.io/ornata/](https://marksmccann.github.io/ornata/)

Use the docs site for:

- getting started guides
- API reference
- examples
- tutorials
- TypeScript usage patterns

## Installation

```bash
npm install ornata
```

## Browser Build

Ornata also ships a browser-ready global build that you can load directly into a server-rendered HTML page.

Use a pinned version in production so your pages do not change unexpectedly when a new release is published.

```html
<script src="https://cdn.jsdelivr.net/npm/ornata@0.2.0/dist/index.global.js"></script>
<script>
    const { defineComponent, createInitializer, isComponent } = window.Ornata;
</script>
```

If you prefer UNPKG, the same build is also available at:

```html
<script src="https://unpkg.com/ornata@0.2.0/dist/index.global.js"></script>
```

## Quick Start

```ts
import { defineComponent } from 'ornata';

const Counter = defineComponent({
    name: 'Counter',
    state: {
        count: { default: 0 },
    },
});

Counter.mount('[data-counter]');
```

For the full component authoring model, typed usage, `createInitializer()`, DOM element safeguards, and richer examples, see the documentation site.

## License

MIT
