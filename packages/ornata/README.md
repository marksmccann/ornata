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
});
```

## License

MIT
