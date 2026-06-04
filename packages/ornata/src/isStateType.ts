import type { StateTypeName } from './runtime.js';

/**
 * Checks whether a value matches a runtime state type name.
 * @param value The value to validate.
 * @param expectedType The expected runtime state type name.
 * @returns Whether the value matches the expected type.
 * @private
 */
export default function isStateType(
    value: unknown,
    expectedType: StateTypeName
): boolean {
    if (expectedType === 'string') return typeof value === 'string';
    if (expectedType === 'number') return typeof value === 'number';
    if (expectedType === 'boolean') return typeof value === 'boolean';
    if (expectedType === 'array') return Array.isArray(value);
    if (expectedType === 'object') {
        return typeof value === 'object' && !Array.isArray(value);
    }
    if (expectedType === 'function') return typeof value === 'function';
    return false;
}
