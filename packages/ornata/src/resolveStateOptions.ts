import type Ornata from './index.js';
import getStateFromElement from './getStateFromElement.js';
import getDefaultState from './getDefaultState.js';
import type { StateOptions } from './runtime.js';

/**
 * Resolves the state options for a component.
 * @param componentName The name of the component.
 * @param root The root element of the component.
 * @param initialState The initial state of the component, provided by the user.
 * @param stateOptions The state options of the component.
 * @returns The fully resolved, initial state of the component.
 */
export default function resolveStateOptions(
    componentName: string,
    root: Element,
    initialState: Partial<Ornata.ComponentState>,
    stateOptions: StateOptions
): Ornata.ComponentState {
    let state = {} as Ornata.ComponentState;
    let stateFromHTML: Partial<Ornata.ComponentState> = {};

    if (root instanceof HTMLElement) {
        stateFromHTML = getStateFromElement(stateOptions, componentName, root);
    }

    const resolvedState = {
        ...state,
        ...getDefaultState(stateOptions, state),
        ...stateFromHTML,
        ...initialState,
    };

    return resolvedState as Ornata.ComponentState;
}
