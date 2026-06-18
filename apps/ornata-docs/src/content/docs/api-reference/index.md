---
title: API Overview
slug: "api"
description: The public runtime API surface Ornata exposes for building and bootstrapping components in HTML-first environments.
---


Ornata currently exposes three runtime exports for defining components and enhancing HTML:

- `defineComponent`
- `mountAll`
- `isComponent`

The main authoring workflow starts with `defineComponent()`, then uses `mount()` directly or `mountAll()` for declarative bootstrapping.

Use the guides when you want conceptual explanations and authoring patterns. Use the API reference when you want exact runtime behavior, callback shapes, and public method details.

## Main exports

### `defineComponent()`

Creates an Ornata component constructor from typed component options.

### `mountAll()`

Scans the document for `data-ornata` roots and mounts matching components immediately.

### `isComponent()`

Checks whether a value is an Ornata component constructor.

## What a component constructor exposes

A component constructor returned by `defineComponent()` includes:

- `displayName`
- `mount()`
- `getInstance()`
- `findInstance()`
- `unmount()`
- `unmountAll()`

See [Component Instance](/ornata/api/component-instance/) for the mounted instance API and lifecycle details.
