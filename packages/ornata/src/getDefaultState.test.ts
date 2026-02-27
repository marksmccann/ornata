// @vitest-environment jsdom

import type Ornata from './index.js';
import { describe, it, expect } from 'vitest';
import getDefaultState from './getDefaultState.js';

describe('getDefaultState', () => {
    it('should default state when value is undefined', () => {
        const state = {
            name: undefined,
        } as Partial<Ornata.ComponentInternalInstance>;
        const stateOptions = { name: { default: 'test' } };
        const defaultState = getDefaultState(stateOptions, state);

        expect(defaultState).toStrictEqual({ name: 'test' });
    });

    it('should not default state when value is defined', () => {
        const state = {
            name: 'test',
        } as Partial<Ornata.ComponentInternalInstance>;
        const stateOptions = { name: { default: 'test' } };
        const defaultState = getDefaultState(stateOptions, state);

        expect(defaultState).toStrictEqual({});
    });
});
