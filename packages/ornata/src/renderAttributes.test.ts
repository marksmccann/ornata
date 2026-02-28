// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import renderAttributes from './renderAttributes.js';
import reporter from './reporter.js';

describe('renderAttributes', () => {
    it('should render string attributes', () => {
        const element = document.createElement('div');
        const attributes = { id: 'test' };

        renderAttributes(attributes, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(element.getAttribute('id')).toBe('test');
    });

    it('should render boolean:true attributes', () => {
        const element = document.createElement('div');
        const attributes = { 'aria-hidden': true };

        renderAttributes(attributes, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(element.getAttribute('aria-hidden')).toBe('');
    });

    it('should render boolean:false attributes', () => {
        const element = document.createElement('div');
        const attributes = { 'aria-hidden': false };

        element.setAttribute('aria-hidden', '');

        renderAttributes(attributes, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(element.getAttribute('aria-hidden')).toBe(null);
    });

    it('should render remove null attributes', () => {
        const element = document.createElement('div');
        const attributes = { 'aria-hidden': null };

        element.setAttribute('aria-hidden', '');

        renderAttributes(attributes, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(element.getAttribute('aria-hidden')).toBe(null);
    });

    it('should render ignore undefined attributes', () => {
        const element = document.createElement('div');
        const attributes = { 'aria-hidden': undefined };

        element.setAttribute('aria-hidden', '');

        renderAttributes(attributes, {
            element,
            elementName: 'div',
            componentName: 'Test',
            options: {},
        });

        expect(element.getAttribute('aria-hidden')).toBe('');
    });

    it('should log error when attribute is not a valid type', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const element = document.createElement('div');
        const attributes = { id: [] };

        // @ts-expect-error - Test invalid type
        renderAttributes(attributes, {
            element,
            elementName: '"div"',
            componentName: 'Test',
            options: {},
        });

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR19', {
                componentName: 'Test',
                element: '"div"',
                property: 'id',
                type: 'object',
                supportedTypes: 'string, boolean, null, undefined',
            })
        );
    });
});
