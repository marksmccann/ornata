// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import resolveElementsOptions from './resolveElementOptions.js';
import reporter from './reporter.js';

describe('resolveElementsOptions', () => {
    it('should resolve elements options when property is in elements options', () => {
        const elementsOptions = { name: { query: 'div' } };
        const root = document.createElement('div');
        const child = document.createElement('div');

        root.appendChild(child);

        const resolvedElements = resolveElementsOptions(
            'Test',
            root,
            elementsOptions
        );

        expect(resolvedElements).toStrictEqual({ name: child });
    });

    it('should log error when minimum number of elements is not met', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const elementsOptions = { name: { query: 'div', min: 2 } };
        const root = document.createElement('div');
        const child = document.createElement('div');

        root.appendChild(child);

        const resolvedElements = resolveElementsOptions(
            'Test',
            root,
            elementsOptions
        );

        expect(resolvedElements.name).toBeUndefined();
        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR12', {
                componentName: 'Test',
                property: 'name',
                min: 2,
            })
        );
    });

    it('should log error when maximum number of elements is exceeded', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const elementsOptions = { name: { queryAll: 'div', max: 1 } };
        const root = document.createElement('div');
        const child = document.createElement('div');
        const child2 = document.createElement('div');

        root.appendChild(child);
        root.appendChild(child2);

        const resolvedElements = resolveElementsOptions(
            'Test',
            root,
            elementsOptions
        );

        expect(resolvedElements.name).toBeUndefined();
        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR13', {
                componentName: 'Test',
                property: 'name',
                max: 1,
            })
        );
    });

    it('should log error when too many element resolution methods are provided', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const elementsOptions = { name: { query: 'div', queryAll: 'div' } };
        const root = document.createElement('div');
        const child = document.createElement('div');

        root.appendChild(child);

        const resolvedElements = resolveElementsOptions(
            'Test',
            root,
            elementsOptions
        );

        expect(resolvedElements.name).toStrictEqual(
            expect.arrayContaining([child])
        );
        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR14', {
                componentName: 'Test',
                property: 'name',
                provided: 'queryAll, query',
                used: 'queryAll',
            })
        );
    });

    it('should log error when no element resolution method is provided', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const elementsOptions = { name: {} };
        const root = document.createElement('div');
        const child = document.createElement('div');

        root.appendChild(child);

        const resolvedElements = resolveElementsOptions(
            'Test',
            root,
            elementsOptions
        );

        expect(resolvedElements.name).toBeUndefined();
        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR11', {
                componentName: 'Test',
                property: 'name',
            })
        );
    });

    it('should resolve elements options when resolve function is provided', () => {
        const elementsOptions = {
            name: { resolve: () => document.createElement('div') },
        };
        const root = document.createElement('div');
        const child = document.createElement('div');

        root.appendChild(child);

        const resolvedElements = resolveElementsOptions(
            'Test',
            root,
            elementsOptions
        );

        expect(resolvedElements.name).toStrictEqual(child);
    });

    it('should resolve elements options when query selector is provided', () => {
        const elementsOptions = { name: { query: 'div' } };
        const root = document.createElement('div');
        const child = document.createElement('div');

        root.appendChild(child);

        const resolvedElements = resolveElementsOptions(
            'Test',
            root,
            elementsOptions
        );

        expect(resolvedElements.name).toStrictEqual(child);
    });

    it('should resolve elements options when query all selector is provided', () => {
        const elementsOptions = { name: { queryAll: 'div' } };
        const root = document.createElement('div');
        const child = document.createElement('div');
        const child2 = document.createElement('div');

        root.appendChild(child);
        root.appendChild(child2);

        const resolvedElements = resolveElementsOptions(
            'Test',
            root,
            elementsOptions
        );

        expect(resolvedElements.name).toStrictEqual([child, child2]);
    });

    it('should resolve elements options when create element is provided', () => {
        const elementsOptions = { name: { create: 'div' } } as const;
        const root = document.createElement('div');
        const child = document.createElement('div');

        root.appendChild(child);

        const resolvedElements = resolveElementsOptions(
            'Test',
            root,
            elementsOptions
        );

        expect(resolvedElements.name).toStrictEqual(child);
    });
});
