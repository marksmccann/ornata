import reporter from './reporter';
import isStateType from './isStateType.js';
import inferStateType from './inferStateType.js';
import getExpectedStateType from './getExpectedStateType.js';
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

    let reportedValue: string | number | boolean = 'unknown';
    const { expectedType, hasConflict } = getExpectedStateType(option);

    if (hasConflict) {
        reporter.error('ERR06', {
            componentName,
            property: property as string,
        });

        return;
    }

    if (!expectedType) {
        return;
    }

    if (!isStateType(value, expectedType)) {
        const actualType = inferStateType(value);

        reportedValue =
            actualType === 'string' ||
            actualType === 'number' ||
            actualType === 'boolean'
                ? (value as string | number | boolean)
                : String(value);

        reporter.error('ERR09', {
            componentName,
            value: reportedValue,
            property: property as string,
            type: expectedType,
        });
    }
}
