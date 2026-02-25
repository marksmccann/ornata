// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import resolveRootOptions from './resolveRootOptions.js';
import reporter from './reporter.js';

describe('resolveRootOptions', () => {
    it('should resolve root options when matches is provided', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const root = document.createElement('div');
        const rootOptions = { matches: 'div' };

        resolveRootOptions('Test', root, rootOptions);

        expect(consoleError).not.toHaveBeenCalled();
    });

    it('should log error when root element does not match selector', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const root = document.createElement('div');
        const rootOptions = { matches: 'input' };

        resolveRootOptions('Test', root, rootOptions);

        expect(consoleError).toHaveBeenCalledWith(
            reporter.message('ERR05', {
                componentName: 'Test',
                selector: 'input',
            })
        );
    });
});
