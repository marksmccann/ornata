# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.4.0](https://github.com/marksmccann/ornata/compare/v0.3.1...v0.4.0) (2026-06-18)

### Features

- **ornata:** add component unmountAll helper ([89df27a](https://github.com/marksmccann/ornata/commit/89df27a4670655408d0ce496d6eec65fa93d5b2b))

## [0.3.1](https://github.com/marksmccann/ornata/compare/v0.3.0...v0.3.1) (2026-06-06)

**Note:** Version bump only for package ornata-docs

# [0.3.0](https://github.com/marksmccann/ornata/compare/v0.2.0...v0.3.0) (2026-06-06)

### Code Refactoring

- **instance:** rename component instance management methods ([b31a10c](https://github.com/marksmccann/ornata/commit/b31a10c1bc144e78997f633c07ecbca4e60fe39b))

### Features

- **ornata:** add callback context objects for framework hooks ([a479b36](https://github.com/marksmccann/ornata/commit/a479b36a1bfe0fae3fd9b415583ed463c5d16bac))
- **ornata:** improve defineComponent typing ergonomics ([700ae6c](https://github.com/marksmccann/ornata/commit/700ae6ca81e121f46f575842b6319384706e68b6))

### BREAKING CHANGES

- **instance:** Components must use Component.mount, Component.findInstance, and Component.unmount
  instead of createInstance, queryInstance, and deleteInstance. Component.updateInstance has been
  removed.
- **ornata:** ComponentShape has been removed in favor of defineComponent<{ ... }> typing.
- **ornata:** watch, computed, and render callbacks now receive context objects instead of
  positional arguments.

# 0.2.0 (2026-06-05)

### Features

- **ornata:** start creating defineComponent and type definitions ([e2151cf](https://github.com/marksmccann/ornata/commit/e2151cf020e507a53787a9fc1bbb1c431881f6a9))
- setup project + create core package and docs app ([1d6729b](https://github.com/marksmccann/ornata/commit/1d6729b240c55d9514e8bea9d83a40bce658360b))
