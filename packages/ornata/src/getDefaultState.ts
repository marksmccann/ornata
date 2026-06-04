import type Ornata from './index';
import type { StateOptions } from './runtime.js';

/**
 * Gets the default state from the state options.
 * @param stateOptions The state options to use to get the default state.
 * @param state The state to get the default state from.
 * @returns The default state.
 */
export default function getDefaultState(
    stateOptions: StateOptions,
    state: Partial<Ornata.ComponentState>
): Partial<Ornata.ComponentState> {
    let defaultState: Partial<Ornata.ComponentState> = {};

    Object.entries(stateOptions).forEach(([property, option]) => {
        const { default: defaultValue } = option;

        if (state[property] === undefined) {
            defaultState[property] = defaultValue;
        }
    });

    return defaultState;
}
