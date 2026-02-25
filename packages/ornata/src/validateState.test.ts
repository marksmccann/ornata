// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import validateState from './validateState.js';
import reporter from './reporter.js';

describe('validateState', () => {
    it('should validate state when property is in state options', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const state = { name: 'test' };
        const stateOptions = { name: { type: String } };

        validateState('Test', state, stateOptions);

        expect(consoleError).not.toHaveBeenCalled();
    });

    it('should validate state when property is not in state options', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const state = { name: 'test' };
        const stateOptions = {};

        // @ts-expect-error - purposely invalid state options
        validateState('Test', state, stateOptions);

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR07', {
                componentName: 'Test',
                property: 'name',
            })
        );
    });

    it('should validate state if the value does not match the expected type: string', () => {
        const consoleWarn = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const state = { name: 123 };
        const stateOptions = { name: { type: String } };

        validateState('Test', state, stateOptions);

        expect(consoleWarn).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 123,
                property: 'name',
                type: 'string',
            })
        );
    });

    it('should validate state if the value does not match the expected type: number', () => {
        const consoleWarn = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const state = { name: 'test' };
        const stateOptions = { name: { type: Number } };

        validateState('Test', state, stateOptions);

        expect(consoleWarn).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 'test',
                property: 'name',
                type: 'number',
            })
        );
    });

    it('should validate state if the value does not match the expected type: boolean', () => {
        const consoleWarn = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const state = { name: 123 };
        const stateOptions = { name: { type: Boolean } };

        validateState('Test', state, stateOptions);

        expect(consoleWarn).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 123,
                property: 'name',
                type: 'boolean',
            })
        );
    });

    it('should validate state if the value does not match the expected type: array', () => {
        const consoleWarn = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const state = { name: 'test' };
        const stateOptions = { name: { type: Array } };

        validateState('Test', state, stateOptions);

        expect(consoleWarn).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 'test',
                property: 'name',
                type: 'array',
            })
        );
    });

    it('should validate state if the value does not match the expected type: object', () => {
        const consoleWarn = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const state = { name: 'test' };
        const stateOptions = { name: { type: Object } };

        validateState('Test', state, stateOptions);

        expect(consoleWarn).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 'test',
                property: 'name',
                type: 'object',
            })
        );
    });

    it('should validate state if the value does not match the expected type: function', () => {
        const consoleWarn = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const state = { name: 'test' };
        const stateOptions = { name: { type: Function } };

        validateState('Test', state, stateOptions);

        expect(consoleWarn).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 'test',
                property: 'name',
                type: 'function',
            })
        );
    });
});
