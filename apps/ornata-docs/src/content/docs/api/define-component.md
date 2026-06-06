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

### `elements`

DOM resolution options keyed by property name.

Each property supports:

- `query`
- `queryAll`
- `create`
- `resolve`
- `min`
- `max`

### `lifecycle`

Lifecycle hooks:

- `mount()`
- `unmount()`

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

### `methods`

Internal reusable actions bound to the component instance.

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
