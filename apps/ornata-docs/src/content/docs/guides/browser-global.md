---
title: Browser Global
description: Use Ornata directly in the browser without a bundler by loading its global build from a CDN.
---

# Browser Global

Ornata ships a browser-ready global build, which means you can use it directly in a server-rendered page without a bundler.

## Load the global build

Use a pinned version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/ornata@0.2.0/dist/index.global.js"></script>
<script>
    const { defineComponent, createInitializer, isComponent } = window.Ornata;
</script>
```

The same build is also available on UNPKG:

```html
<script src="https://unpkg.com/ornata@0.2.0/dist/index.global.js"></script>
```

## Define a component in the browser

```html
<script>
    const { defineComponent } = window.Ornata;

    const Counter = defineComponent({
        name: "Counter",
        state: {
            count: { default: 0 },
        },
    });

    Counter.mount("[data-counter]");
</script>
```

## Why this matters

This is a strong fit for:

- server-rendered sites
- prototypes
- CMS-driven pages
- pages that want focused interactivity without a bundler step

## A good mental model

If you already have HTML on the page and just want to enhance it, the browser global build keeps the setup extremely small.
