import reporter from './reporter';
import type { StateOptions } from './runtime.js';

/**
 * Validates the state property by checking if it has a state option and if the type is valid.
 * @param componentName The name of the component.
 * @param state The state to validate.
 * @param stateOptions The state options to use to validate the state.
 * @private
 */
export default function validateState(
    componentName: string,
    property: string,
    value: unknown,
    stateOptions: StateOptions
): void {
    const option = stateOptions[property];

    if (!option) {
        reporter.error('ERR07', {
            componentName,
            property: property as string,
        });

        return;
    }

    const { type } = option;
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
        const reportedValue =
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
                ? value
                : String(value);

        reporter.error('ERR09', {
            componentName,
            value: reportedValue,
            property: property as string,
            type: expectedType,
        });
    }
}
