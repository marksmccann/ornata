// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import getStateFromElement from './getStateFromElement.js';
import reporter from './reporter.js';

describe('getStateFromElement', () => {
    it('should get state from element with default', () => {
        const element = document.createElement('div');
        element.dataset.name = 'test';
        const state = getStateFromElement<{
            root: Element;
            state: { name: string };
            elements: {};
            methods: {};
            data: {};
            computed: {};
        }>({ name: { default: 'fallback' } }, 'Test', element);

        expect(state).toStrictEqual({ name: 'test' });
    });

    it('should get state from element with parse', () => {
        const element = document.createElement('div');
        element.dataset.name = 'test';
        const state = getStateFromElement(
            { name: { parse: (value) => value.toUpperCase() } },
            'Test',
            element
        );

        expect(state).toStrictEqual({ name: 'TEST' });
    });

    it('should get state from element with type', () => {
        const element = document.createElement('div');
        element.dataset.name = 'test';
        const state = getStateFromElement(
            { name: { type: String } },
            'Test',
            element
        );

        expect(state).toStrictEqual({ name: 'test' });
    });

    it('should parse a number value', () => {
        const element = document.createElement('div');
        element.dataset.name = '123';
        const state = getStateFromElement(
            { name: { type: Number } },
            'Test',
            element
        );

        expect(state).toStrictEqual({ name: 123 });
    });

    it('should parse a boolean value', () => {
        const element = document.createElement('div');
        element.dataset.name = 'true';
        const state = getStateFromElement(
            { name: { type: Boolean } },
            'Test',
            element
        );

        expect(state).toStrictEqual({ name: true });
    });

    it('should parse an array value', () => {
        const element = document.createElement('div');
        element.dataset.name = '[1,2,3]';
        const state = getStateFromElement(
            { name: { type: Array } },
            'Test',
            element
        );

        expect(state).toStrictEqual({ name: [1, 2, 3] });
    });

    it('should parse an object value', () => {
        const element = document.createElement('div');
        element.dataset.name = '{"name":"test"}';
        const state = getStateFromElement(
            { name: { type: Object } },
            'Test',
            element
        );

        expect(state).toStrictEqual({ name: { name: 'test' } });
    });

    it('should not parse a function value', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const element = document.createElement('div');
        element.dataset.name = 'function() { return "test"; }';
        const state = getStateFromElement(
            { name: { type: Function } },
            'Test',
            element
        );

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR08', {
                componentName: 'Test',
                value: 'function() { return "test"; }',
                property: 'name',
            })
        );
        expect(state).toStrictEqual({ name: undefined });
    });

    it('should not parse if value is not provided', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const element = document.createElement('div');
        element.dataset.name = '';
        const state = getStateFromElement(
            { name: { type: String } },
            'Test',
            element
        );

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR08', {
                componentName: 'Test',
                value: undefined,
                property: 'name',
            })
        );
        expect(state).toStrictEqual({});
    });
});
