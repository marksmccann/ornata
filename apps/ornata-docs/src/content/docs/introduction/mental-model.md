---
title: Mental Model
slug: 'mental-model'
description: Understand how Ornata thinks about components, HTML-first environments, and reusable UI libraries.
---

To build robust UI components outside a framework-managed DOM, you have to shift how you view the relationship between JavaScript and HTML. Here is how Ornata models that relationship.

## In short

Ornata treats interactive UI as reusable components that can attach to, read from, update, and sometimes create HTML.

The goal is to give component authors a consistent way to organize state, behavior, rendering, lifecycle, and DOM interactions while still supporting HTML-first environments.

## HTML is the integration surface

In Ornata, HTML is the boundary between a component and the environment using it.

A CMS, server template, static page, or application framework may produce the initial markup. Ornata components integrate with that markup through explicit references, attributes, classes, and conventions.

As the component author, you decide what the component expects from the surrounding HTML and how flexible that contract should be.

## Components are built around contracts

An Ornata component defines an explicit contract between interactive behavior and the HTML it enhances.

That contract dictates how configuration is read from `data-*` attributes, which child elements must already exist in the DOM, and which parts of the markup the component is allowed to dynamically generate.

## Every component has a root

Each Ornata component instance is tied to a single root element.

The root is the HTML element a component mounts to. It defines the boundary of the instance and scopes the markup the component uses.

That relationship lasts for the lifetime of the instance. Ornata uses the same root when mounting, querying internal elements, resolving instances, and unmounting. State can be initialized from it, element lookups are scoped within it, and lifecycle behavior is anchored to it.

## Conventions make components repeatable

While one-off progressive enhancements can be structured arbitrarily, reusable UI libraries demand strict architectural consistency. Ornata establishes a rigid, repeatable shape for component definitions—ensuring that state, rendering, and lifecycle events always live in predictable places.

## Progressive enhancement is the foundation

Ornata is designed to build on existing HTML instead of replacing it.

Whenever possible, components should preserve the underlying interface and layer interactivity on top. JavaScript should improve the experience, not become the only way the interface exists.

This keeps components aligned with HTML-first environments while still allowing richer interactions where they are needed.

## TypeScript supports the model

TypeScript is not just an add-on.

Ornata uses types to help model state, methods, elements, rendering, and integration contracts so component authors get better feedback while building reusable APIs.

The result is a component model that is easier to author, safer to evolve, and more practical to distribute.
