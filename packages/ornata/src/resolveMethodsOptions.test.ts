// @vitest-environment jsdom

import type Ornata from './index.js';
import { describe, it, expect, vi } from 'vitest';
import resolveMethodsOptions from './resolveMethodsOptions.js';

describe('resolveMethodsOptions', () => {
    it('should return an empty object when no methods are provided', () => {
        const internalInstance = {} as Ornata.ComponentInternalInstance;
        const methods = resolveMethodsOptions(internalInstance, {});

        expect(methods).toStrictEqual({});
    });

    it('should return a method for each entry in methodsOptions', () => {
        const internalInstance = {} as Ornata.ComponentInternalInstance;
        const methods = resolveMethodsOptions(internalInstance, {
            greet: vi.fn(),
        });

        expect(typeof methods.greet).toBe('function');
    });

    it('should bind each method to the internal instance', () => {
        let capturedThis: unknown;
        const internalInstance = {
            root: document.createElement('div'),
            state: {},
            elements: {},
            methods: {},
            data: {},
        } as Ornata.ComponentInternalInstance;
        const methods = resolveMethodsOptions(internalInstance, {
            capture() {
                capturedThis = this;
            },
        });

        methods.capture();

        expect(capturedThis).toBe(internalInstance);
    });

    it('should forward arguments to the method', () => {
        const spy = vi.fn();
        const internalInstance = {} as Ornata.ComponentInternalInstance;
        const methods = resolveMethodsOptions(internalInstance, { spy });

        methods.spy('a', 1, true);

        expect(spy).toHaveBeenCalledWith('a', 1, true);
    });

    it('should return the value from the method', () => {
        const internalInstance = {} as Ornata.ComponentInternalInstance;
        const methods = resolveMethodsOptions(internalInstance, {
            getValue: () => 42,
        });

        expect(methods.getValue()).toBe(42);
    });

    it('should allow the method to access internal instance properties via this', () => {
        const root = document.createElement('div');
        const internalInstance = {
            root,
            state: {},
            elements: {},
            methods: {},
            data: {},
        } as Ornata.ComponentInternalInstance;
        let capturedRoot: unknown;
        const methods = resolveMethodsOptions(internalInstance, {
            getRoot() {
                capturedRoot = this.root;
            },
        });

        methods.getRoot();

        expect(capturedRoot).toBe(root);
    });
});
