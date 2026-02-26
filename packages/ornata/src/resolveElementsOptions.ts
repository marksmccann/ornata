import type Ornata from './index.js';
import reporter from './reporter.js';

/**
 * Validates that the minimum number of elements is met.
 * @param componentName The name of the component.
 * @param property The property name.
 * @param elements The list of elements.
 * @param min The minimum number of elements.
 * @returns True if the minimum number of elements is met, false otherwise.
 * @private
 */
function validateMinElements(
    componentName: string,
    property: string,
    elements: Array<Element | null>,
    min?: number
): boolean {
    let valid = true;

    if (typeof min === 'number' && elements.length < min) {
        valid = false;
    }

    if (!valid) {
        reporter.error('ERR12', {
            componentName,
            property,
            min,
        });
    }

    return valid;
}

/**
 * Validates that the maximum number of elements is met.
 * @param componentName The name of the component.
 * @param property The property name.
 * @param elements The list of elements.
 * @param max The maximum number of elements.
 * @returns True if the maximum number of elements is met, false otherwise.
 * @private
 */
function validateMaxElements(
    componentName: string,
    property: string,
    elements: Array<Element | null>,
    max?: number
): boolean {
    let valid = true;

    if (typeof max === 'number' && elements.length > max) {
        valid = false;
    }

    if (!valid) {
        reporter.error('ERR13', {
            componentName,
            property,
            max,
        });
    }

    return valid;
}

export default function resolveElementsOptions<
    T extends Ornata.ComponentInternalInstance,
>(
    componentName: string,
    root: T['$root'],
    elementsOptions: Ornata.ComponentOption<T, 'elements'>
): T['$elements'] {
    const elements = {} as T['$elements'];

    Object.entries(elementsOptions).forEach(([property, option]) => {
        const { queryAll, query, create, resolve, min, max } =
            option as Ornata.ComponentElementOptions<T, keyof T['$elements']>;
        const provided = [
            queryAll ? 'queryAll' : null,
            query ? 'query' : null,
            create ? 'create' : null,
            resolve ? 'resolve' : null,
        ].filter(Boolean);
        console.log(provided);
        let resolved: Ornata.ComponentElement | undefined = undefined;
        let minValid = false;
        let maxValid = false;
        let used: string;

        if (resolve) {
            resolved = resolve(root);
            used = 'resolve';
        } else if (queryAll) {
            resolved = Array.from(root.querySelectorAll(queryAll));
            used = 'queryAll';
        } else if (query) {
            resolved = root.querySelector(query);
            used = 'query';
        } else if (create) {
            resolved = document.createElement(create);
            used = 'create';
        } else {
            reporter.error('ERR11', {
                componentName,
                property,
            });

            return;
        }

        if (provided.length > 1) {
            reporter.error('ERR14', {
                componentName,
                property,
                provided: provided.join(', '),
                used,
            });
        }

        if (Array.isArray(resolved)) {
            minValid = validateMinElements(
                componentName,
                property,
                resolved,
                min
            );
            maxValid = validateMaxElements(
                componentName,
                property,
                resolved,
                max
            );
        } else if (typeof resolved !== 'undefined') {
            minValid = validateMinElements(
                componentName,
                property,
                [resolved].filter(Boolean),
                min
            );
            maxValid = validateMaxElements(
                componentName,
                property,
                [resolved].filter(Boolean),
                max
            );
        }

        if (minValid && maxValid) {
            elements[property as keyof T['$elements']] =
                resolved as T['$elements'][keyof T['$elements']];
        }
    });

    return elements;
}
