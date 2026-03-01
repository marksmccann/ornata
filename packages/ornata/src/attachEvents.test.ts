// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import attachEvents from './attachEvents.js';

describe('attachEvents', () => {
    it('should attach events to the element', () => {
        const element = document.createElement('div');
        const events = { click: vi.fn() };
        const instance = { state: {}, elements: {}, methods: {}, data: {} };

        const cleanup = attachEvents.call(instance, events, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        element.click();

        expect(events.click).toHaveBeenCalledTimes(1);

        cleanup();
    });
});
