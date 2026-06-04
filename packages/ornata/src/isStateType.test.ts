// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import isStateType from './isStateType.js';

describe('isStateType', () => {
    it('should match primitive state types', () => {
        expect(isStateType('test', 'string')).toBe(true);
        expect(isStateType(123, 'number')).toBe(true);
        expect(isStateType(true, 'boolean')).toBe(true);
    });

    it('should match array, object, and function state types', () => {
        expect(isStateType([1, 2, 3], 'array')).toBe(true);
        expect(isStateType({ name: 'test' }, 'object')).toBe(true);
        expect(
            isStateType(() => 'test', 'function')
        ).toBe(true);
    });

    it('should not treat arrays as objects', () => {
        expect(isStateType([], 'object')).toBe(false);
    });

    it('should reject values that do not match the expected type', () => {
        expect(isStateType(123, 'string')).toBe(false);
        expect(isStateType('123', 'number')).toBe(false);
        expect(isStateType('true', 'boolean')).toBe(false);
        expect(isStateType({ name: 'test' }, 'array')).toBe(false);
        expect(isStateType(null, 'function')).toBe(false);
    });
});
