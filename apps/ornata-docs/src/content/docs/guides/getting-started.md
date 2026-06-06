---
title: Getting Started
description: Install Ornata, define a component, and mount it onto existing HTML.
---

# Getting Started

This guide takes you from installation to a working progressively enhanced component.

## Install

```bash
npm install ornata
```

If you want to enhance a page without a bundler, load the browser build from a CDN instead:

```html
<script src="https://cdn.jsdelivr.net/npm/ornata@0.2.0/dist/index.global.js"></script>
<script>
    const { defineComponent } = window.Ornata;
</script>
```

Pin a specific version in production so your deployed HTML always gets the same runtime.

## Start with HTML

Write server-rendered markup that already makes sense on its own.

```html
<section data-counter>
    <h2>Counter</h2>
    <p>
        Count:
        <span data-count-value>0</span>
    </p>
    <button type="button" data-count-button>Increment</button>
</section>
```

## Define a component

```ts
import { defineComponent } from "ornata";

const Counter = defineComponent({
    name: "Counter",
    state: {
        count: { default: 0 },
    },
    elements: {
        value: { query: "[data-count-value]" },
        button: { query: "[data-count-button]" },
    },
    methods: {
        increment() {
            this.state.count += 1;
        },
    },
    render: {
        value() {
            return {
                text: String(this.state.count),
            };
        },
        button() {
            return {
                events: {
                    click: () => this.methods.increment(),
                },
            };
        },
    },
});
```

## Mount it

```ts
const root = document.querySelector("[data-counter]");

if (root) {
    Counter.mount(root);
}
```

## What happens when it mounts

When `mount()` runs, Ornata:

- resolves the root element
- reads and prepares state
- resolves configured elements
- binds methods to the internal component instance
- runs the mount lifecycle hook if present
- performs an initial render pass for each state property

## Where to go next

- Read [Your First Component](/ornata/guides/your-first-component/) for a deeper walkthrough
- Read [Initializing From HTML](/ornata/guides/initializing-from-html/) to mount components declaratively with `data-ornata`
- Read [Component Anatomy](/ornata/guides/component-anatomy/) for the full shape of `defineComponent()`
