import type Ornata from './index';
import reporter from './reporter';
import getExpectedStateType from './getExpectedStateType.js';
import isStateType from './isStateType.js';
import type { StateOptions, StatePropertyOptions } from './runtime.js';

/**
 * Parses a value from the dataset of an element.
 * @param componentName The name of the component.
 * @param property The property to parse the value for.
 * @param value The value to parse.
 * @param option The configuration options for the state property.
 * @returns The parsed value.
 * @private
 */
function parseDatasetValue(
    componentName: string,
    property: string,
    value: string,
    option: StatePropertyOptions
): unknown {
    const { parse } = option;

    if (parse) {
        const parsedValue = parse(value);
        const resolution = getExpectedStateType(option, parsedValue);

        if (resolution.hasConflict) {
            reporter.error('ERR06', {
                componentName,
                property,
            });

            return undefined;
        }

        return parsedValue;
    }

    const resolution = getExpectedStateType(option);

    if (resolution.hasConflict) {
        reporter.error('ERR06', {
            componentName,
            property,
        });

        return undefined;
    }

    try {
        let parsedValue: unknown;
        const { expectedType } = resolution;

        if (expectedType === 'string') {
            parsedValue = value;
        } else if (expectedType === 'number') {
            parsedValue = Number(value);
        } else if (expectedType === 'boolean') {
            parsedValue = value === 'true' || value === '1';
        } else if (expectedType === 'array' || expectedType === 'object') {
            parsedValue = JSON.parse(value);
        } else if (expectedType === 'function') {
            reporter.error('ERR08', {
                componentName,
                value,
                property,
            });

            return undefined;
        } else {
            parsedValue = JSON.parse(value);
        }

        if (!expectedType) {
            reporter.warn('WRN02', {
                componentName,
                property,
            });
        } else if (!isStateType(parsedValue, expectedType)) {
            reporter.error('ERR08', {
                componentName,
                value,
                property,
            });

            return undefined;
        }

        return parsedValue;
    } catch {
        reporter.error('ERR08', {
            componentName,
            value,
            property,
        });

        return undefined;
    }
}

/**
 * Gets the state from an element via its dataset.
 * @param stateOptions The state options to use to get the state.
 * @param componentName The name of the component.
 * @param element The element to get the state from.
 * @returns The state object.
 * @private
 */
export default function getStateFromElement(
    stateOptions: StateOptions,
    componentName: string,
    element: HTMLElement
): Partial<Ornata.ComponentState> {
    const state = {} as Partial<Ornata.ComponentState>;

    Object.entries(element.dataset).forEach(([property, value]) => {
        const option = stateOptions[property];
        let parsedValue: unknown;

        if (!option) {
            return;
        }

        // Make sure the property has a value
        if (!value) {
            reporter.error('ERR08', {
                componentName,
                value,
                property,
            });

            return;
        }

        parsedValue = parseDatasetValue(componentName, property, value, option);

        state[property] = parsedValue;

        delete element.dataset[property];
    });

    return state;
}
