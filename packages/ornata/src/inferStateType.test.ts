// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import inferStateType from './inferStateType.js';

describe('inferStateType', () => {
    it('should infer primitive state types', () => {
        expect(inferStateType('test')).toBe('string');
        expect(inferStateType(123)).toBe('number');
        expect(inferStateType(true)).toBe('boolean');
    });

    it('should infer array, object, and function state types', () => {
        expect(inferStateType([1, 2, 3])).toBe('array');
        expect(inferStateType({ name: 'test' })).toBe('object');
        expect(inferStateType(() => 'test')).toBe('function');
    });

    it('should treat arrays differently from objects', () => {
        expect(inferStateType([])).toBe('array');
    });

    it('should return undefined for unsupported values', () => {
        expect(inferStateType(undefined)).toBeUndefined();
    });
});
