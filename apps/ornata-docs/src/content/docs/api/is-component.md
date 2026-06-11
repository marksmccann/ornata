---
title: isComponent
description: Check whether a value is an Ornata component constructor.
---


`isComponent()` is a runtime type guard for Ornata component constructors.

```ts
import { isComponent } from "ornata";
```

## Example

```ts
if (isComponent(value)) {
    value.mount(root);
}
```

## When it helps

You will usually use `isComponent()` in framework internals, registries, or defensive bootstrap code.

It is especially useful when working with dynamic component maps or values from untyped boundaries.
