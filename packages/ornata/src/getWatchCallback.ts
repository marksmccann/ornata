import type Ornata from './index.js';

/**
 * Gets the watch callback for a given property.
 * @param this The component instance.
 * @param property The property to get the watch callback for.
 * @param watchOptions The watch options for the property.
 * @returns The watch callback for the property.
 * @private
 */
export default function getWatchCallback<
    T extends Ornata.ComponentInternalInstance,
>(
    this: T,
    property: keyof T['state'],
    watchOptions: Ornata.ComponentOption<T, 'watch'>
): Ornata.ComponentWatchCallback<T, keyof T['state']> {
    const watchCallback: Ornata.ComponentWatchCallback<T, keyof T['state']> =
        function watchCallback(payload) {
            const callback = watchOptions[property];
            if (callback) callback.call(this, payload);
        };

    return watchCallback;
}
