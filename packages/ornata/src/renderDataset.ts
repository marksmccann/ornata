import type Ornata from './index';
import reporter from './reporter';
import type { RenderElementData } from './renderElement';

/**
 * Updates the dataset properties on the element.
 * @param dataset The dataset properties to set on the element.
 * @param data The data required to render the element.
 * @private
 */
export default function renderDataset(
    dataset: Ornata.ComponentRenderOptions['dataset'],
    data: RenderElementData
): void {
    const { componentName, element, elementName } = data;
    const supportedTypes = ['string', 'null', 'undefined'];

    if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
        reporter.error('ERR18', {
            componentName,
            element: elementName,
            property: 'dataset',
            supportedTypes: 'HTMLElement, SVGElement',
        });

        return;
    }

    Object.entries(dataset || {}).forEach(([property, value]) => {
        if (typeof value === 'string') {
            element.dataset[property] = value;
        } else if (value === null) {
            element.removeAttribute(`data-${property}`);
        } else if (value === undefined) {
            return;
        } else {
            reporter.error('ERR19', {
                componentName,
                element: elementName,
                property: property,
                type: typeof value,
                supportedTypes: supportedTypes.join(', '),
            });
        }
    });
}
