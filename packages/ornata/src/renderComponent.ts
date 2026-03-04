import type Ornata from './index';
import renderElement from './renderElement';
import type { RenderElementData } from './renderElement';
import reporter from './reporter.js';

/**
 * Renders the component by rendering its elements.
 * @param this The component instance.
 * @param componentName The display name of the component.
 * @param elements The elements to render.
 * @param componentMetadata The metadata for the component.
 * @param renderOptions The render options for the elements.
 * @returns A function to clean up the element cleanup.
 * @private
 */
export default function renderComponent<
    T extends Ornata.ComponentInternalInstance,
>(
    this: T,
    componentName: string,
    elements: T['elements'],
    componentMetadata: Ornata.ComponentMetadata,
    renderOptions: Ornata.ComponentOption<T, 'render'>
): () => void {
    let elementCleanup: Array<ReturnType<typeof renderElement>> = [];

    Object.entries(renderOptions).forEach((entry) => {
        const elementName = entry[0] as keyof T['elements'];
        const renderCallback = entry[1] as Ornata.ComponentRenderCallback<
            T,
            keyof T['elements']
        >;
        const rendered = componentMetadata.initialized;
        const elementsDataToRender: Array<RenderElementData> = [];
        const elementToRender = elements[elementName];

        if (typeof renderCallback !== 'function') {
            reporter.error('ERR23', {
                componentName,
                property: elementName as string,
                option: 'render',
            });

            return;
        }

        if (Array.isArray(elementToRender)) {
            elementToRender.forEach((element, index) => {
                const result = renderCallback.call(this, { rendered });
                let name = `"${elementName as string}"`;

                if (typeof index === 'number') {
                    name = `"${elementName as string}" at index ${index}`;
                }

                elementsDataToRender.push({
                    componentName,
                    element,
                    elementName: name,
                    options: result,
                });
            });
        } else if (elementToRender instanceof Element) {
            const result = renderCallback.call(this, { rendered });

            elementsDataToRender.push({
                componentName,
                element: elementToRender,
                elementName: `"${elementName as string}"`,
                options: result,
            });
        }

        elementsDataToRender.forEach((data) => {
            const cleanup = renderElement.call(this, data);
            elementCleanup.push(cleanup);
        });
    });

    return () => {
        elementCleanup.forEach((cleanup) => cleanup());
    };
}
