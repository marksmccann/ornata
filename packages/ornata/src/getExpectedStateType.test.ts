// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import getExpectedStateType from './getExpectedStateType.js';

describe('getExpectedStateType', () => {
    it('should resolve the expected type from the type option', () => {
        expect(getExpectedStateType({ type: String })).toStrictEqual({
            expectedType: 'string',
            hasConflict: false,
            sources: ['type'],
        });
    });

    it('should resolve the expected type from the default option', () => {
        expect(getExpectedStateType({ default: 0 })).toStrictEqual({
            expectedType: 'number',
            hasConflict: false,
            sources: ['default'],
        });
    });

    it('should resolve the expected type from the parsed value', () => {
        expect(getExpectedStateType({}, true)).toStrictEqual({
            expectedType: 'boolean',
            hasConflict: false,
            sources: ['parsed'],
        });
    });

    it('should resolve the expected type when type and default agree', () => {
        expect(
            getExpectedStateType({
                type: Array,
                default: [],
            })
        ).toStrictEqual({
            expectedType: 'array',
            hasConflict: false,
            sources: ['type', 'default'],
        });
    });

    it('should resolve the expected type when type, default, and parsed value agree', () => {
        expect(
            getExpectedStateType(
                {
                    type: Object,
                    default: {},
                },
                { name: 'test' }
            )
        ).toStrictEqual({
            expectedType: 'object',
            hasConflict: false,
            sources: ['type', 'default', 'parsed'],
        });
    });

    it('should report a conflict when type and default disagree', () => {
        expect(
            getExpectedStateType({
                type: Number,
                default: '0',
            })
        ).toStrictEqual({
            expectedType: undefined,
            hasConflict: true,
            sources: ['type', 'default'],
        });
    });

    it('should report a conflict when default and parsed value disagree', () => {
        expect(
            getExpectedStateType(
                {
                    default: false,
                },
                'true'
            )
        ).toStrictEqual({
            expectedType: undefined,
            hasConflict: true,
            sources: ['default', 'parsed'],
        });
    });

    it('should return no expected type when no type information is available', () => {
        expect(getExpectedStateType({})).toStrictEqual({
            expectedType: undefined,
            hasConflict: false,
            sources: [],
        });
    });
});
