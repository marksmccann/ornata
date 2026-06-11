---
title: API Overview
description: The public runtime API surface Ornata exposes for building and bootstrapping components in HTML-first environments.
---


Ornata currently exposes three runtime exports for defining components and enhancing HTML:

- `defineComponent`
- `createInitializer`
- `isComponent`

The main authoring workflow starts with `defineComponent()`, then uses `mount()` directly or `createInitializer()` for declarative bootstrapping.

## Main exports

### `defineComponent()`

Creates an Ornata component constructor from typed component options.

### `createInitializer()`

Creates a function that scans the document for `data-ornata` roots and mounts matching components.

### `isComponent()`

Checks whether a value is an Ornata component constructor.

## What a component constructor exposes

A component constructor returned by `defineComponent()` includes:

- `displayName`
- `mount()`
- `getInstance()`
- `findInstance()`
- `unmount()`

See [Component Instance](/ornata/api/component-instance/) for the mounted instance API and lifecycle details.
