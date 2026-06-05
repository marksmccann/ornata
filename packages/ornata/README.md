# Ornata

A progressive enhancement framework for server-rendered websites.

Ornata helps you build HTML-first sites that work without JavaScript, then progressively enhance them with interactivity where needed.

## Installation

```bash
npm install ornata
```

## Usage

```ts
import { defineComponent } from "ornata";
import type Ornata from "ornata";

type Counter = Ornata.ComponentShape<{
    state: {
        count: number;
        label: string;
    };
    computed: {
        total: number;
    };
    methods: {
        increment(): void;
    };
}>;

const CounterComponent = defineComponent<Counter>({
    name: "Counter",
    state: {
        count: { default: 0 },
        label: { default: "Clicks" },
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
            console.log("Recomputing because:", changedProperty, currentValue);
            return this.state.count;
        },
    },
});
```

## License

MIT
