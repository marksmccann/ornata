# Ornata

Ornata is a type-safe framework for building distributable interactive UI components for HTML-first applications.

Create encapsulated, protable components that enhance existing HTML instead of replacing it. Ornata combines state, behavior, rendering, lifecycle, and DOM contracts into reusable components that can be integrated into CMSs, server-rendered applications, design systems, and environments where rendering is not fully controlled by the component.

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
