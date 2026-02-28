import type Ornata from './index';
import renderElement from './renderElement';
import type { RenderElementData } from './renderElement';

export default function renderComponent<
    T extends Ornata.ComponentInternalInstance,
>(
    this: T,
    componentName: string,
    elements: T['elements'],
    renderOptions: Ornata.ComponentOption<T, 'render'>
): () => void {
    let elementCleanup: Array<ReturnType<typeof renderElement>> = [];

    Object.entries(renderOptions).forEach(([elementName, value]) => {
        const renderCallback = value as Ornata.ComponentRenderCallback<
            T,
            keyof T['elements']
        >;
        const elementsDataToRender: Array<RenderElementData> = [];

        if (Array.isArray(elements)) {
            elements.forEach((element, index) => {
                const result = renderCallback.call(this, index);
                let name = `"${elementName}"`;

                if (typeof index === 'number') {
                    name = `"${elementName}" at index ${index}`;
                }

                elementsDataToRender.push({
                    componentName,
                    element,
                    elementName: name,
                    options: result,
                });
            });
        } else if (elements instanceof Element) {
            const result = value.call(this);

            elementsDataToRender.push({
                componentName,
                element: elements,
                elementName: `"${elementName}"`,
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
