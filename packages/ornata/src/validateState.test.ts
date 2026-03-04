// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import validateState from './validateState.js';
import reporter from './reporter.js';

describe('validateState', () => {
    it('should validate state when property is in state options', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const stateOptions = { name: { type: String } };

        validateState('Test', 'name', 'test', stateOptions);

        expect(consoleError).not.toHaveBeenCalled();
    });

    it('should validate state when property is not in state options', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const stateOptions = {};

        validateState('Test', 'name', 'test', stateOptions);

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR07', {
                componentName: 'Test',
                property: 'name',
            })
        );
    });

    it('should validate state if the value does not match the expected type: string', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const stateOptions = { name: { type: String } };

        validateState('Test', 'name', 123, stateOptions);

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 123,
                property: 'name',
                type: 'string',
            })
        );
    });

    it('should validate state if the value does not match the expected type: number', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const stateOptions = { name: { type: Number } };

        validateState('Test', 'name', 'test', stateOptions);

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 'test',
                property: 'name',
                type: 'number',
            })
        );
    });

    it('should validate state if the value does not match the expected type: boolean', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const stateOptions = { name: { type: Boolean } };

        validateState('Test', 'name', 123, stateOptions);

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 123,
                property: 'name',
                type: 'boolean',
            })
        );
    });

    it('should validate state if the value does not match the expected type: array', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const stateOptions = { name: { type: Array } };

        validateState('Test', 'name', 'test', stateOptions);

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 'test',
                property: 'name',
                type: 'array',
            })
        );
    });

    it('should validate state if the value does not match the expected type: object', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const state = { name: 'test' };
        const stateOptions = { name: { type: Object } };

        validateState('Test', 'name', 'test', stateOptions);

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 'test',
                property: 'name',
                type: 'object',
            })
        );
    });

    it('should validate state if the value does not match the expected type: function', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const stateOptions = { name: { type: Function } };

        validateState('Test', 'name', 'test', stateOptions);

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR09', {
                componentName: 'Test',
                value: 'test',
                property: 'name',
                type: 'function',
            })
        );
    });
});
