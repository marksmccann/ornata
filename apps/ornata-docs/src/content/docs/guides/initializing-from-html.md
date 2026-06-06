---
title: Initializing From HTML
description: Use createInitializer to mount components declaratively from data-ornata attributes.
---

# Initializing From HTML

For pages with multiple components, Ornata can mount them declaratively from HTML using `createInitializer()`.

## Mark up component roots

Add a `data-ornata` attribute whose value matches the component name you want to initialize.

```html
<section data-ornata="Counter" data-counter>
    <span data-count-value>0</span>
    <button type="button" data-count-button>Increment</button>
</section>

<section data-ornata="Disclosure" data-disclosure>
    <button type="button" data-disclosure-button>Toggle</button>
    <div data-disclosure-panel>Panel content</div>
</section>
```

## Create the initializer

```ts
import { createInitializer } from "ornata";
import { Counter } from "./counter";
import { Disclosure } from "./disclosure";

const initialize = createInitializer({
    Counter,
    Disclosure,
});
```

## Run it

```ts
initialize();
```

The initializer will:

- find all elements with `data-ornata`
- look up the matching constructor from the object you passed in
- call `mount()` on each matching root
- remove the `data-ornata` attribute after initialization
- return an array of mounted instances

## Why this is useful

This pattern works well when your server already knows which component belongs to each root. It keeps the browser bootstrap code very small:

```ts
import { createInitializer } from "ornata";
import { components } from "./components";

createInitializer(components)();
```

## Important detail

The `data-ornata` value must match a real Ornata component constructor in the initializer map. If it does not, Ornata will report an error and skip that root.
