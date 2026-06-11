---
title: Safeguards
description: Understand Ornata's runtime safeguards around roots, state, elements, and component contracts.
---

One of Ornata’s quiet strengths is that it treats component structure as a contract.

That means the framework does more than provide helpers. It also checks common failure cases and reports problems when a component does not match its declared expectations.

## Root safeguards

Mounting APIs validate root lookup.

That means:

- invalid root input is rejected
- selector lookups that do not find an element fail clearly
- `root.matches` can validate that the mounted root matches an expected selector

## State safeguards

State options support several safety controls:

- `type`
- `parse`
- `private`
- `readonly`

These help catch invalid state values and shape the public boundary of the component.

## Element safeguards

Element resolution also has built-in checks:

- root-scoped DOM queries
- `min` and `max` count validation
- duplicate element reference detection
- explicit `resolve()` logic when you need custom contracts

## Constructor safeguards

The component constructor helpers also lean toward explicit behavior:

- mounting the same root twice is prevented
- getting a missing instance can fail clearly
- `findInstance()` gives you a safe nullable branch when that is what you want

## Why this matters

These checks are especially helpful in HTML-first environments, where the DOM structure and the JavaScript enhancement layer need to stay aligned over time.

## A good mental model

Ornata is opinionated about component contracts.

That makes components easier to trust, easier to debug, and less likely to fail silently.
