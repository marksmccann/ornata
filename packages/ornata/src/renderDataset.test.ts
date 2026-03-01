// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import renderDataset from './renderDataset.js';
import reporter from './reporter.js';

describe('renderDataset', () => {
    it('should render string dataset properties', () => {
        const element = document.createElement('div');
        const dataset = { test: 'test' };

        renderDataset(dataset, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(element.dataset.test).toBe('test');
    });

    it('should remove null dataset properties', () => {
        const element = document.createElement('div');
        const dataset = { test: null };

        renderDataset(dataset, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(element.dataset.test).toBeUndefined();
        expect(element.getAttribute('data-test')).toBe(null);
    });

    it('should ignore undefined dataset properties', () => {
        const element = document.createElement('div');
        const dataset = { test: undefined };

        renderDataset(dataset, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(element.dataset.test).toBe(undefined);
        expect(element.getAttribute('data-test')).toBe(null);
    });

    it('should log error when dataset property is not a string', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const element = document.createElement('div');
        const dataset = { test: [] };

        // @ts-expect-error - Test invalid type
        renderDataset(dataset, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR19', {
                componentName: 'Test',
                element: 'div',
                property: 'test',
                type: 'object',
                supportedTypes: 'string, null, undefined',
            })
        );
    });
});
