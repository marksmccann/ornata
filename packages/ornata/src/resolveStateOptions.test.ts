// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import resolveStateOptions from './resolveStateOptions.js';
import reporter from './reporter.js';

describe('resolveStateOptions', () => {
    it('should resolve state options when property is in state options', () => {
        const state = { name: 'test' };
        const stateOptions = { name: { defaultValue: 'test' } };
        const root = document.createElement('div');
        const resolvedState = resolveStateOptions(
            'Test',
            root,
            state,
            stateOptions
        );

        expect(resolvedState).toStrictEqual({ name: 'test' });
    });

    it('should log error when property is not in state options', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const state = { name: 'test' };
        const stateOptions = {};
        const root = document.createElement('div');

        resolveStateOptions('Test', root, state, stateOptions);

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR07', {
                componentName: 'Test',
                property: 'name',
            })
        );
    });
});
