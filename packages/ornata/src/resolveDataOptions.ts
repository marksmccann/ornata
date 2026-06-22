import type { DataOptions } from './runtime.js';

/**
 * Checks whether a value is a plain object that should be cloned recursively.
 * @param value The value to inspect.
 * @returns Whether the value is a plain object.
 * @private
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);

    return prototype === Object.prototype || prototype === null;
}

/**
 * Clones a nested data value so instance defaults are not shared across
 * component instances.
 * @param value The data value to clone.
 * @returns The cloned value.
 * @private
 */
function cloneDataValue(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map((entry) => cloneDataValue(entry));
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, entry]) => [
                key,
                cloneDataValue(entry),
            ])
        );
    }

    return value;
}

/**
 * Creates a per-instance copy of component data options.
 * Plain objects and arrays nested inside the data object are cloned
 * recursively so defaults are not shared across component instances.
 * @param dataOptions The component data options to resolve.
 * @returns A cloned data object for the current component instance.
 * @private
 */
export default function resolveDataOptions(
    dataOptions: DataOptions
): DataOptions {
    const rawOptions = Object.entries(dataOptions);
    const resolvedOptions = rawOptions.map(([key, value]) => [
        key,
        cloneDataValue(value),
    ]);

    return Object.fromEntries(resolvedOptions);
}
