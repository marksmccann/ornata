---
title: Component Anatomy
description: Learn how the defineComponent options form a component contract around state, DOM resolution, rendering, and lifecycle behavior.
---

`defineComponent()` is the main authoring API in Ornata.

It is where you describe how a reusable component fits into existing HTML, what it expects from the DOM, and how it reacts over time.

```ts
const Component = defineComponent({
    name: "Example",
    root: {},
    state: {},
    elements: {},
    lifecycle: {},
    watch: {},
    methods: {},
    computed: {},
    data: {},
    render: {},
});
```

You will not use every section in every component, but each one has a clear role.

## `name`

`name` sets the display name used in debugging and error reporting.

If you omit it, Ornata falls back to `"UnnamedComponent"`.

## `root`

Use `root.matches` when you want to validate that the mounted root matches a selector.

Every Ornata component instance has exactly one root element. That root is the boundary of the component instance: state can initialize from it, element lookups are scoped within it, and mounting or unmounting always happen relative to it.

```ts
root: {
    matches: "[data-counter]",
}
```

## `state`

`state` defines reactive properties for the component.

Each property supports:

- `default`
- `type`
- `parse`
- `private`
- `readonly`

```ts
state: {
    count: { default: 0, type: Number },
    label: { default: "Clicks", readonly: true },
}
```

### Why `state` is a bigger feature than it looks

State in Ornata is designed for HTML-first environments:

- defaults can be declared in the component
- initial values can come from root HTML `data-*` attributes
- mount-time `initialState` can override both
- writes trigger the component update flow automatically
- public access can be restricted with `private` and `readonly`

For a focused walkthrough, see [State](/ornata/guides/state/).

## `elements`

`elements` resolves important DOM references within the root element.

This is one of Ornata’s most valuable features because it turns DOM lookups into a defined part of the component contract instead of leaving them scattered across the implementation.

Each property can use:

- `query`
- `queryAll`
- `create`
- `resolve`
- `min`
- `max`

```ts
elements: {
    button: { query: "[data-count-button]" },
    items: { queryAll: "[data-item]" },
}
```

### Why `elements` is more than a convenience

Element resolution in Ornata comes with a few built-in safeguards:

- lookups are scoped to the component root
- `min` and `max` can validate expected element counts
- duplicate element references are detected
- `resolve()` gives you an explicit escape hatch for custom logic

That makes `elements` a strong fit for component APIs that depend on stable DOM structure.

```ts
elements: {
    tabs: {
        queryAll: "[data-tab]",
        min: 2,
    },
    panels: {
        queryAll: "[data-panel]",
        min: 2,
    },
}
```

For a dedicated walkthrough, see [Safe DOM References](/ornata/guides/safe-dom-references/).

## `methods`

`methods` defines internal reusable actions.

Methods are bound to the internal instance, so they can safely use `this.state`, `this.elements`, `this.computed`, and `this.data`.

```ts
methods: {
    increment() {
        this.state.count += 1;
    },
}
```

### Why `methods` deserves its own place

Methods are where your component’s named actions live.

They are especially useful for keeping render callbacks small and for centralizing event-driven logic that would otherwise be duplicated inline.

For a focused walkthrough, see [Methods](/ornata/guides/methods/).

## `computed`

`computed` derives values from state changes.

Computed callbacks receive a context object with:

- `type`
- `currentValue`
- `changedProperty`

```ts
computed: {
    total() {
        return this.state.count;
    },
}
```

## `watch`

`watch` reacts to state changes.

Watch callbacks receive:

- `type`
- `newValue`
- `oldValue`
- `isInitial`

```ts
watch: {
    count({ isInitial, newValue }) {
        if (!isInitial) {
            console.log("Updated:", newValue);
        }
    },
}
```

## `data`

`data` stores additional user-defined values on the internal instance.

Use it for values that do not need to be reactive.

```ts
data: {
    analyticsKey: "counter",
}
```

### Why `data` matters

`data` is the right place for persistent internal values that should survive for the life of the component instance without triggering updates.

Common examples include timer IDs, observer instances, caches, and third-party integration objects.

For a focused walkthrough, see [Data](/ornata/guides/data/).

## `render`

`render` maps resolved elements to DOM updates.

Each render callback returns a `RenderOptions` object with keys such as:

- `style`
- `classes`
- `attributes`
- `dataset`
- `events`
- `html`
- `text`

```ts
render: {
    value() {
        return {
            text: String(this.state.count),
        };
    },
}
```

## `lifecycle`

`lifecycle.mount` runs once when the component mounts.

`lifecycle.unmount` runs once when the component is disposed or unmounted.

```ts
lifecycle: {
    mount() {
        console.log("Mounted");
    },
    unmount() {
        console.log("Cleaned up");
    },
}
```

Lifecycle hooks are best for setup and cleanup work rather than DOM output.

For a deeper walkthrough, see [Lifecycle](/ornata/guides/lifecycle/).
