---
title: Disclosure
description: A disclosure pattern that keeps the content in the HTML and uses Ornata to manage open state.
---

# Disclosure

Disclosure is a good example of progressive enhancement because the content already exists in the markup.

## HTML

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
        Progressive enhancement keeps this content in the document.
    </div>
</section>
```

## Component

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
