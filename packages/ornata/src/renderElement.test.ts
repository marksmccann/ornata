// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import renderElement from './renderElement.js';

describe('renderElement', () => {
    it('should render attributes', () => {
        const element = document.createElement('div');
        const attributes = { 'aria-hidden': true };
        const instance = { state: {}, elements: {}, methods: {}, data: {} };

        renderElement.call(instance, {
            componentName: 'Test',
            element,
            elementName: 'div',
            options: { attributes },
        });

        expect(element.getAttribute('aria-hidden')).toBe('');
    });
});
