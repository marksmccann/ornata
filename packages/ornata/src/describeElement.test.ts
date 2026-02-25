// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import describeElement from './describeElement.js';

describe('describeElement', () => {
    it('should describe element', () => {
        const element = document.createElement('div');
        const description = describeElement(element);

        expect(description).toStrictEqual('div');
    });

    it('should describe element with id', () => {
        const element = document.createElement('div');
        element.id = 'test';
        const description = describeElement(element);

        expect(description).toStrictEqual('div#test');
    });

    it('should describe element with name', () => {
        const element = document.createElement('div');
        element.setAttribute('name', 'test');
        const description = describeElement(element);

        expect(description).toStrictEqual('div[name="test"]');
    });

    it('should describe element with class', () => {
        const element = document.createElement('div');
        element.classList.add('test');
        const description = describeElement(element);

        expect(description).toStrictEqual('div.test');
    });

    it('should describe element with multiple classes', () => {
        const element = document.createElement('div');
        element.classList.add('test', 'test2', 'test3');
        const description = describeElement(element);

        expect(description).toStrictEqual('div.test.test2.test3');
    });
});
