# Ornata

A progressive enhancement framework for server-rendered websites.

Ornata helps you build HTML-first sites that work without JavaScript, then progressively enhance them with interactivity where needed.

## Installation

```bash
npm install ornata
```

## Usage

```ts
import { defineComponent } from 'ornata';

const CounterComponent = defineComponent({
    name: 'Counter',
    state: {
        count: { default: 0 },
        label: { default: 'Clicks' },
    },
    methods: {
        increment() {
            this.state.count += 1;
        },
    },
    watch: {
        count({ newValue, oldValue, isInitial }) {
            if (isInitial) return;

            console.log(`Count changed from ${oldValue} to ${newValue}`);
        },
    },
    computed: {
        total({ currentValue, changedProperty }) {
            console.log('Recomputing because:', changedProperty, currentValue);
            return this.state.count;
        },
    },
});

const instance = CounterComponent.mount(
    document.querySelector('[data-counter]')
);
```

## Typed Usage

Use a named state interface when you want property descriptions to follow through to consumers.

```ts
import { defineComponent } from 'ornata';

interface CounterState {
    /** The current visible count. */
    count: number;

    /** The label shown next to the count. */
    label: string;
}

interface CounterMethods {
    increment(): void;
}

const CounterComponent = defineComponent<{
    state: CounterState;
    methods: CounterMethods;
}>({
    name: 'Counter',
    state: {
        count: { default: 0 },
        label: { default: 'Clicks' },
    },
    methods: {
        increment() {
            this.state.count += 1;
        },
    },
});

const instance = CounterComponent.mount(
    document.querySelector('[data-counter]')
);
```

You can use the same named-type pattern for `elements`, `data`, and `computed` when you want stronger contracts or clearer documentation for maintainers.

When you need to work with mounted instances imperatively, use the component constructor methods:

```ts
const instance = CounterComponent.mount(root);
const sameInstance = CounterComponent.getInstance(root);
const maybeInstance = CounterComponent.findInstance(root);
CounterComponent.unmount(root);
```

## License

MIT
