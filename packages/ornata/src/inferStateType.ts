import type { StateTypeName } from './runtime.js';

/**
 * Infers the runtime state type name from a value.
 * @param value The value to inspect.
 * @returns The runtime state type name.
 * @private
 */
export default function inferStateType(
    value: unknown
): StateTypeName | undefined {
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'function') return 'function';
    return undefined;
}
