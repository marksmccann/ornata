// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import resolveStateOptions from './resolveStateOptions.js';

describe('resolveStateOptions', () => {
    it('should resolve state options when property is in state options', () => {
        const state = { name: 'test' };
        const stateOptions = { name: { default: 'test' } };
        const root = document.createElement('div');
        const resolvedState = resolveStateOptions(
            'Test',
            root,
            state,
            stateOptions
        );

        expect(resolvedState).toStrictEqual({ name: 'test' });
    });

    it('should ignore dataset properties that are not in state options', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const stateOptions = {};
        const root = document.createElement('div');
        root.dataset.name = 'test';

        const resolvedState = resolveStateOptions('Test', root, {}, stateOptions);

        expect(resolvedState).toStrictEqual({});
        expect(consoleError).not.toHaveBeenCalled();
        expect(root.dataset.name).toBe('test');

        consoleError.mockRestore();
    });
});
