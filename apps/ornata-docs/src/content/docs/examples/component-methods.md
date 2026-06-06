---
title: Component Methods
description: Keep event handlers small by moving action logic into named component methods.
---

# Component Methods

This example shows how methods keep action logic out of inline event handlers.

## Live Demo

<iframe
    src="../../demos/component-methods.html"
    title="Component methods demo"
    loading="lazy"
    style="width: 100%; min-height: 400px; border: 1px solid var(--sl-color-gray-5); border-radius: 1rem; background: white;"
></iframe>

[Open this demo in a new tab](../../demos/component-methods.html)

## Component

```ts
import { defineComponent } from "ornata";

export const Disclosure = defineComponent({
    name: "Disclosure",
    state: {
        open: { default: false, type: Boolean },
    },
    elements: {
        button: { query: "[data-disclosure-button]" },
        panel: { query: "[data-disclosure-panel]" },
    },
    methods: {
        open() {
            this.state.open = true;
        },
        close() {
            this.state.open = false;
        },
        toggle() {
            this.state.open = !this.state.open;
        },
    },
    render: {
        button() {
            return {
                attributes: {
                    "aria-expanded": String(this.state.open),
                },
                events: {
                    click: () => this.methods.toggle(),
                },
            };
        },
        panel() {
            return {
                attributes: {
                    hidden: !this.state.open,
                },
            };
        },
    },
});
```

## Why this helps

Instead of embedding state mutation directly in the click handler, the behavior is named and reusable.

That makes the component easier to scan and gives you a clear place to expand the action later if it grows more complex.
