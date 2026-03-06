import type Ornata from './index';
import reporter from './reporter';

/**
 * Parses a value from the dataset of an element.
 * @param componentName The name of the component.
 * @param property The property to parse the value for.
 * @param value The value to parse.
 * @param expectedType The expected type of the value.
 * @returns The parsed value.
 */
function parseDatasetValue(
    componentName: string,
    property: string,
    value: string,
    expectedType: unknown
): unknown {
    if (expectedType === String) return value;

    if (expectedType === Number) return Number(value);

    if (expectedType === Boolean) {
        return value === 'true' || value === '1';
    }

    try {
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
        let expectedType: unknown;
        let parsedValue: unknown;

        if (!option) {
            reporter.error('ERR07', {
                componentName,
                property,
            });

            return;
        }

        if (!value) {
            reporter.error('ERR08', {
                componentName,
                value,
                property,
            });

            return;
        }

        if (option.parse) {
            parsedValue = option.parse(value);
        } else if (option.default !== undefined) {
            expectedType = (option.default as object).constructor;
        } else if (option.type) {
            expectedType = option.type;
        }

        if (expectedType) {
            parsedValue = parseDatasetValue(
                componentName,
                property,
                value,
                expectedType
            );
        }

        state[property as keyof T['state']] =
            parsedValue as T['state'][keyof T['state']];

        delete element.dataset[property];
    });

    return state;
}
