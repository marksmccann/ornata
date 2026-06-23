---
title: Safeguards
slug: 'guides/safeguards'
description: Understand Ornata's runtime safeguards around roots, state, elements, and component contracts.
---

One of Ornata’s quiet strengths is that it treats component structure as a contract. That means the framework does more than provide helpers. It also checks common failure cases and reports problems when a component does not match its declared expectations.

These checks are especially helpful in HTML-first environments, where the DOM structure and the JavaScript enhancement layer need to stay aligned over time.

## Root safeguards

When an instance is mounted, Ornata will verify that the associated root element exists and is valid.

That means:

- invalid root input is rejected
- selector lookups that do not find an element will fail
- `root.matches` can validate that the mounted root matches an expected selector

## State safeguards

State options support several safety controls. These options help catch invalid state values and shape the public boundary of the component.

- `type`: validates the runtime value type
- `parse`: converts raw HTML-derived values into the desired shape
- `private`: hides the property from external reads and writes on the mounted public state
- `readonly`: allows external code to read the property but prevents external writes

## Element safeguards

Element resolution also has built-in checks. Because HTML is the integration surface and is often managed by another system, these safeguards are especially valuable. They help ensure the required markup is present and correctly structured so the component can initialize successfully.

- root-scoped DOM queries
- `min` and `max` count validation
- duplicate element reference detection
- explicit `resolve()` logic when you need custom contracts

## Constructor safeguards

The component constructor also offers some built-in safeguards including:

- mounting the same root twice is prevented
- attempting to retrieve a missing instance via `getInstance()` will fail

## A good mental model

Ornata is opinionated about component contracts. That makes components easier to trust, easier to debug, and less likely to fail silently.
