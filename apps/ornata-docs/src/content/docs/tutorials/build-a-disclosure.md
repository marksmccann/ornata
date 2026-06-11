---
title: Build a Disclosure
description: Build a progressively enhanced disclosure component contract step by step.
---


This tutorial walks through a small disclosure component from plain HTML to reusable interactive behavior.

## Step 1: Write the baseline HTML

```html
<section data-disclosure>
    <button
        type="button"
        aria-expanded="false"
        data-disclosure-button
    >
        More details
    </button>

    <div hidden data-disclosure-panel>
        This content exists in the page markup from the start.
    </div>
</section>
```

This is the important starting point: the content is already in the document.

## Step 2: Define the state

```ts
state: {
    open: { default: false, type: Boolean },
}
```

The disclosure only needs one reactive property: `open`.

## Step 3: Resolve the important elements

```ts
elements: {
    button: { query: "[data-disclosure-button]" },
    panel: { query: "[data-disclosure-panel]" },
}
```

## Step 4: Add a method

```ts
methods: {
    toggle() {
        this.state.open = !this.state.open;
    },
}
```

## Step 5: Render the state into the DOM

```ts
render: {
    button() {
        return {
            attributes: {
                "aria-expanded": String(this.state.open),
            },
            events: {
                click: () => this.methods.toggle(),
            },
        };
    },
    panel() {
        return {
            attributes: {
                hidden: !this.state.open,
            },
        };
    },
}
```

## Full component

```ts
import { defineComponent } from "ornata";

export const Disclosure = defineComponent({
    name: "Disclosure",
    state: {
        open: { default: false, type: Boolean },
    },
    elements: {
        button: { query: "[data-disclosure-button]" },
        panel: { query: "[data-disclosure-panel]" },
    },
    methods: {
        toggle() {
            this.state.open = !this.state.open;
        },
    },
    render: {
        button() {
            return {
                attributes: {
                    "aria-expanded": String(this.state.open),
                },
                events: {
                    click: () => this.methods.toggle(),
                },
            };
        },
        panel() {
            return {
                attributes: {
                    hidden: !this.state.open,
                },
            };
        },
    },
});
```

## Step 6: Mount it

```ts
Disclosure.mount("[data-disclosure]");
```

## What this tutorial shows

- the HTML stays meaningful on its own
- state drives interaction
- render output updates existing DOM
- methods keep imperative logic tidy

That is the core Ornata workflow in a very small example.
