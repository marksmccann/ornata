---
title: isComponent
slug: 'api/is-component'
description: Check whether a value is an Ornata component constructor.
---

The API for `isComponent()`; a runtime type guard for Ornata component constructors.

## Import

```js
import { isComponent } from 'ornata';

const { isComponent } = window.Ornata;
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
