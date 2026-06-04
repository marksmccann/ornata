// Runtime-only helper types used by Ornata's internal plumbing.
//
// These types intentionally erase the public generic relationships used by the
// component authoring API so internal helpers can share broad, runtime-focused
// contracts without repeated casting throughout the framework source.

import type Ornata from './index.js';

/**
 * A broad internal component instance shape used by runtime helpers.
 */
export type InternalInstance = Ornata.InternalInstance;

/**
 * A broad computed callback shape used by runtime helpers after generic
 * component definitions have been erased at the runtime boundary.
 */
export type ComputedCallback = (
    this: InternalInstance,
    currentValue: unknown,
    changedState: string
) => unknown;

/**
 * A string-keyed record of runtime computed callbacks.
 */
export type ComputedOptions = Record<string, ComputedCallback>;

/**
 * A broad watch callback shape used by runtime helpers after generic component
 * definitions have been erased at the runtime boundary.
 */
export type WatchCallback = (
    this: InternalInstance,
    newValue: unknown,
    oldValue: unknown
) => void;

/**
 * A string-keyed record of runtime watch callbacks.
 */
export type WatchOptions = Record<string, WatchCallback>;

/**
 * A broad render callback shape used by runtime helpers after generic
 * component definitions have been erased at the runtime boundary.
 */
export type RenderCallback = (
    this: InternalInstance,
    index?: number
) => Ornata.RenderOptions;

/**
 * A string-keyed record of runtime render callbacks.
 */
export type RenderOptions = Record<string, RenderCallback>;

/**
 * A string-keyed record of runtime data values.
 */
export type DataOptions = Record<string, unknown>;

/**
 * A broad unbound method shape used by runtime helpers after generic
 * component definitions have been erased at the runtime boundary.
 */
export type MethodCallback = (
    this: InternalInstance,
    ...args: unknown[]
) => unknown;

/**
 * A string-keyed record of runtime method definitions before they are bound to
 * an internal instance.
 */
export type MethodOptions = Record<string, MethodCallback>;

/**
 * A string-keyed record of runtime methods after they have been bound to an
 * internal instance.
 */
export type Methods = Record<string, (...args: unknown[]) => unknown>;

/**
 * Lifecycle callbacks used by runtime helpers after generic component
 * definitions have been erased at the runtime boundary.
 */
export interface LifecycleOptions {
    setup?: (this: InternalInstance) => void;
    teardown?: (this: InternalInstance) => void;
}

/**
 * Root configuration used by runtime helpers.
 */
export interface RootOptions {
    matches?: string;
}

/**
 * State property configuration used by runtime helpers.
 */
export interface StatePropertyOptions {
    default?: unknown;
    type?:
        | StringConstructor
        | NumberConstructor
        | BooleanConstructor
        | ArrayConstructor
        | ObjectConstructor
        | FunctionConstructor;
    parse?: (value: string) => unknown;
    private?: boolean;
    readonly?: boolean;
}

/**
 * A string-keyed record of runtime state property configuration.
 */
export type StateOptions = Record<string, StatePropertyOptions>;

/**
 * A broad state listener shape used by runtime helpers.
 */
export type StateListener = (newValue: unknown, oldValue: unknown) => void;

/**
 * A string-keyed map of runtime state listeners by state property.
 */
export type StateListeners = Map<string, Set<StateListener>>;

/**
 * Element property configuration used by runtime helpers.
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
 */
export type ElementOptions = Record<string, ElementPropertyOptions>;
