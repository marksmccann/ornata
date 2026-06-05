import type { InternalInstance, WatchCallback, WatchOptions } from './runtime.js';

/**
 * Gets the watch callback for a given property.
 * @param this The component instance.
 * @param property The property to get the watch callback for.
 * @param watchOptions The watch options for the property.
 * @returns The watch callback for the property.
 * @private
 */
export default function getWatchCallback(
    this: InternalInstance,
    property: string,
    watchOptions: WatchOptions
): WatchCallback {
    const watchCallback: WatchCallback = function watchCallback(context) {
        const callback = watchOptions[property];
        if (callback) callback.call(this, context);
    };

    return watchCallback;
}
