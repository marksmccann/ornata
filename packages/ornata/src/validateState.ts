import type Ornata from './index';
import reporter from './reporter';

/**
 * Validates the state property by checking if it has a state option and if the type is valid.
 * @param componentName The name of the component.
 * @param state The state to validate.
 * @param stateOptions The state options to use to validate the state.
 * @private
 */
export default function validateState<
    T extends Ornata.ComponentInternalInstance,
>(
    componentName: string,
    state: T['$state'],
    stateOptions: Ornata.ComponentOption<T, 'state'>
): void {
    Object.keys(state).forEach((property) => {
        if (stateOptions[property]) return;

        reporter.error('ERR07', {
            componentName,
            property,
        });
    });

    Object.entries(stateOptions).forEach(([property, option]) => {
        const { type } = option as Ornata.ComponentStateOptions<
            T,
            keyof T['$state']
        >;
        const value = state[property as keyof T['$state']];
        let invalid = false;
        let expectedType;

        if (type === String && typeof value !== 'string') {
            expectedType = 'string';
            invalid = true;
        } else if (type === Number && typeof value !== 'number') {
            expectedType = 'number';
            invalid = true;
        } else if (type === Boolean && typeof value !== 'boolean') {
            expectedType = 'boolean';
            invalid = true;
        } else if (type === Array && !Array.isArray(value)) {
            expectedType = 'array';
            invalid = true;
        } else if (type === Object && typeof value !== 'object') {
            expectedType = 'object';
            invalid = true;
        } else if (type === Function && typeof value !== 'function') {
            expectedType = 'function';
            invalid = true;
        }

        if (invalid) {
            reporter.error('ERR09', {
                componentName,
                value,
                property,
                type: expectedType,
            });
        }
    });
}
