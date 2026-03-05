import type Ornata from './index.js';
import reporter from './reporter.js';

export default function resolveComputedOptions<
    T extends Ornata.ComponentInternalInstance,
>(
    this: T,
    componentName: string,
    changedState: keyof T['state'],
    computedOptions: Ornata.ComponentOption<T, 'computed'>
): void {
    const computed = this.computed as T['computed'];

    Object.entries(computedOptions).forEach((entry) => {
        const property = entry[0] as keyof T['computed'];
        const computedCallback = entry[1] as Ornata.ComponentComputedCallback<
            T,
            keyof T['computed']
        >;

        if (typeof computedCallback !== 'function') {
            reporter.error('ERR23', {
                componentName,
                property: property as string,
                option: 'computed',
            });

            return;
        }

        const value = computedCallback.call(
            this,
            computed[property],
            changedState
        );

        computed[property] = value;
    });
}
