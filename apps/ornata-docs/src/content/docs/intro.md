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
