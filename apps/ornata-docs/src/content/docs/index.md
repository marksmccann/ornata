---
title: Home
description: Build HTML-first server-rendered sites that progressively enhance into interactive experiences.
---

# Ornata

Ornata is a progressive enhancement framework for server-rendered websites.

It helps you keep HTML as the foundation of the experience, then layer on interactivity where it adds value.

## Why teams reach for it

- HTML-first pages still work before JavaScript runs
- interactivity can stay close to the DOM it enhances
- component logic can be introduced without adopting a full SPA architecture
- the public runtime stays small and focused

## What you can do today

The current Ornata runtime gives you three main exports:

- `defineComponent()` to declare a component constructor
- `createInitializer()` to mount components from `data-ornata` attributes
- `isComponent()` to detect Ornata component constructors at runtime

From there, components can manage:

- typed state
- DOM element lookups
- methods
- computed values
- watch callbacks
- lifecycle hooks
- rendering to classes, styles, attributes, dataset properties, text, HTML, and DOM events

## Start here

If you are new to Ornata, this is the recommended path:

1. Read [Why Ornata](/ornata/why-ornata/)
2. Follow [Getting Started](/ornata/guides/getting-started/)
3. Build [Your First Component](/ornata/guides/your-first-component/)
4. Learn [Initializing From HTML](/ornata/guides/initializing-from-html/)

If you want to use Ornata directly in a plain HTML page, the [Getting Started](/ornata/guides/getting-started/) guide also includes a browser CDN setup using the global build.

## Progressive enhancement, intentionally

Progressive enhancement starts with semantic HTML, adds CSS for presentation, and layers JavaScript only where it improves the experience.

That approach helps ensure:

- Content is accessible to everyone
- Sites work in any browsing environment
- JavaScript becomes an enhancement, not a requirement

Ornata is designed to support that workflow directly.
