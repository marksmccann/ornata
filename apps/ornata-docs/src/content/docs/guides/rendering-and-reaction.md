---
title: Rendering and Reaction
description: Understand how state updates trigger computed values, watch callbacks, and DOM rendering.
---

# Rendering and Reaction

Ornata components react to state changes in a predictable sequence.

## The update flow

When a state property changes after initialization, Ornata:

1. validates the new value against the property options
2. recomputes computed values
3. runs render callbacks and applies DOM updates
4. runs the matching watch callback
5. notifies external state listeners registered with `addStateListener()`

That means render and watch logic both respond to the same state transition, but they serve different purposes.

## Use `render` for DOM output

`render` should be your primary way to reflect state into the DOM.

```ts
render: {
    panel() {
        return {
            attributes: {
                hidden: !this.state.open,
            },
            classes: {
                "is-open": this.state.open,
            },
        };
    },
}
```

For a full walkthrough of `text`, `html`, `attributes`, `classes`, `style`, `dataset`, `events`, and list rendering with `index`, see [Render Options](/ornata/guides/render-options/).

## Use `watch` for side effects

`watch` is best for logging, analytics, timers, imperative integrations, and other side effects.

```ts
watch: {
    open({ isInitial, newValue }) {
        if (!isInitial && newValue) {
            console.log("Disclosure opened");
        }
    },
}
```

For a deeper walkthrough of watcher behavior and `isInitial`, see [Watchers](/ornata/guides/watchers/).

## Use `computed` for derived values

Computed values help when multiple render callbacks or methods need the same derived data.

```ts
computed: {
    countLabel() {
        return this.state.count === 1 ? "item" : "items";
    },
}
```

## Initial updates

During mount, Ornata performs an initial update pass for each state property. That is why watch callbacks receive `isInitial`, and why render output is available immediately after mount.

## External subscriptions

When code outside the component needs to react to public state changes, use `addStateListener()` on the mounted instance instead of putting that logic in `watch`.

See [State Listeners](/ornata/guides/state-listeners/) for that pattern.
