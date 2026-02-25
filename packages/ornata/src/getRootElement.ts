import reporter from './reporter';

/**
 * Gets the root element for a component.
 * @param componentName The name of the component.
 * @param elementOrQuery The element or query to get the root element from.
 * @param actionLabel The label of the action to get the root element for.
 * @returns The root element.
 * @private
 */
export default function getRootElement<T extends Element>(
    componentName: string,
    elementOrQuery: string | Element | null | undefined,
    actionLabel: 'create' | 'get' | 'query' | 'delete'
): T {
    let root: Element;

    if (elementOrQuery instanceof Element) {
        root = elementOrQuery;
    } else if (typeof elementOrQuery === 'string') {
        const element = document.querySelector(elementOrQuery);

        if (element instanceof Element) {
            root = element;
        } else {
            throw reporter.fail('ERR01', {
                componentName,
                action: actionLabel,
                selector: elementOrQuery,
            });
        }
    } else {
        throw reporter.fail('ERR02', {
            componentName,
            action: actionLabel,
            element: elementOrQuery,
        });
    }

    return root as T;
}
