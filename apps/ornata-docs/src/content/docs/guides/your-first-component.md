---
title: Your First Component
description: Build a small component and learn the core Ornata authoring pattern.
---

# Your First Component

The easiest way to learn Ornata is to enhance a small piece of existing HTML.

## The markup

```html
<section data-counter>
    <p>
        <span data-count-label>Clicks</span>:
        <strong data-count-value>0</strong>
    </p>
    <button type="button" data-count-button>Increment</button>
</section>
```

Even without JavaScript, this markup still renders understandable content.

## The component

```ts
import { defineComponent } from "ornata";

const Counter = defineComponent({
    name: "Counter",
    state: {
        count: { default: 0 },
        label: { default: "Clicks" },
    },
    elements: {
        label: { query: "[data-count-label]" },
        value: { query: "[data-count-value]" },
        button: { query: "[data-count-button]" },
    },
    methods: {
        increment() {
            this.state.count += 1;
        },
    },
    watch: {
        count({ newValue, oldValue, isInitial }) {
            if (isInitial) return;

            console.log(`Count changed from ${oldValue} to ${newValue}`);
        },
    },
    computed: {
        total() {
            return this.state.count;
        },
    },
    render: {
        label() {
            return {
                text: this.state.label,
            };
        },
        value() {
            return {
                text: String(this.computed.total),
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

## The mounting code

```ts
const root = document.querySelector("[data-counter]");

if (root) {
    Counter.mount(root);
}
```

## How to read this component

Each top-level option has a clear job:

- `state` defines reactive values
- `elements` finds important DOM nodes inside the root
- `methods` defines reusable internal behavior
- `watch` reacts to state changes
- `computed` derives values from state
- `render` applies DOM updates to resolved elements

That separation is one of Ornata’s main strengths. The component stays small, direct, and easy to scan.

## Add stronger typing

When you want clearer contracts, provide typed component parts:

```ts
interface CounterState {
    count: number;
    label: string;
}

interface CounterMethods {
    increment(): void;
}

const Counter = defineComponent<{
    state: CounterState;
    methods: CounterMethods;
}>({
    name: "Counter",
    state: {
        count: { default: 0 },
        label: { default: "Clicks" },
    },
    methods: {
        increment() {
            this.state.count += 1;
        },
    },
});
```

## Next

Continue to [Component Anatomy](/ornata/guides/component-anatomy/) for a deeper look at every option section.
