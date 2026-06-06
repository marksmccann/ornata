---
title: Render Options
description: Use render callbacks to map component state into direct DOM updates, including lists with index-aware rendering.
---

# Render Options

`render` is how Ornata turns component state into DOM output.

Each render callback returns a `RenderOptions` object for one resolved element or one item in a resolved element list.

## Basic shape

```ts
render: {
    value() {
        return {
            text: String(this.state.count),
        };
    },
}
```

## Available render outputs

Render callbacks can return:

- `text`
- `html`
- `attributes`
- `classes`
- `style`
- `dataset`
- `events`

These options can be combined in a single render result.

## `text`

Set `text` when you want to update `textContent`.

```ts
render: {
    label() {
        return {
            text: this.state.label,
        };
    },
}
```

## `html`

Set `html` when you want to update `innerHTML`.

```ts
render: {
    output() {
        return {
            html: `<strong>${this.state.message}</strong>`,
        };
    },
}
```

## `attributes`

Use `attributes` for standard and boolean attributes.

```ts
render: {
    panel() {
        return {
            attributes: {
                hidden: !this.state.open,
                "aria-expanded": String(this.state.open),
            },
        };
    },
}
```

Behavior summary:

- string values set the attribute
- `true` adds a boolean attribute
- `false` removes a boolean attribute
- `null` removes the attribute
- `undefined` leaves it unchanged

## `classes`

Use `classes` for class toggling.

```ts
render: {
    item() {
        return {
            classes: {
                "is-active": this.state.active,
            },
        };
    },
}
```

## `style`

Use `style` for inline style updates.

```ts
render: {
    panel() {
        return {
            style: {
                display: this.state.open ? "block" : "none",
            },
        };
    },
}
```

Behavior summary:

- string values set the style property
- `null` removes the property
- `undefined` leaves it unchanged

## `dataset`

Use `dataset` for `data-*` updates.

```ts
render: {
    item() {
        return {
            dataset: {
                state: this.state.active ? "active" : "idle",
            },
        };
    },
}
```

Behavior summary:

- string values set the dataset property
- `null` removes the dataset property
- `undefined` leaves it unchanged

## `events`

Use `events` to attach event handlers.

```ts
render: {
    button() {
        return {
            events: {
                click: () => this.methods.increment(),
            },
        };
    },
}
```

## Rendering lists with `index`

When the rendered element is an array, Ornata passes `index` in the render context.

```ts
render: {
    items({ index }) {
        const currentIndex = index ?? 0;

        return {
            classes: {
                "is-active": currentIndex === this.state.activeIndex,
            },
        };
    },
}
```

This is especially useful for:

- tabs
- menus
- repeated buttons
- repeated panels
- filtered or selected lists

## A good mental model

Render callbacks should describe DOM output, not general side effects.

That usually means:

- `render` for visual and attribute updates
- `watch` for internal side effects
- lifecycle hooks for setup and cleanup
