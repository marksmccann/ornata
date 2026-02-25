// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import getRootElement from './getRootElement.js';
import reporter from './reporter.js';

describe('getRootElement', () => {
    it('should get root element by element', () => {
        const element = document.createElement('div');
        const root = getRootElement('Test', element, 'create');

        expect(root).toStrictEqual(element);
    });

    it('should get root element by selector', () => {
        const element = document.createElement('div');
        const root = getRootElement('Test', 'div', 'create');

        expect(root).toStrictEqual(element);
    });

    it('should fail to get root element if element is not found', () => {
        expect(() => getRootElement('Test', 'div', 'create')).toThrow(
            reporter.message('ERR01', {
                componentName: 'Test',
                action: 'create',
                selector: 'div',
            })
        );
    });

    it('should fail to get root element if element is not valid', () => {
        expect(() => getRootElement('Test', null, 'create')).toThrow(
            reporter.message('ERR02', {
                componentName: 'Test',
                action: 'create',
                element: null,
            })
        );
    });
});
