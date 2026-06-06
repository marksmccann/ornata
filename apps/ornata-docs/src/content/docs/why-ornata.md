---
title: Why Ornata
description: Why an HTML-first progressive enhancement framework can be a strong default for server-rendered websites.
---

# Why Ornata

Ornata is built for server-rendered websites that want interactivity without turning the browser into the primary application runtime.

That makes it a good fit when you want to:

- keep HTML as the source of truth
- ship pages that work before JavaScript runs
- add focused interactivity to specific parts of a page
- avoid rebuilding your site architecture around a full client-side framework
- keep a strong TypeScript experience without requiring heavy component abstractions

## The core idea

Start with semantic HTML that already communicates the content and the baseline user flow.

Then use Ornata to attach behavior to that markup:

- state lives inside the component
- elements are resolved from the existing DOM
- render functions update attributes, classes, styles, text, HTML, dataset values, and event listeners
- watch and computed callbacks react to state changes

The same authoring model also works well with TypeScript, whether you prefer inferred types from the options object or explicit named interfaces for longer-lived component contracts.

This lets you progressively enhance the page instead of replacing it.

## What Ornata is not trying to be

Ornata is not a virtual DOM framework, a router, or a complete SPA architecture. It is intentionally smaller and more focused.

You should think of it as a component runtime for interactive islands inside a server-rendered page.

## A practical mindset

When deciding whether a feature belongs in Ornata, this question usually helps:

> Can this begin as normal HTML and become better with JavaScript?

If the answer is yes, Ornata is likely a good fit.
