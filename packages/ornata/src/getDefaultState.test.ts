// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import getDefaultState from './getDefaultState.js';

describe('getDefaultState', () => {
    it('should default state when value is undefined', () => {
        const state = { name: undefined };
        const stateOptions = { name: { defaultValue: 'test' } };
        const defaultState = getDefaultState(stateOptions, state);

        expect(defaultState).toStrictEqual({ name: 'test' });
    });

    it('should not default state when value is defined', () => {
        const state = { name: 'test' };
        const stateOptions = { name: { defaultValue: 'test' } };
        const defaultState = getDefaultState(stateOptions, state);

        expect(defaultState).toStrictEqual({});
    });
});
