import type Ornata from './index';

/**
 * Gets the default state from the state options.
 * @param stateOptions The state options to use to get the default state.
 * @param state The state to get the default state from.
 * @returns The default state.
 */
export default function getDefaultState<T extends Ornata.ComponentState>(
    stateOptions: Ornata.ComponentStateOptions<T>,
    state: Partial<T>
): Partial<T> {
    let defaultState: Partial<T['$state']> = {};

    Object.entries(stateOptions).forEach(([property, option]) => {
        const { defaultValue } = option as Ornata.ComponentStateOption<
            T[keyof T]
        >;

        if (state[property as keyof T] === undefined) {
            defaultState[property as keyof T['$state']] = defaultValue;
        }
    });

    return defaultState;
}
