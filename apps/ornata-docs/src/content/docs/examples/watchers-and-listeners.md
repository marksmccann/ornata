---
title: Watchers and Listeners
description: Compare internal watch callbacks with external addStateListener subscriptions.
---


This example shows the difference between `watch` and `addStateListener()` when a component needs both internal reactions and external integration hooks.

## Live Demo

<iframe
    src="../../demos/watchers-and-listeners.html"
    title="Watchers and listeners demo"
    loading="lazy"
    style="width: 100%; min-height: 420px; border: 1px solid var(--sl-color-gray-5); border-radius: 1rem; background: white;"
></iframe>

[Open this demo in a new tab](../../demos/watchers-and-listeners.html)

## Component

```ts
import { defineComponent } from "ornata";

export const Counter = defineComponent({
    name: "Counter",
    state: {
        count: { default: 0, type: Number },
    },
    methods: {
        increment() {
            this.state.count += 1;
        },
    },
    watch: {
        count({ isInitial, newValue, oldValue }) {
            if (isInitial) return;

            console.log(
                `Internal watcher: ${oldValue} -> ${newValue}`
            );
        },
    },
});
```

## External subscription

```ts
const instance = Counter.mount("[data-counter]");

const cleanup = instance.addStateListener("count", ({ newValue, oldValue }) => {
    console.log(`External listener: ${oldValue} -> ${newValue}`);
});
```

## How to think about it

- `watch` lives inside the component definition
- `addStateListener()` is attached to a mounted instance from the outside
- `watch` is for component-owned side effects
- `addStateListener()` is for integrations and orchestration

## Rule of thumb

- use `render` for DOM output
- use `computed` for derived values
- use `watch` for internal side effects
- use `addStateListener()` for external subscriptions
