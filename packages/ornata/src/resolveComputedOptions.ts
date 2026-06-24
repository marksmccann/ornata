import type { ComputedOptions, InternalInstance } from './runtime.js';
import reporter from './reporter.js';

/**
 * Recomputes every computed property for a component after a state change and
 * stores the latest values on the current instance.
 * @param this The internal component instance whose computed values are updated.
 * @param componentName The component name used for reporting invalid options.
 * @param changedState The state property that triggered this recomputation.
 * @param computedOptions The computed option callbacks to evaluate.
 * @private
 */
export default function resolveComputedOptions(
    this: InternalInstance,
    componentName: string,
    changedState: string,
    computedOptions: ComputedOptions
): void {
    Object.entries(computedOptions).forEach(([property, computedCallback]) => {
        if (typeof computedCallback !== 'function') {
            reporter.error('ERR23', {
                componentName,
                property: property as string,
                option: 'computed',
            });

            return;
        }

        const value = computedCallback.call(this, {
            type: 'computed',
            currentValue: this.computed[property],
            changedProperty: changedState,
        });

        this.computed[property] = value;
    });
}
