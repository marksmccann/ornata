import type Ornata from './index';

export default function renderComponent<
    T extends Ornata.ComponentInternalInstance,
>(
    componentName: string,
    elements: T['elements'],
    renderOptions: Ornata.ComponentOption<T, 'render'>
): void {
    Object.entries(renderOptions).forEach(([property, value]) => {
        const renderCallback = value as Ornata.ComponentRenderCallback<
            T,
            keyof T['elements']
        >;
        const elementsToRender: Array<
            [element: Element, Ornata.ComponentRenderOptions]
        > = [];

        if (Array.isArray(elements)) {
            elements.forEach((element, index) => {
                const result = renderCallback.call(this, index);
                elementsToRender.push([element, result]);
            });
        } else if (elements instanceof Element) {
            const result = value.call(this);
            elementsToRender.push([elements, result]);
        }

        elementsToRender.forEach(([element, options]) => {
            Object.entries(options).forEach(([property, value]) => {
                // Render the element with the options
            });
        });
    });
}
