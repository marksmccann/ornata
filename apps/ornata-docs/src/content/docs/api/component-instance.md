---
title: Component Instance
description: Work with mounted component instances and constructor-level instance helpers.
---

# Component Instance

When you mount a component, Ornata returns a component instance.

```ts
const instance = Counter.mount(root);
```

## Instance shape

The public instance currently exposes:

- `root`
- `state`
- `dispose()`
- `addStateListener()`

## `root`

`root` is the resolved root element the component was mounted on.

## `state`

`state` is the public reactive state object.

Updating writable public properties triggers the component update flow.

Properties marked `private` or `readonly` in state options are protected from external writes.

## `dispose()`

`dispose()` unmounts the instance and runs cleanup behavior, including:

- update cleanup
- state listener cleanup
- `lifecycle.unmount()`

## `addStateListener()`

Use `addStateListener()` to subscribe to a specific state property.

```ts
const cleanup = instance.addStateListener("count", (event) => {
    console.log(event.newValue);
});
```

The listener receives:

```ts
{
    property,
    newValue,
    oldValue,
    target,
}
```

The method returns a cleanup function that removes the listener.

## Constructor helpers

The component constructor also provides instance-management helpers:

- `mount(root, initialState?)`
- `getInstance(root)`
- `findInstance(root)`
- `unmount(root)`

Use `getInstance()` when absence should throw, and `findInstance()` when absence is an expected branch.
