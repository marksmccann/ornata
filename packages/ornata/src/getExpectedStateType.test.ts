// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import getExpectedStateType from './getExpectedStateType.js';

describe('getExpectedStateType', () => {
    it('should resolve the expected type from the type option', () => {
        expect(getExpectedStateType({ type: String })).toStrictEqual({
            expectedType: 'string',
            inferredTypes: [{ source: 'type', type: 'string' }],
            conflictDetails: undefined,
        });
    });

    it('should resolve the expected type from the default option', () => {
        expect(getExpectedStateType({ default: 0 })).toStrictEqual({
            expectedType: 'number',
            inferredTypes: [{ source: 'default', type: 'number' }],
            conflictDetails: undefined,
        });
    });

    it('should resolve the expected type from the parsed value', () => {
        expect(getExpectedStateType({}, true)).toStrictEqual({
            expectedType: 'boolean',
            inferredTypes: [{ source: 'parsed', type: 'boolean' }],
            conflictDetails: undefined,
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
            inferredTypes: [
                { source: 'type', type: 'array' },
                { source: 'default', type: 'array' },
            ],
            conflictDetails: undefined,
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
            inferredTypes: [
                { source: 'type', type: 'object' },
                { source: 'default', type: 'object' },
                { source: 'parsed', type: 'object' },
            ],
            conflictDetails: undefined,
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
            inferredTypes: [
                { source: 'type', type: 'number' },
                { source: 'default', type: 'string' },
            ],
            conflictDetails: {
                sources: '"type", "default"',
                types: '"type" => "number", "default" => "string"',
            },
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
            inferredTypes: [
                { source: 'default', type: 'boolean' },
                { source: 'parsed', type: 'string' },
            ],
            conflictDetails: {
                sources: '"default", "parsed"',
                types: '"default" => "boolean", "parsed" => "string"',
            },
        });
    });

    it('should return no expected type when no type information is available', () => {
        expect(getExpectedStateType({})).toStrictEqual({
            expectedType: undefined,
            inferredTypes: [],
            conflictDetails: undefined,
        });
    });
});
