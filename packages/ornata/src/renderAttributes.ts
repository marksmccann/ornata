import type Ornata from './index';
import reporter from './reporter';
import type { RenderElementData } from './renderElement';

/**
 * Updates the attributes on the element.
 * @param attributes The attributes to render.
 * @param data The data required to render the element.
 * @private
 */
export default function renderAttributes(
    attributes: Ornata.ComponentRenderOptions['attributes'],
    data: RenderElementData
): void {
    const { componentName, element, elementName } = data;
    const supportedTypes = ['string', 'boolean', 'null', 'undefined'];

    Object.entries(attributes || {}).forEach(([property, value]) => {
        if (typeof value === 'string') {
            element.setAttribute(property, value);
        } else if (value === true) {
            element.setAttribute(property, '');
        } else if (value === false) {
            element.removeAttribute(property);
        } else if (value === null) {
            element.removeAttribute(property);
        } else if (value !== undefined) {
            reporter.error('ERR19', {
                componentName,
                property,
                element: elementName,
                type: typeof value,
                supportedTypes: supportedTypes.join(', '),
            });
        }
    });
}
