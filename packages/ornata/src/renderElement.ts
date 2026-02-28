import type Ornata from './index';
import reporter from './reporter';
import renderAttributes from './renderAttributes';
import renderStyle from './renderStyle';
import renderClasses from './renderClasses';
import renderDataset from './renderDataset';
import renderEvents from './renderEvents';

/**
 * The data required to render an element.
 * @private
 */
export type RenderElementData = {
    componentName: string;
    element: Element;
    elementName: string;
    options: Ornata.ComponentRenderOptions;
};

/**
 * Renders the element by applying all of the render options to the element.
 * @param element The element to render.
 * @param data The data required to render the element.
 * @returns A function to perform any cleanup tasks associated with the element.
 * @private
 */
export default function renderElement<
    T extends Ornata.ComponentInternalInstance,
>(this: T, data: RenderElementData): () => void {
    const { componentName, element, elementName, options } = data;
    let eventsCleanup: ReturnType<typeof renderEvents> | undefined;

    Object.entries(options).forEach((entry) => {
        const option = entry[0] as keyof Ornata.ComponentRenderOptions;

        if (option === 'attributes') {
            renderAttributes(
                entry[1] as Ornata.ComponentRenderOptions['attributes'],
                data
            );
        } else if (option === 'style') {
            renderStyle(
                entry[1] as Ornata.ComponentRenderOptions['style'],
                data
            );
        } else if (option === 'classes') {
            renderClasses(
                entry[1] as Ornata.ComponentRenderOptions['classes'],
                data
            );
        } else if (option === 'dataset') {
            renderDataset(
                entry[1] as Ornata.ComponentRenderOptions['dataset'],
                data
            );
        } else if (option === 'events') {
            eventsCleanup = renderEvents.call(
                this,
                entry[1] as Ornata.ComponentRenderOptions['events'],
                data
            );
        } else if (option === 'html') {
            element.innerHTML = entry[1] as string;
        } else if (option === 'text') {
            element.textContent = entry[1] as string;
        } else {
            reporter.error('ERR20', {
                componentName,
                element: elementName,
                option,
            });
        }
    });

    return () => {
        if (eventsCleanup) eventsCleanup();
    };
}
