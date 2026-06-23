---
title: Browser Global
slug: 'guides/browser-global'
description: Use Ornata directly in the browser without a bundler by loading its global build into an HTML-first page.
---

Ornata ships a browser-ready global build, which means you can use it directly in server-rendered, CMS-driven, or otherwise HTML-first pages without a bundler.

## Load the global build

Use a pinned version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/ornata@0.2.0/dist/index.global.js"></script>
<script>
    const { defineComponent, mountAll, isComponent } = window.Ornata;
</script>
```

The same build is also available on UNPKG:

```html
<script src="https://unpkg.com/ornata@0.2.0/dist/index.global.js"></script>
```

Ornata also ships a development global build at `dist/index.global.dev.js`. Unlike the production build, it is not minified, which makes it better for debugging and preserves Ornata’s full error messaging.

## Define a component in the browser

Define a component much like you normally would, but use the package exports from the `window.Ornata` global instead of importing them from a module.

```html
<script>
    const { defineComponent } = window.Ornata;

    const Counter = defineComponent({
        name: 'Counter',
        state: {
            count: { default: 0 },
        },
    });

    Counter.mount('[data-counter]');
</script>
```

## Why this matters

This is a strong fit for:

- server-rendered sites
- prototypes
- CMS-driven pages
- pages that want focused interactivity without a separate app build step

## A good mental model

If you already have HTML on the page and want to layer interaction onto it, the browser global build keeps the setup extremely small.
