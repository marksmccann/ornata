import type Ornata from './index';
import reporter from './reporter';

/**
 * Infers the expected type from a state value.
 * @param value The value to infer the expected type from.
 * @returns The expected type from the value.
 */
function inferExpectedType<T extends Ornata.ComponentInternalInstance>(
    value: unknown
): Ornata.ComponentStateOptions<T, keyof T['state']>['type'] {
    if (typeof value === 'string') return String;
    if (typeof value === 'number') return Number;
    if (typeof value === 'boolean') return Boolean;
    if (Array.isArray(value)) return Array;
    if (typeof value === 'object') return Object;
    if (typeof value === 'function') return Function;
    return undefined;
}

/**
 * Parses a value from the dataset of an element.
 * @param componentName The name of the component.
 * @param property The property to parse the value for.
 * @param value The value to parse.
 * @param option The configuration options for the state property.
 * @returns The parsed value.
 */
function parseDatasetValue<T extends Ornata.ComponentInternalInstance>(
    componentName: string,
    property: string,
    value: string,
    option: Ornata.ComponentStateOptions<T, keyof T['state']>
): unknown {
    const { default: defaultValue, type, parse } = option;
    const expectedTypes = [
        type,
        defaultValue !== undefined ? inferExpectedType<T>(defaultValue) : undefined,
    ];

    if (parse) {
        return parse(value);
    }

    const definedTypes = expectedTypes.filter(
        (expectedType): expectedType is NonNullable<typeof expectedType> =>
            expectedType !== undefined
    );

    // Make sure all the expected types are the same
    if (
        definedTypes.length > 1 &&
        new Set(definedTypes).size !== 1
    ) {
        reporter.error('ERR06', {
            componentName,
            property,
        });

        return undefined;
    }

    try {
        const expectedType = definedTypes[0];

        if (expectedType === String) {
            return value;
        }

        if (expectedType === Number) {
            return Number(value);
        }

        if (expectedType === Boolean) {
            return value === 'true' || value === '1';
        }

        if (expectedType === Array || expectedType === Object) {
            return JSON.parse(value);
        }

        if (expectedType === Function) {
            throw new Error('Function values cannot be parsed from HTML.');
        }

        return JSON.parse(value);
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
export default function getStateFromElement<
    T extends Ornata.ComponentInternalInstance,
>(
    stateOptions: Ornata.ComponentOption<T, 'state'>,
    componentName: string,
    element: HTMLElement
): Partial<T['state']> {
    const state = {} as T['state'];

    Object.entries(element.dataset).forEach(([property, value]) => {
        const option = stateOptions[property as keyof T['state']];
        let parsedValue: unknown;

        if (!option) {
            reporter.error('ERR07', {
                componentName,
                property,
            });

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

        state[property as keyof T['state']] =
            parsedValue as T['state'][keyof T['state']];

        delete element.dataset[property];
    });

    return state;
}
