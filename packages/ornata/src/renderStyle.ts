import type Ornata from './index';
import reporter from './reporter';
import type { RenderElementData } from './renderElement';

/**
 *
 * Updates the style properties on the element.
 * @param style The style properties to set on the element.
 * @param data The data required to render the element.
 * @private
 */
export default function renderStyle(
    style: Ornata.ComponentRenderOptions['style'],
    data: RenderElementData
): void {
    const { componentName, element, elementName } = data;
    const supportedTypes = ['string', 'null', 'undefined'];

    if (!(element instanceof HTMLElement)) {
        reporter.error('ERR18', {
            componentName,
            element: elementName,
            property: 'style',
            supportedTypes: 'HTMLElement',
        });

        return;
    }

    Object.entries(style || {}).forEach(([property, value]) => {
        if (typeof value === 'string') {
            element.style.setProperty(property, value);
        } else if (value === null) {
            element.style.removeProperty(property);
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
