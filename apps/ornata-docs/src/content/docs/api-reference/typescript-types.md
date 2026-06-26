---
title: TypeScript Types
slug: 'api/typescript-types'
description: Ornata also exposes a public TypeScript type surface in addition to its runtime exports.
---

Ornata also exposes a public TypeScript type surface in addition to its runtime exports.

## Utility types

Use these when you want to derive types from an existing component constructor:

| Type                     | Description                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| `InferComponentInstance` | Derives the mounted public instance type from a component constructor. |
| `InferComponentState`    | Derives the mounted public state type from a component constructor.    |

## Core component types

Use these when defining, mounting, or sharing component contracts:

| Type                   | Description                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `ComponentOptions`     | The full options object accepted by `defineComponent()` when using explicit types.      |
| `ComponentConstructor` | The constructor returned by `defineComponent()`, including mounting and lookup helpers. |
| `ComponentInstance`    | The public mounted instance type exposed to outside code.                               |

## Component option types

Use these types when defining or shaping a component contract:

| Type               | Description                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `RootOptions`      | Root validation options used to constrain or verify the mounted root.                                |
| `StateOptions`     | Configuration for a single state property, including defaults, parsing, and safeguards.              |
| `ElementOptions`   | Configuration for a single element entry, including queries, creation, resolution, and count checks. |
| `MethodDefinition` | The callback type used for component methods with `this` bound to the internal instance.             |
| `RenderOptions`    | The object returned by render callbacks to describe DOM updates.                                     |

## Callback and context types

Use these when you want explicit types for callback signatures and their context objects:

| Type               | Description                                                                  |
| ------------------ | ---------------------------------------------------------------------------- |
| `WatchContext`     | The context object passed to `watch` callbacks.                              |
| `ComputedContext`  | The context object passed to `computed` callbacks.                           |
| `RenderContext`    | The context object passed to `render` callbacks.                             |
| `WatchCallback`    | The callback signature for `watch` entries with internal-instance `this`.    |
| `ComputedCallback` | The callback signature for `computed` entries with internal-instance `this`. |
| `RenderCallback`   | The callback signature for `render` entries that return `RenderOptions`.     |

## State listener types

Use these when typing public state subscriptions:

| Type                   | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `StateListenerEvent`   | The event payload emitted when a public state property changes. |
| `StateListener`        | The callback signature for public state subscriptions.          |
| `StateListenerCleanup` | The cleanup function returned by `addStateListener()`.          |

For a more guide-oriented explanation of explicit typing patterns, read [TypeScript](/ornata/guides/typescript/).
