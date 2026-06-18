---
title: TypeScript
slug: "guides/typescript"
description: Use Ornata with strong type inference or explicit component contracts for state, elements, methods, data, and computed values.
---

Ornata is designed to feel good in TypeScript-heavy codebases without forcing you to write a lot of type boilerplate up front.

You can usually start with inference, then move to explicit types when a shared component becomes important enough to deserve a stronger contract.

## Start with inference

For many components, the inferred `defineComponent()` overload is enough.

```ts
import { defineComponent } from "ornata";

const Counter = defineComponent({
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
    computed: {
        summary() {
            return `${this.state.label}: ${this.state.count}`;
        },
    },
});
```

This gives you a nice default experience:

- `default: 0` becomes `number`
- `default: "Clicks"` becomes `string`
- method signatures flow through to `this.methods`
- computed return types are inferred

## Add explicit typed parts when you want stronger contracts

When a component is shared, long-lived, or important to document clearly, explicit typed parts can be a better fit.

```ts
interface CounterState {
    count: number;
    label: string;
}

interface CounterMethods {
    increment(): void;
}

interface CounterComputed {
    summary: string;
}

const Counter = defineComponent<{
    state: CounterState;
    methods: CounterMethods;
    computed: CounterComputed;
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
    computed: {
        summary() {
            return `${this.state.label}: ${this.state.count}`;
        },
    },
});
```

This pattern is especially nice when you want named interfaces, reusable contracts, or richer JSDoc for teammates.

## Type `elements` more narrowly

One of the nicest places to use explicit typing is `elements`, especially when `resolve()` can return a more precise DOM type.

```ts
const LiveFilter = defineComponent<{
    state: {
        query: string;
    };
    elements: {
        input: HTMLInputElement | null;
        items: HTMLElement[];
    };
}>({
    state: {
        query: { default: "" },
    },
    elements: {
        input: {
            resolve(root) {
                return root.querySelector(
                    "[data-filter-input]"
                ) as HTMLInputElement | null;
            },
        },
        items: {
            resolve(root) {
                return Array.from(
                    root.querySelectorAll("[data-filter-item]")
                ) as HTMLElement[];
            },
        },
    },
});
```

That gives the rest of the component a clearer DOM contract.

## Type the mounted instance

The component constructor methods also carry those types through.

```ts
const instance = Counter.mount("[data-counter]");

instance.state.count += 1;
```

If you define explicit typed parts, the mounted instance reflects them.

## A good default strategy

A simple team-friendly approach is:

1. start with inference for small components
2. add explicit typed parts when a component becomes shared or important
3. narrow `elements` types with `resolve()` when DOM precision matters

That keeps authoring fast while still letting your component contracts mature over time.
