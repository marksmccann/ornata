---
title: Getting Started
description: Learn how to add Ornata to your server-rendered website.
---

# Getting Started

This guide will help you add Ornata to your project.

## Installation

```bash
npm install ornata
```

## Basic Usage

```ts
import { defineComponent } from "ornata";

const Counter = defineComponent({
    name: "Counter",
    state: {
        count: { default: 0 },
    },
    watch: {
        count({ newValue, oldValue, isInitial }) {
            if (isInitial) return;

            console.log(`Count changed from ${oldValue} to ${newValue}`);
        },
    },
});

const instance = Counter.mount(document.querySelector("[data-counter]"));
```

When you want stable named types and JSDoc on state properties, provide a single typed parts object:

```ts
interface CounterState {
    /** The current visible count. */
    count: number;
}

const Counter = defineComponent<{
    state: CounterState;
}>({
    name: "Counter",
    state: {
        count: { default: 0 },
    },
});
```

For imperative instance management, use the component constructor methods:

```ts
const instance = Counter.mount(root);
const sameInstance = Counter.getInstance(root);
const maybeInstance = Counter.findInstance(root);
Counter.unmount(root);
```
