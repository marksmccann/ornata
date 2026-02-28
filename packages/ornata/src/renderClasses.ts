import type Ornata from './index';
import reporter from './reporter';
import type { RenderElementData } from './renderElement';

/**
 * Updates the classes on the element.
 * @param classes The classes to set on the element.
 * @param data The data required to render the element.
 * @private
 */
export default function renderClasses(
    classes: Ornata.ComponentRenderOptions['classes'],
    data: RenderElementData
): void {
    const { componentName, element, elementName } = data;
    const supportedTypes = ['boolean'];

    Object.entries(classes || {}).forEach(([property, value]) => {
        if (typeof value === 'boolean') {
            if (value) {
                element.classList.add(property);
            } else {
                element.classList.remove(property);
            }
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
