---
title: Counter
description: A compact example showing state, methods, element resolution, and rendering together.
---

# Counter

This example is a small but complete Ornata component.

## Live Demo

<iframe
    src="../../demos/counter.html"
    title="Counter demo"
    loading="lazy"
    style="width: 100%; min-height: 320px; border: 1px solid var(--sl-color-gray-5); border-radius: 1rem; background: white;"
></iframe>

[Open this demo in a new tab](../../demos/counter.html)

## HTML

```html
<section data-counter>
    <p>Total: <span data-count-value>0</span></p>
    <button type="button" data-count-button>Increment</button>
</section>
```

## Component

```ts
import { defineComponent } from "ornata";

export const Counter = defineComponent({
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

## Mount

```ts
Counter.mount("[data-counter]");
```
