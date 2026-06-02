import type Ornata from './index.js';
import getStateFromElement from './getStateFromElement.js';
import getDefaultState from './getDefaultState.js';

/**
 * Resolves the state options for a component.
 * @param componentName The name of the component.
 * @param root The root element of the component.
 * @param initialState The initial state of the component, provided by the user.
 * @param stateOptions The state options of the component.
 * @returns The fully resolved, initial state of the component.
 */
export default function resolveStateOptions<
    T extends Ornata.ComponentInternalInstance,
>(
    componentName: string,
    root: Element,
    initialState: Partial<T['state']>,
    stateOptions: Ornata.ComponentOption<T, 'state'>
): T['state'] {
    let state = {} as T['state'];
    let stateFromHTML: Partial<T['state']> = {};

    if (root instanceof HTMLElement) {
        stateFromHTML = getStateFromElement<T>(
            stateOptions,
            componentName,
            root
        );
    }

    const resolvedState = {
        ...state,
        ...getDefaultState(stateOptions, state),
        ...stateFromHTML,
        ...initialState,
    };

    return resolvedState;
}
