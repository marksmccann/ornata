import type Ornata from './index';
import type { RenderElementData } from './renderElement';
import reporter from './reporter';

/**
 * A map of active event listeners for each component instance. Used to
 * remove event listeners when the component is disposed or updated.
 * @private
 */
const eventListeners: WeakMap<
    Ornata.ComponentInternalInstance,
    Map<Element, Map<string, () => void>>
> = new WeakMap();

/**
 * Attaches event listeners to the element.
 * @param this The component instance.
 * @param events The events to attach to the element.
 * @param data The data required to render the element.
 * @returns A function to remove the event listeners.
 * @private
 */
export default function attachEvents<
    T extends Ornata.ComponentInternalInstance,
>(
    this: T,
    events: Ornata.ComponentRenderOptions['events'],
    data: RenderElementData
): () => void {
    const { componentName, element, elementName } = data;
    let instanceListeners = eventListeners.get(this);

    if (!instanceListeners) {
        instanceListeners = new Map();
        eventListeners.set(this, instanceListeners);
    }

    Object.entries(events || {}).forEach(([property, value]) => {
        const eventHandler = value as (event: Event) => void;
        const supportedTypes = ['function'];

        if (typeof eventHandler !== 'function') {
            reporter.error('ERR19', {
                componentName,
                element: elementName,
                property: property,
                type: typeof value,
                supportedTypes: supportedTypes.join(', '),
            });

            return;
        }

        let elementListeners = instanceListeners.get(element);

        if (!elementListeners) {
            elementListeners = new Map();
            instanceListeners.set(element, new Map());
        }

        const previousHandler = elementListeners.get(property);

        // Remove the previous handler before adding the new one
        if (previousHandler && eventHandler !== previousHandler) {
            element.removeEventListener(property, previousHandler);
        }

        element.addEventListener(property, eventHandler);
    });

    return () => {
        instanceListeners.forEach((elementListeners, element) => {
            elementListeners.forEach((handler, property) => {
                element.removeEventListener(property, handler);
            });
        });
    };
}
