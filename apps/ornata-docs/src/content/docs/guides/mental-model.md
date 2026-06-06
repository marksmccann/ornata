---
title: Mental Model
description: The simplest way to think about Ornata components and how they fit into server-rendered pages.
---

# Mental Model

The cleanest way to think about Ornata is:

> HTML provides the structure. Ornata provides enhancement.

## A component is not the page

An Ornata component is a focused behavior layer attached to one root element.

That root already exists in the DOM. Ornata does not need to invent the page structure first. It enhances what the server rendered.

## State is local

Each mounted instance owns its own state object.

Changing state updates the component. That state does not become a global application store by default.

## Elements are resolved, not declared in templates

Instead of authoring a separate template language, Ornata resolves existing DOM nodes from the component root.

That keeps the JavaScript close to the rendered HTML structure.

## Rendering is targeted

Render callbacks return precise DOM instructions for a specific resolved element.

You are not re-rendering the whole page. You are applying focused updates where they matter.

## The progressive enhancement check

If you remove JavaScript entirely, the page should still have useful structure and meaning.

Ornata then makes it better:

- more interactive
- more responsive
- easier to use

That mindset tends to produce resilient UI.
