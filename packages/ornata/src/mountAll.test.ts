// @vitest-environment jsdom

import { describe, expect, it, expectTypeOf, vi } from 'vitest';
import { defineComponent, mountAll } from './index.js';

describe('mountAll', () => {
    it('should infer the returned instance array from a single constructor', () => {
        const ComponentA = defineComponent({
            name: 'ComponentA',
            state: {
                count: {
                    default: 0,
                },
            },
        });
        const instances = mountAll({ ComponentA });

        expectTypeOf(instances).toEqualTypeOf<
            Array<InstanceType<typeof ComponentA>>
        >();
    });

    it('should infer a union of instance types from multiple constructors', () => {
        const ComponentA = defineComponent({
            name: 'ComponentA',
            state: {
                count: {
                    default: 0,
                },
            },
        });

        const ComponentB = defineComponent({
            name: 'ComponentB',
            state: {
                label: {
                    default: '',
                },
            },
        });
        const instances = mountAll({ ComponentA, ComponentB });

        expectTypeOf(instances).toEqualTypeOf<
            Array<
                | InstanceType<typeof ComponentA>
                | InstanceType<typeof ComponentB>
            >
        >();
    });

    it('should mount matching components from the document', () => {
        const ComponentA = defineComponent({ name: 'ComponentA' });
        const root = document.createElement('div');
        root.dataset.ornata = 'ComponentA';
        document.body.append(root);
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const instances = mountAll({ ComponentA });

        expect(instances).toHaveLength(1);
        expect(instances[0]).toBeInstanceOf(ComponentA);

        document.body.innerHTML = '';
        instances[0].dispose();
        consoleError.mockRestore();
    });
});
