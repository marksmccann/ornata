import type {
    StatePropertyOptions,
    StateTypeConstructor,
    StateTypeName,
    StateTypeSource,
} from './runtime.js';
import inferStateType from './inferStateType.js';

/**
 * The result of resolving an expected state type from runtime state options.
 * @private
 */
export interface ExpectedStateTypeResolution {
    /**
     * The resolved runtime state type when one could be determined.
     *
     * _Note: Will be undefined if no type information was available or if there were conflicting type signals._
     */
    expectedType?: StateTypeName;

    /**
     * Whether the available type signals disagreed with each other.
     */
    hasConflict: boolean;

    /**
     * The option sources that contributed to the resolved type analysis.
     */
    sources: StateTypeSource[];
}

/**
 * Gets the runtime state type name for a constructor option.
 * @param type The constructor declared in the state options.
 * @returns The runtime state type name.
 * @private
 */
function getStateTypeName(
    type?: StateTypeConstructor
): StateTypeName | undefined {
    if (type === String) return 'string';
    if (type === Number) return 'number';
    if (type === Boolean) return 'boolean';
    if (type === Array) return 'array';
    if (type === Object) return 'object';
    if (type === Function) return 'function';
    return undefined;
}

/**
 * Resolves the expected runtime state type from the state options and an
 * optional parsed value.
 * @param option The runtime state property options.
 * @param parsedValue The parsed state value, when available.
 * @returns The resolved expected runtime state type.
 * @private
 */
export default function getExpectedStateType(
    option: StatePropertyOptions,
    parsedValue?: unknown
): ExpectedStateTypeResolution {
    const inferredTypes: Array<{
        source: StateTypeSource;
        type?: StateTypeName;
    }> = [];
    let expectedType: StateTypeName | undefined;
    let hasConflict = false;
    let sources: StateTypeSource[] = [];

    if (option.type) {
        const typeName = getStateTypeName(option.type);
        inferredTypes.push({ source: 'type', type: typeName });
    }

    if (option.default !== undefined) {
        const typeName = inferStateType(option.default);
        inferredTypes.push({ source: 'default', type: typeName });
    }

    if (parsedValue !== undefined) {
        const typeName = inferStateType(parsedValue);
        inferredTypes.push({ source: 'parsed', type: typeName });
    }

    if (inferredTypes.length > 0) {
        const uniqueTypes = new Set(inferredTypes.map(({ type }) => type));

        if (uniqueTypes.size === 1) {
            expectedType = inferredTypes[0].type;
        } else {
            hasConflict = true;
        }

        sources = inferredTypes.map(({ source }) => source);
    }

    return { expectedType, hasConflict, sources };
}
