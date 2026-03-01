// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import renderClasses from './renderClasses.js';
import reporter from './reporter.js';

describe('renderClasses', () => {
    it('should render boolean:true classes', () => {
        const element = document.createElement('div');
        const classes = { class: true };

        renderClasses(classes, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(element.classList.contains('class')).toBe(true);
    });

    it('should render boolean:false classes', () => {
        const element = document.createElement('div');
        const classes = { class: false };

        renderClasses(classes, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(element.classList.contains('class')).toBe(false);
    });

    it('should error when class is not a boolean', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const element = document.createElement('div');
        const classes = { class: 'test' };

        // @ts-expect-error - Test invalid type
        renderClasses(classes, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR19', {
                componentName: 'Test',
                element: 'div',
                property: 'class',
                type: 'string',
                supportedTypes: 'boolean',
            })
        );
    });
});
