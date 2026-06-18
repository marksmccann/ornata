import type Ornata from './index.js';
import reporter from './reporter.js';
import describeElement from './describeElement.js';
import isComponent from './isComponent.js';

/**
 * Mount all Ornata components declared in the document via the `data-ornata` attribute.
 * @param constructors The constructors to use when mounting matching components.
 * @returns The mounted component instances.
 * @since v0.5.0
 */
export default function mountAll<
    T extends Record<
        string,
        Ornata.ComponentConstructor<Ornata.InternalInstance>
    >,
>(constructors: T) {
    type InitializedComponent = Ornata.InferComponentInstance<T[keyof T]>;
    const expectedComponentNames = Object.keys(constructors);
    const instances = new Set<InitializedComponent>();
    const rootElements = Array.from(
        document.querySelectorAll<HTMLElement | SVGElement>(`[data-ornata]`)
    );

    rootElements.forEach((rootElement) => {
        const componentName = rootElement.dataset.ornata;

        if (!componentName) {
            reporter.error('ERR24', {
                root: describeElement(rootElement),
                value: typeof componentName,
                expected: expectedComponentNames.join(', '),
            });

            return;
        }

        const component = constructors[componentName as keyof T];

        if (!isComponent(component)) {
            reporter.error('ERR24', {
                root: describeElement(rootElement),
                value: componentName,
                expected: expectedComponentNames.join(', '),
            });

            return;
        }

        const instance = component.mount(rootElement) as InitializedComponent;

        delete rootElement.dataset.ornata;

        instances.add(instance);
    });

    return Array.from(instances);
}
