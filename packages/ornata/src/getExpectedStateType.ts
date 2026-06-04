import type {
    StatePropertyOptions,
    StateTypeConstructor,
    StateTypeName,
    StateTypeSource,
} from './runtime.js';
import inferStateType from './inferStateType.js';

/**
 * Per-source inferred state type data used by runtime validation helpers.
 * @private
 */
export interface InferredStateTypeData {
    /**
     * The option source that produced the inferred type.
     */
    source: StateTypeSource;

    /**
     * The runtime state type inferred from the source.
     */
    type: StateTypeName;
}

/**
 * Reporter-friendly conflict details derived from a state type resolution.
 * @private
 */
export interface ExpectedStateTypeConflictDetails {
    /**
     * The conflicting option sources, formatted for reporter tokens.
     */
    sources: string;

    /**
     * The conflicting source-to-type mappings, formatted for reporter tokens.
     */
    types: string;
}

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
     * The inferred type produced by each contributing option source.
     */
    inferredTypes: InferredStateTypeData[];

    /**
     * Reporter-friendly conflict details when the inferred types disagree.
     */
    conflictDetails?: ExpectedStateTypeConflictDetails;
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
    const inferredTypes: InferredStateTypeData[] = [];
    let conflictDetails: ExpectedStateTypeConflictDetails | undefined;
    let expectedType: StateTypeName | undefined;

    if (option.type) {
        const typeName = getStateTypeName(option.type);
        if (typeName) inferredTypes.push({ source: 'type', type: typeName });
    }

    if (option.default !== undefined) {
        const typeName = inferStateType(option.default);
        if (typeName) inferredTypes.push({ source: 'default', type: typeName });
    }

    if (parsedValue !== undefined) {
        const typeName = inferStateType(parsedValue);
        if (typeName) inferredTypes.push({ source: 'parsed', type: typeName });
    }

    if (inferredTypes.length > 0) {
        const uniqueTypes = new Set(inferredTypes.map(({ type }) => type));

        if (uniqueTypes.size === 1) {
            expectedType = inferredTypes[0].type;
        } else {
            const sources = inferredTypes
                .map(({ source }) => `"${source}"`)
                .join(', ');
            const types = inferredTypes
                .map(({ source, type }) => `"${source}" => "${type}"`)
                .join(', ');

            conflictDetails = { sources, types };
        }
    }

    return { expectedType, inferredTypes, conflictDetails };
}
