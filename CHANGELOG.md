# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.5.0](https://github.com/marksmccann/ornata/compare/v0.4.0...v0.5.0) (2026-06-18)

### Features

- **ornata:** replace createInitializer with mountAll ([35b72b4](https://github.com/marksmccann/ornata/commit/35b72b405973b0d8ba01601c230aa44d69e9790b))

# [0.4.0](https://github.com/marksmccann/ornata/compare/v0.3.1...v0.4.0) (2026-06-18)

### Features

- **ornata:** add component unmountAll helper ([89df27a](https://github.com/marksmccann/ornata/commit/89df27a4670655408d0ce496d6eec65fa93d5b2b))

## [0.3.1](https://github.com/marksmccann/ornata/compare/v0.3.0...v0.3.1) (2026-06-06)

**Note:** Version bump only for package ornata

# [0.3.0](https://github.com/marksmccann/ornata/compare/v0.2.0...v0.3.0) (2026-06-06)

### Bug Fixes

- **ornata:** resolve env typing conflict ([42380c2](https://github.com/marksmccann/ornata/commit/42380c29c69b7c8294cf9b31aed56a3985847a62))

### Code Refactoring

- **instance:** rename component instance management methods ([b31a10c](https://github.com/marksmccann/ornata/commit/b31a10c1bc144e78997f633c07ecbca4e60fe39b))
- **lifecycle:** rename setup and teardown hooks to mount and unmount ([d9c72ad](https://github.com/marksmccann/ornata/commit/d9c72ad5e5cbe652fddcba683c598f9c3669af0d))

### Features

- **definecomponent:** streamline state listener subscriptions ([f38ccb6](https://github.com/marksmccann/ornata/commit/f38ccb662874a28539698c710382b76b1de1cf95))
- **ornata:** add callback context objects for framework hooks ([a479b36](https://github.com/marksmccann/ornata/commit/a479b36a1bfe0fae3fd9b415583ed463c5d16bac))
- **ornata:** improve defineComponent typing ergonomics ([700ae6c](https://github.com/marksmccann/ornata/commit/700ae6ca81e121f46f575842b6319384706e68b6))

### BREAKING CHANGES

- **instance:** Components must use Component.mount, Component.findInstance, and Component.unmount
  instead of createInstance, queryInstance, and deleteInstance. Component.updateInstance has been
  removed.
- **lifecycle:** Components must now define lifecycle.mount and lifecycle.unmount instead of
  lifecycle.setup and lifecycle.teardown.
- **ornata:** ComponentShape has been removed in favor of defineComponent<{ ... }> typing.
- **ornata:** watch, computed, and render callbacks now receive context objects instead of
  positional arguments.
- **definecomponent:** removeStateListener was removed; use the cleanup function returned by
  addStateListener, whose callback now receives an event object.

# 0.2.0 (2026-06-05)

### Bug Fixes

- **definecomponent:** fix addStateListener implementation ([e975f7c](https://github.com/marksmccann/ornata/commit/e975f7c122f9d0f99d3568130fbb757a40d2aeba))
- restore state parsing behavior ([af22300](https://github.com/marksmccann/ornata/commit/af22300324e84d7187be2c84a94556bb86f485c5))

### Features

- add implementation for the watch option + add build script ([ec08ca4](https://github.com/marksmccann/ornata/commit/ec08ca4eb2a2eb369e746bbded4f8271d9271895))
- create the "createInitializer" export ([ead61ef](https://github.com/marksmccann/ornata/commit/ead61ef17c7c4b6ba6a780a4958c4df7401078c8))
- **definecomponent:** add implementation and tests for the elements option ([806f5d8](https://github.com/marksmccann/ornata/commit/806f5d8e0acc7e2de9e6984824e9c89fedb5eb14))
- **definecomponent:** add implementation for the root and state options ([e13d9d2](https://github.com/marksmccann/ornata/commit/e13d9d21ee7aadbdcb64a1fa04e388e5af37c998))
- **definecomponent:** add methods and data options + setup state management ([7977e9f](https://github.com/marksmccann/ornata/commit/7977e9f5651add697e3a1b50b5bca9ced5124a0b))
- **definecomponent:** add support for state listeners ([ffb6ac9](https://github.com/marksmccann/ornata/commit/ffb6ac95e9e47318035f11098ae3806717ca902c))
- **definecomponent:** add support for the "computed" option ([37b8bd4](https://github.com/marksmccann/ornata/commit/37b8bd4ca1f993ac4ed8a525dec686b1c1ba7c06))
- **definecomponent:** add the implementation for the render option ([35648e9](https://github.com/marksmccann/ornata/commit/35648e95e1f69941291bf676f4c3373f865f23a9))
- **definecomponent:** build foundation for the render functionality ([a2faecc](https://github.com/marksmccann/ornata/commit/a2faecc335d5b4691ebb092e8c2a004411e1b212))
- **iscomponent:** add utility function + update build scripts ([bc2a109](https://github.com/marksmccann/ornata/commit/bc2a1098ec5773c569b0743e705a29215d8774c1))
- **ornata:** start creating defineComponent and type definitions ([e2151cf](https://github.com/marksmccann/ornata/commit/e2151cf020e507a53787a9fc1bbb1c431881f6a9))
- setup project + create core package and docs app ([1d6729b](https://github.com/marksmccann/ornata/commit/1d6729b240c55d9514e8bea9d83a40bce658360b))
