import type Ornata from './index.js';
import reporter from './reporter.js';

/**
 * Resolves the root options for a component.
 * @param componentName The name of the component.
 * @param root The root element.
 * @param rootOptions The root options.
 * @private
 */
export default function resolveRootOptions<
    T extends Ornata.ComponentInternalInstance,
>(
    componentName: string,
    root: T['root'],
    rootOptions: Ornata.ComponentRootOptions<T>
): void {
    const { matches } = rootOptions;

    if (matches && !root.matches(matches)) {
        reporter.error('ERR05', {
            componentName,
            selector: matches,
        });
    }
}
