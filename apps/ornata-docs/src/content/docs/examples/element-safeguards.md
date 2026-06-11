---
title: Element Safeguards
description: See how Ornata's elements option can encode DOM expectations directly into a reusable component contract.
---


This example focuses on a small pattern with stronger DOM expectations than a simple selector helper.

## Live Demo

<iframe
    src="../../demos/element-safeguards.html"
    title="Element safeguards demo"
    loading="lazy"
    style="width: 100%; min-height: 380px; border: 1px solid var(--sl-color-gray-5); border-radius: 1rem; background: white;"
></iframe>

[Open this demo in a new tab](../../demos/element-safeguards.html)

## HTML

```html
<section data-tabs>
    <div role="tablist">
        <button type="button" data-tab>Overview</button>
        <button type="button" data-tab>Usage</button>
    </div>

    <section data-panel>Overview content</section>
    <section data-panel hidden>Usage content</section>
</section>
```

## Component

```ts
import { defineComponent } from "ornata";

export const Tabs = defineComponent<{
    state: {
        activeIndex: number;
    };
    elements: {
        tabs: HTMLButtonElement[];
        panels: HTMLElement[];
    };
}>({
    name: "Tabs",
    state: {
        activeIndex: { default: 0, type: Number },
    },
    elements: {
        tabs: {
            resolve(root) {
                return Array.from(
                    root.querySelectorAll("[data-tab]")
                ) as HTMLButtonElement[];
            },
            min: 2,
        },
        panels: {
            resolve(root) {
                return Array.from(
                    root.querySelectorAll("[data-panel]")
                ) as HTMLElement[];
            },
            min: 2,
        },
    },
    render: {
        tabs({ index }) {
            const currentIndex = index ?? 0;
            const isActive = currentIndex === this.state.activeIndex;

            return {
                attributes: {
                    "aria-selected": String(isActive),
                },
                classes: {
                    "is-active": isActive,
                },
                events: {
                    click: () => {
                        this.state.activeIndex = currentIndex;
                    },
                },
            };
        },
        panels({ index }) {
            const currentIndex = index ?? 0;

            return {
                attributes: {
                    hidden: currentIndex !== this.state.activeIndex,
                },
            };
        },
    },
});
```

## What this shows

- `resolve()` can return narrower types than generic `Element[]`
- `min: 2` documents a structural requirement directly in the component
- the component’s DOM dependencies are visible in one place
- render logic stays focused because the lookup work is already done

This is a good pattern for tabs, accordions, menus, and list-driven interactions.

For a render-focused version of this pattern, see [List Rendering](/ornata/examples/list-rendering/).
