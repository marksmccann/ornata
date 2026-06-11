---
title: Mental Model
description: Understand how Ornata thinks about components, HTML-first environments, and reusable UI libraries.
---


Understand how Ornata thinks about components, HTML-first environments, and reusable UI libraries.

## In short

Ornata treats interactive UI as reusable components that can attach to, read from, update, and sometimes create HTML.

The goal is to give component authors a consistent way to organize state, behavior, rendering, lifecycle, and DOM interactions while still supporting HTML-first environments.

## HTML is the integration surface

In Ornata, HTML is the boundary between a component and the environment using it.

A CMS, server template, static page, or application framework may produce the initial markup. Ornata components integrate with that markup through explicit references, attributes, classes, and conventions.

As the component author, you decide what the component expects from the surrounding HTML and how flexible that contract should be.

## Components are built around contracts

An Ornata component defines a contract between interactive behavior and the HTML it enhances.

That contract may include required elements, optional elements, attributes, classes, generated structure, configuration, events, and fallback behavior. Some components may only enhance existing markup. Others may render supporting structure or manage more of their internal DOM.

The important part is that these expectations are intentional and visible in the component definition.

## Conventions make components repeatable

One-off progressive enhancements can be organized however the author chooses.

Reusable UI libraries need stronger patterns.

Ornata gives components a consistent shape so state, behavior, rendering, lifecycle, DOM references, and events each have a clear place. That repeatability makes components easier to understand individually and easier to maintain as part of a larger library.

## Progressive enhancement is the foundation

Ornata is designed to build on existing HTML instead of replacing it.

Whenever possible, components should preserve the underlying interface and layer interactivity on top. JavaScript should improve the experience, not become the only way the interface exists.

This keeps components aligned with HTML-first environments while still allowing richer interactions where they are needed.

## TypeScript supports the model

TypeScript is not just an add-on.

Ornata uses types to help model state, methods, elements, rendering, and integration contracts so component authors get better feedback while building reusable APIs.

The result is a component model that is easier to author, safer to evolve, and more practical to distribute.
