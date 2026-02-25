import type Ornata from './index.js';
import getStateFromElement from './getStateFromElement.js';
import getDefaultState from './getDefaultState.js';
import reporter from './reporter.js';

export default function resolveStateOptions<T extends Ornata.ComponentState>(
    componentName: string,
    root: Element,
    initialState: Partial<T>,
    stateOptions: Ornata.ComponentStateOptions<T>
): T {
    let state = {} as T;
    let stateFromHTML: Partial<T> = {};

    if (root instanceof HTMLElement) {
        stateFromHTML = getStateFromElement(stateOptions, componentName, root);
    }

    Object.values(stateOptions).forEach((option) => {
        const { defaultValue, type, parse } = option;

        if (!defaultValue && !type && !parse) {
            reporter.error('ERR06', {
                componentName,
                property: 'state',
            });
        }
    });

    return {
        ...state,
        ...getDefaultState(stateOptions, state),
        ...stateFromHTML,
        ...initialState,
    };
}
