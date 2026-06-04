// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import attachEvents from './attachEvents.js';
import type Ornata from './index.js';

describe('attachEvents', () => {
    it('should attach events to the element', () => {
        const element = document.createElement('div');
        const events = { click: vi.fn() };
        const instance: Ornata.InternalInstance = {
            root: element,
            state: {},
            elements: {},
            methods: {},
            data: {},
            computed: {},
        };

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
