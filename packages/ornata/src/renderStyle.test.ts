// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import renderStyle from './renderStyle.js';

describe('renderStyle', () => {
    it('should render style properties', () => {
        const element = document.createElement('div');
        const style = { color: 'red' };
        const instance = { state: {}, elements: {}, methods: {}, data: {} };

        renderStyle.call(instance, style, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(element.style.color).toBe('red');
    });
});
