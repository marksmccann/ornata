import type Ornata from './index.js';
import reporter from './reporter.js';
import describeElement from './describeElement.js';
import isComponent from './isComponent.js';

/**
 * Creates a function that initializes Ornata components from the HTML via the `data-ornata` attribute.
 * @param constructors The constructors to use to initialize the components.
 * @returns A function that initializes the components.
 */
export default function createInitializer<
    T extends Ornata.ComponentConstructor<Ornata.ComponentInternalInstance>,
>(constructors: { [K in keyof T]: T[K] }) {
    const expectedComponentNames = Object.keys(constructors);

    return function initialize(): Array<
        Ornata.ComponentInstance<Ornata.ComponentInternalInstance>
    > {
        const instances = new Set<
            Ornata.ComponentInstance<Ornata.ComponentInternalInstance>
        >();
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

            const component = constructors[componentName];

            if (!isComponent(component)) {
                reporter.error('ERR24', {
                    root: describeElement(rootElement),
                    value: componentName,
                    expected: expectedComponentNames.join(', '),
                });

                return;
            }

            const instance = component.createInstance(rootElement);

            delete rootElement.dataset.ornata;

            instances.add(instance);
        });

        return Array.from(instances);
    };
}
