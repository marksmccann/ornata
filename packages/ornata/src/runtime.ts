// Runtime-only helper types used by Ornata's internal plumbing.
//
// These types intentionally erase the public generic relationships used by the
// component authoring API so internal helpers can share broad, runtime-focused
// contracts without repeated casting throughout the framework source.

import type Ornata from './index.js';

/**
 * A broad internal component instance shape used by runtime helpers.
 * @private
 */
export type InternalInstance = Ornata.InternalInstance;

/**
 * A broad computed callback shape used by runtime helpers after generic
 * component definitions have been erased at the runtime boundary.
 * @private
 */
export type ComputedCallback = (
    this: InternalInstance,
    context: ComputedContext
) => unknown;

/**
 * A string-keyed record of runtime computed callbacks.
 * @private
 */
export type ComputedOptions = Record<string, ComputedCallback>;

/**
 * Context passed to runtime computed callbacks.
 * @private
 */
export interface ComputedContext {
    type: 'computed';
    currentValue: unknown;
    changedProperty: string;
}

/**
 * A broad watch callback shape used by runtime helpers after generic component
 * definitions have been erased at the runtime boundary.
 * @private
 */
export type WatchCallback = (
    this: InternalInstance,
    context: WatchContext
) => void;

/**
 * A string-keyed record of runtime watch callbacks.
 * @private
 */
export type WatchOptions = Record<string, WatchCallback>;

/**
 * Context passed to runtime watch callbacks.
 * @private
 */
export interface WatchContext {
    type: 'watch';
    newValue: unknown;
    oldValue: unknown;
    isInitial: boolean;
}

/**
 * A broad render callback shape used by runtime helpers after generic
 * component definitions have been erased at the runtime boundary.
 * @private
 */
export type RenderCallback = (
    this: InternalInstance,
    context: RenderContext
) => Ornata.RenderOptions;

/**
 * A string-keyed record of runtime render callbacks.
 * @private
 */
export type RenderOptions = Record<string, RenderCallback>;

/**
 * Context passed to runtime render callbacks.
 * @private
 */
export interface RenderContext {
    type: 'render';
    index: number | undefined;
}

/**
 * A string-keyed record of runtime data values.
 * @private
 */
export type DataOptions = Record<string, unknown>;

/**
 * A broad unbound method shape used by runtime helpers after generic
 * component definitions have been erased at the runtime boundary.
 * @private
 */
export type MethodCallback = (
    this: InternalInstance,
    ...args: unknown[]
) => unknown;

/**
 * A string-keyed record of runtime method definitions before they are bound to
 * an internal instance.
 * @private
 */
export type MethodOptions = Record<string, MethodCallback>;

/**
 * A string-keyed record of runtime methods after they have been bound to an
 * internal instance.
 * @private
 */
export type Methods = Record<string, (...args: unknown[]) => unknown>;

/**
 * Lifecycle callbacks used by runtime helpers after generic component
 * definitions have been erased at the runtime boundary.
 * @private
 */
export interface LifecycleOptions {
    setup?: (this: InternalInstance) => void;
    teardown?: (this: InternalInstance) => void;
}

/**
 * Root configuration used by runtime helpers.
 * @private
 */
export interface RootOptions {
    matches?: string;
}

/**
 * State property configuration used by runtime helpers.
 * @private
 */
export type StateTypeConstructor =
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ArrayConstructor
    | ObjectConstructor
    | FunctionConstructor;

/**
 * Runtime-friendly state type names used by validation and parsing helpers.
 * @private
 */
export type StateTypeName =
    | 'string'
    | 'number'
    | 'boolean'
    | 'array'
    | 'object'
    | 'function';

/**
 * Runtime source names for inferred state type expectations.
 * @private
 */
export type StateTypeSource = 'type' | 'default' | 'parsed';

/**
 * Runtime configuration for an individual state property.
 * @private
 */
export interface StatePropertyOptions {
    default?: unknown;
    type?: StateTypeConstructor;
    parse?: (value: string) => unknown;
    private?: boolean;
    readonly?: boolean;
}

/**
 * A string-keyed record of runtime state property configuration.
 * @private
 */
export type StateOptions = Record<string, StatePropertyOptions>;

/**
 * A broad state listener shape used by runtime helpers.
 * @private
 */
export interface StateListenerEvent {
    property: string;
    newValue: unknown;
    oldValue: unknown;
    target: unknown;
}

/**
 * A broad state listener shape used by runtime helpers.
 * @private
 */
export type StateListener = (event: StateListenerEvent) => void;

/**
 * A string-keyed map of runtime state listeners by state property.
 * @private
 */
export type StateListeners = Map<string, Set<StateListener>>;

/**
 * Element property configuration used by runtime helpers.
 * @private
 */
export interface ElementPropertyOptions {
    queryAll?: string;
    query?: string;
    create?: keyof HTMLElementTagNameMap;
    resolve?: (root: Element) => Ornata.ComponentElement;
    min?: number;
    max?: number;
}

/**
 * A string-keyed record of runtime element property configuration.
 * @private
 */
export type ElementOptions = Record<string, ElementPropertyOptions>;
