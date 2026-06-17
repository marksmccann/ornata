---
title: Why Ornata?
description: Understand the problems Ornata is designed to solve and where it fits in the frontend ecosystem.
---

Understand the problems Ornata is designed to solve and where it fits in the frontend ecosystem.

## In short

Ornata exists to bring the benefits of component-driven development to environments where components do not necessarily produce the HTML they enhance.

It helps component authors package state, behavior, lifecycle, rendering, DOM references, and integration contracts into reusable components that can enhance existing HTML and render their own structure where needed.

Ornata is not a replacement for existing front-end tools. It exists for a focused purpose: making reusable interactive UI libraries easier to author, distribute, and evolve across environments.

## Component-driven development changed how we build UI

Component-driven development has become one of the dominant patterns in modern front-end architecture.

Tools like React, Vue, and Svelte helped popularize a model where user interfaces are built from encapsulated, reusable components with their own state, behavior, lifecycle, and rendering logic.

That model has proven useful across projects of many sizes and levels of complexity. For many teams, building UI with components now feels like the obvious choice.

Components make it easier to organize complex interfaces, reuse behavior, manage state, define boundaries, and evolve UI over time.

## But not every environment fits that model

Many modern UI technologies work best when components define the markup structure they interact with. That is a good model when an application controls how its HTML is produced.

But many real-world environments work differently.

Content management systems, server-rendered applications, template-driven platforms, design systems, and multi-framework environments often produce the initial HTML outside the interactive component itself. In those environments, component authors may still be able to influence markup through attributes, classes, conventions, and documentation. But they may not control the full system that produces the HTML.

That creates a gap.

Teams still want the benefits of component-driven development: encapsulation, portability, state, lifecycle, structure, and repeatable authoring patterns. But they also need to work within HTML-first architectures where markup may come from another system.

## Existing options solve parts of the problem

There are already many excellent tools for building interactive front-end experiences.

- React, Vue, and Svelte provide rich component models for building application interfaces. They are especially effective when the application can define and manage the UI structure directly.
- Alpine, Stimulus, and vanilla JavaScript are popular choices for progressively enhancing existing HTML. They work well for many use cases, especially when the goal is to add focused behavior to server-rendered pages.
- Web Components provide a native browser component model with custom elements and encapsulation. They can be a strong fit when adopting custom elements is desirable and compatible with the surrounding environment.

Each of these tools is useful. Ornata is not trying to replace them.

Ornata was designed specifically for teams that need both a familiar component model for authoring UI libraries and the flexibility to integrate those components into HTML-first environments.

## Where Ornata fits

| Tool                 | Best at                                                     | Tradeoff                                                                     |
| -------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| React / Vue / Svelte | Building rich application UIs with component-defined markup | Usually works best when components define the structure they interact with   |
| Alpine               | Adding lightweight interactivity directly in markup         | Less suited for packaging complex, encapsulated component libraries          |
| Stimulus             | Attaching behavior to existing HTML                         | Leaves more architecture, composition, and distribution decisions to authors |
| Vanilla JavaScript   | Maximum flexibility with no framework dependency            | Provides few conventions for scaling reusable UI libraries                   |
| Web Components       | Native custom elements and browser-level encapsulation      | Requires adopting the custom element model and its integration constraints   |
| Ornata               | Building portable UI libraries for HTML-first environments  | Focused on a narrower use case than full application frameworks              |

## What Ornata provides

Ornata provides a structured authoring model for building reusable interactive components in HTML-first environments.

Instead of leaving each component author to decide how state, behavior, rendering, lifecycle, DOM references, and integration details should be organized, Ornata gives those concerns a consistent place in the component definition.

That structure makes components easier to understand individually, easier to compose into UI libraries, and easier to distribute across environments where HTML may be produced in different ways.

## Is Ornata a good fit?

Ornata may be a good fit when...

- You are building a reusable UI library, not just one-off page behavior.
- Your components need to work across applications, teams, or frameworks.
- Your HTML may come from a CMS, server template, static page, or another framework.
- You want progressive enhancement with stronger structure and TypeScript support.
- You need components that are encapsulated, portable, and maintainable over time.

Ornata may not be necessary when...

- Your application already uses a single client-rendered framework successfully.
- Your components fully define and manage their own markup.
- You only need a few small one-off interactions.
- A framework-native component is already the simplest solution.
- A Web Component fits your use case and integration model well.
