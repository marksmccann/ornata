---
title: createInitializer
description: Create a document-level initializer that mounts components from data-ornata attributes.
---

# createInitializer

`createInitializer()` creates a function that mounts Ornata components from HTML.

```ts
import { createInitializer } from "ornata";
```

## Basic usage

```ts
const initialize = createInitializer({
    Counter,
    Disclosure,
});

initialize();
```

## Expected HTML

The initializer looks for elements with a `data-ornata` attribute:

```html
<section data-ornata="Counter"></section>
<section data-ornata="Disclosure"></section>
```

The attribute value must match a key in the constructor map you pass to `createInitializer()`.

## Return value

Calling the returned initializer function returns an array of mounted instances.

```ts
const instances = initialize();
```

## Behavior notes

- roots are selected with `document.querySelectorAll("[data-ornata]")`
- each matching constructor is validated with `isComponent()`
- each matching root is mounted with `component.mount(rootElement)`
- the `data-ornata` attribute is removed after mounting

This makes it a good fit for page-level bootstrap code in server-rendered apps.
