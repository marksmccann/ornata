---
title: defineComponent
description: Define a component constructor with state, elements, methods, computed values, watch callbacks, and render behavior.
---

# defineComponent

`defineComponent()` is the primary Ornata authoring API.

```ts
import { defineComponent } from "ornata";
```

## Basic shape

```ts
const Counter = defineComponent({
    name: "Counter",
    state: {
        count: { default: 0 },
    },
    methods: {
        increment() {
            this.state.count += 1;
        },
    },
});
```

## What it returns

It returns a component constructor with static methods for mounting and instance lookup:

```ts
const instance = Counter.mount(root);
const sameInstance = Counter.getInstance(root);
const maybeInstance = Counter.findInstance(root);
Counter.unmount(root);
```

## Options

### `name`

Optional display name used in debugging and reporting.

### `root`

Root validation options. Currently supports:

- `matches`

### `state`

Reactive state configuration keyed by property name.

Each property supports:

- `default`
- `type`
- `parse`
- `private`
- `readonly`

State values can be resolved from multiple sources:

- `default` values in the component definition
- matching `data-*` values on the root HTML element
- `initialState` passed to `mount()`

When more than one source is present, later sources win:

1. component defaults
2. HTML dataset values
3. mount-time `initialState`

After mount, state updates trigger Ornata’s update flow automatically.

### `elements`

DOM resolution options keyed by property name.

Each property supports:

- `query`
- `queryAll`
- `create`
- `resolve`
- `min`
- `max`

These options do more than just save query boilerplate:

- lookups are scoped to the component root
- `min` and `max` validate expected counts
- duplicate references are reported
- `resolve()` supports custom and more strongly typed resolution logic

### `lifecycle`

Lifecycle hooks:

- `mount()`
- `unmount()`

Use lifecycle hooks for setup and teardown work associated with the component existing.

### `watch`

Watch callbacks keyed by state property name.

Each callback receives:

```ts
{
    type: "watch";
    newValue: T;
    oldValue: T;
    isInitial: boolean;
}
```

Use `watch` for internal reactions owned by the component itself.

When external code needs to observe public state updates, prefer `addStateListener()` on the mounted instance instead.

### `methods`

Internal reusable actions bound to the component instance.

Methods can access the component’s internal `state`, `elements`, `methods`, `data`, and `computed` values. They are a good fit for named actions like `toggle()`, `increment()`, `reset()`, or `setActiveIndex(index)`.

### `computed`

Derived values keyed by property name.

Each callback receives:

```ts
{
    type: "computed";
    currentValue: T;
    changedProperty: keyof State;
}
```

### `data`

Additional user-defined internal data that does not trigger reactive updates.

Use `data` for persistent internal values such as timer IDs, observer instances, caches, or integration objects that should survive for the life of the component instance without becoming reactive state.

### `render`

Render callbacks keyed by resolved element name.

Each render callback returns `RenderOptions`, which may include:

- `style`
- `classes`
- `attributes`
- `dataset`
- `events`
- `html`
- `text`

When the rendered element is an array, the render context also includes `index`.

## Typing patterns

Ornata supports two strong authoring styles:

- inferred typing from the options object
- explicit typing via component parts passed as the generic argument

```ts
interface CounterState {
    count: number;
}

const Counter = defineComponent<{
    state: CounterState;
}>({
    state: {
        count: { default: 0 },
    },
});
```

Use explicit parts when you want stable named interfaces, clearer contracts, or richer editor documentation.
