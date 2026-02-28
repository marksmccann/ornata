import type Ornata from './index.js';
import reporter from './reporter.js';
import describeElement from './describeElement.js';

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

/**
 * Validates that the elements are not referenced more than once in `elements`
 * @param componentName The name of the component.
 * @param elements The resolved elements.
 * @private
 */
function validateDuplicateElements<T extends Ornata.ComponentInternalInstance>(
    componentName: string,
    elements: T['elements']
): void {
    const references = new WeakMap<Element, string>();

    Object.entries(elements).forEach(([property, value]) => {
        if (Array.isArray(value)) {
            value.forEach((element, index) => {
                const reference = references.get(element);
                const text = `"${property}" at index ${index}`;

                if (references.has(element)) {
                    reporter.error('ERR17', {
                        componentName,
                        element: describeElement(element),
                        property: text,
                        reference,
                    });
                }

                references.set(element, text);
            });
        } else if (value instanceof Element) {
            const reference = references.get(value);
            const text = `"${property}"`;

            if (references.has(value)) {
                reporter.error('ERR17', {
                    componentName,
                    element: describeElement(value),
                    property: text,
                    reference,
                });
            }

            references.set(value, text);
        }
    });
}

export default function resolveElementsOptions<
    T extends Ornata.ComponentInternalInstance,
>(
    componentName: string,
    root: T['root'],
    elementsOptions: Ornata.ComponentOption<T, 'elements'>
): T['elements'] {
    const elements = {} as T['elements'];

    Object.entries(elementsOptions).forEach(([property, option]) => {
        const { queryAll, query, create, resolve, min, max } =
            option as Ornata.ComponentElementOptions<T, keyof T['elements']>;
        const provided = [
            queryAll ? 'queryAll' : null,
            query ? 'query' : null,
            create ? 'create' : null,
            resolve ? 'resolve' : null,
        ].filter(Boolean);
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
            elements[property as keyof T['elements']] =
                resolved as T['elements'][keyof T['elements']];
        }
    });

    validateDuplicateElements(componentName, elements);

    return elements;
}
