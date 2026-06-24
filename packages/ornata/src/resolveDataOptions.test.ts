// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import resolveDataOptions from './resolveDataOptions.js';

describe('resolveDataOptions', () => {
    it('should clone nested plain objects and arrays', () => {
        const dataOptions = {
            counter: 1,
            cache: {
                items: ['alpha', 'beta'],
                metadata: {
                    active: true,
                },
            },
        };

        const resolvedData = resolveDataOptions(
            dataOptions
        ) as typeof dataOptions;

        expect(resolvedData).toStrictEqual(dataOptions);
        expect(resolvedData).not.toBe(dataOptions);
        expect(resolvedData.cache).not.toBe(dataOptions.cache);
        expect(resolvedData.cache.items).not.toBe(dataOptions.cache.items);
        expect(resolvedData.cache.metadata).not.toBe(
            dataOptions.cache.metadata
        );
    });

    it('should preserve non-plain object references', () => {
        const timestamp = new Date('2026-06-22T00:00:00.000Z');
        const dataOptions = {
            timestamp,
        };

        const resolvedData = resolveDataOptions(
            dataOptions
        ) as typeof dataOptions;

        expect(resolvedData.timestamp).toBe(timestamp);
    });
});
