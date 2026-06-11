---
title: Persistent Data
description: Use data to keep internal values alive across lifecycle hooks and component behavior without making them reactive state.
---


This example shows why `data` is useful for values that need to persist inside a reusable component without participating in rendering.

## Live Demo

<iframe
    src="../../demos/persistent-data.html"
    title="Persistent data demo"
    loading="lazy"
    style="width: 100%; min-height: 360px; border: 1px solid var(--sl-color-gray-5); border-radius: 1rem; background: white;"
></iframe>

[Open this demo in a new tab](../../demos/persistent-data.html)

## Component

```ts
import { defineComponent } from "ornata";

export const Clock = defineComponent<{
    data: {
        intervalId: number | null;
    };
}>({
    name: "Clock",
    data: {
        intervalId: null,
    },
    lifecycle: {
        mount() {
            this.data.intervalId = window.setInterval(() => {
                console.log("tick");
            }, 1000);
        },
        unmount() {
            if (this.data.intervalId !== null) {
                window.clearInterval(this.data.intervalId);
            }
        },
    },
});
```

## Why this belongs in `data`

`intervalId` needs to:

- persist for the life of the mounted instance
- be available in both `mount` and `unmount`
- avoid triggering the render/update flow

That makes `data` the right fit.

## When not to use `data`

If the value should drive DOM updates or public component behavior, use `state` instead.
