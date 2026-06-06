---
title: Component Anatomy
description: Learn how the defineComponent options map to state, DOM resolution, rendering, and lifecycle behavior.
---

# Component Anatomy

`defineComponent()` is the main authoring API in Ornata.

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

## `elements`

`elements` resolves important DOM references within the root element.

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
