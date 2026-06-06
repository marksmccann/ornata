---
title: Live Filter
description: A filtering example that updates the DOM from existing list markup.
---

# Live Filter

This example filters an existing list as the user types.

## Live Demo

<iframe
    src="../../demos/live-filter.html"
    title="Live filter demo"
    loading="lazy"
    style="width: 100%; min-height: 360px; border: 1px solid var(--sl-color-gray-5); border-radius: 1rem; background: white;"
></iframe>

[Open this demo in a new tab](../../demos/live-filter.html)

## HTML

```html
<section data-filter>
    <label>
        Search
        <input type="search" data-filter-input />
    </label>

    <ul data-filter-list>
        <li data-filter-item>Alpha</li>
        <li data-filter-item>Beta</li>
        <li data-filter-item>Gamma</li>
    </ul>
</section>
```

## Component

```ts
import { defineComponent } from "ornata";

export const LiveFilter = defineComponent<{
    state: {
        query: string;
    };
    elements: {
        input: HTMLInputElement | null;
        items: Element[];
    };
}>({
    name: "LiveFilter",
    state: {
        query: { default: "" },
    },
    elements: {
        input: {
            resolve(root) {
                return root.querySelector("[data-filter-input]");
            },
        },
        items: { queryAll: "[data-filter-item]" },
    },
    render: {
        input() {
            return {
                events: {
                    input: (event) => {
                        const target = event.currentTarget as HTMLInputElement;
                        this.state.query = target.value;
                    },
                },
            };
        },
        items({ index }) {
            const item = this.elements.items[index ?? 0];
            const text = item?.textContent?.toLowerCase() || "";
            const matches = text.includes(this.state.query.toLowerCase());

            return {
                attributes: {
                    hidden: !matches,
                },
            };
        },
    },
});
```

## Mount

```ts
LiveFilter.mount("[data-filter]");
```
