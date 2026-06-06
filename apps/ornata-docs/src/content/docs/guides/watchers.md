---
title: Watchers
description: Use watch callbacks for internal reactions to state changes inside an Ornata component.
---

# Watchers

`watch` lets a component react to changes in its own state.

This is the internal reaction mechanism in Ornata. It lives inside `defineComponent()` and runs as part of the component update flow.

## What a watcher receives

Each watcher is keyed by a state property name and receives a context object:

```ts
watch: {
    count({ newValue, oldValue, isInitial }) {
        console.log(newValue, oldValue, isInitial);
    },
}
```

The context includes:

- `newValue`
- `oldValue`
- `isInitial`
- `type`, which is always `"watch"`

## Initial watcher runs

Watchers also run during the initial mount update pass.

That is why `isInitial` exists:

```ts
watch: {
    count({ isInitial, newValue }) {
        if (isInitial) return;

        console.log("Count changed:", newValue);
    },
}
```

In practice, this usually means you should decide whether your watcher is meant to handle initialization, later updates, or both.

## When to use a watcher

Use `watch` for internal side effects such as:

- logging
- analytics
- timers
- imperative integrations
- syncing non-render concerns to state changes

## When not to use a watcher

Use other parts of Ornata when they fit better:

- use `render` for DOM output
- use `computed` for derived values
- use `addStateListener()` when code outside the component needs to observe public state changes

## Watchers versus render

If the goal is to update DOM state, prefer `render`.

```ts
render: {
    panel() {
        return {
            attributes: {
                hidden: !this.state.open,
            },
        };
    },
}
```

If the goal is to trigger a side effect because the state changed, use `watch`.

```ts
watch: {
    open({ isInitial, newValue }) {
        if (!isInitial && newValue) {
            console.log("Disclosure opened");
        }
    },
}
```

## Watchers versus computed

Use `computed` when you need a derived value that other component logic can read.

Use `watch` when you need behavior to happen because a value changed.

## A good mental model

Watchers are for internal reactions.

They belong to the component definition and are best when the component itself needs to respond to its own state changes.
