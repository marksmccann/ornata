// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import defineComponent from './defineComponent.js';
import isComponent from './isComponent.js';

describe('isComponent', () => {
    it('should return true if the value is a component constructor', () => {
        const Test = defineComponent({ name: 'Test' });

        expect(isComponent(Test)).toBe(true);
    });

    it('should return false if the value is not a component constructor', () => {
        const Test = defineComponent({ name: 'Test' });
        const instance = Test.createInstance(document.createElement('div'));

        expect(isComponent(instance)).toBe(false);

        instance.dispose();
    });
});
