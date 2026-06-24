import type Ornata from './index';
import reporter from './reporter';
import renderAttributes from './renderAttributes';
import renderStyle from './renderStyle';
import renderClasses from './renderClasses';
import renderDataset from './renderDataset';
import attachEvents from './attachEvents';
import type { InternalInstance } from './runtime.js';

/**
 * The data required to render an element.
 * @private
 */
export type RenderElementData = {
    componentName: string;
    element: Element;
    elementName: string;
    options: Ornata.RenderOptions;
};

/**
 * Renders the element by applying all of the render options to the element.
 * @param element The element to render.
 * @param data The data required to render the element.
 * @returns A function to perform any cleanup tasks associated with the element.
 * @private
 */
export default function renderElement(
    this: InternalInstance,
    data: RenderElementData
): () => void {
    const { componentName, element, elementName, options } = data;
    let eventsCleanup: ReturnType<typeof attachEvents> | undefined;

    Object.entries(options).forEach((entry) => {
        const option = entry[0] as keyof Ornata.RenderOptions;

        if (option === 'attributes') {
            renderAttributes(
                entry[1] as Ornata.RenderOptions['attributes'],
                data
            );
        } else if (option === 'style') {
            renderStyle(entry[1] as Ornata.RenderOptions['style'], data);
        } else if (option === 'classes') {
            renderClasses(entry[1] as Ornata.RenderOptions['classes'], data);
        } else if (option === 'dataset') {
            renderDataset(entry[1] as Ornata.RenderOptions['dataset'], data);
        } else if (option === 'events') {
            eventsCleanup = attachEvents.call(
                this,
                entry[1] as Ornata.RenderOptions['events'],
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
