// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import renderElement from './renderElement.js';
import type { InternalInstance } from './runtime.js';

describe('renderElement', () => {
    it('should render attributes', () => {
        const element = document.createElement('div');
        const attributes = { 'aria-hidden': true };
        const instance: InternalInstance = {
            root: element,
            state: {},
            elements: {},
            methods: {},
            data: {},
            computed: {},
        };

        renderElement.call(instance, {
            componentName: 'Test',
            element,
            elementName: 'div',
            options: { attributes },
        });

        expect(element.getAttribute('aria-hidden')).toBe('');
    });
});
