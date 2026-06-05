import type Ornata from './index';
import reporter from './reporter';
import describeElement from './describeElement';
import getRootElement from './getRootElement';
import type {
    InferComponentInstance,
    InferredComponentOptions,
    LooseComponentOptions,
} from './defineComponent.types.js';
import resolveRootOptions from './resolveRootOptions';
import resolveStateOptions from './resolveStateOptions';
import validateState from './validateState';
import resolveElementOptions from './resolveElementOptions';
import resolveMethodOptions from './resolveMethodOptions';
import renderComponent from './renderComponent';
import getWatchCallback from './getWatchCallback';
import resolveComputedOptions from './resolveComputedOptions';
import type {
    ComputedOptions,
    DataOptions,
    ElementOptions,
    InternalInstance,
    LifecycleOptions,
    MethodOptions,
    RootOptions,
    RenderOptions,
    StateListener,
    StateListeners,
    StateOptions,
    WatchOptions,
} from './runtime.js';
import { ORNATA_COMPONENT_CONSTRUCTOR } from './symbols';

/**
 * Defines an Ornata component constructor from a set of typed component options.
 * @param options The configuration used to define the component's state, elements, methods, lifecycle, and rendering behavior.
 * @returns A component constructor that can create and manage component instances.
 * @example
 * ```ts
 * const Counter = defineComponent({
 *     name: "Counter",
 *     state: {
 *         count: {
 *             default: 0,
 *         },
 *     },
 * });
 * ```
 *
 * @example
 * ```ts
 * interface CounterState {
 *     // The current visible count.
 *     count: number;
 * }
 *
 * const Counter = defineComponent<{
 *     state: CounterState;
 * }>({
 *     name: "Counter",
 *     state: {
 *         count: {
 *             default: 0,
 *         },
 *     },
 * });
 * ```
 * @since v0.1.0
 */
function defineComponent<TOptions extends LooseComponentOptions>(
    options: TOptions & InferredComponentOptions<TOptions>
): Ornata.ComponentConstructor<InferComponentInstance<TOptions>>;
function defineComponent<TParts extends Ornata.ComponentParts>(
    options: Ornata.ComponentOptions<
        Ornata.NormalizeComponentParts<NoInfer<TParts>>
    >
): Ornata.ComponentConstructor<Ornata.NormalizeComponentParts<TParts>>;
function defineComponent<T extends Ornata.InternalInstance>(
    options: Ornata.ComponentOptions<T>
): Ornata.ComponentConstructor<T> {
    const displayName = options.name || 'UnnamedComponent';
    const computedOptions = (options.computed || {}) as ComputedOptions;
    const dataOptions = (options.data || {}) as DataOptions;
    const elementOptions = (options.elements || {}) as ElementOptions;
    const lifecycleOptions = (options.lifecycle || {}) as LifecycleOptions;
    const methodOptions = (options.methods || {}) as MethodOptions;
    const rootOptions = (options.root || {}) as RootOptions;
    const renderOptions = (options.render || {}) as RenderOptions;
    const stateOptions = (options.state || {}) as StateOptions;
    const watchOptions = (options.watch || {}) as WatchOptions;
    const externalInstances = new WeakMap<
        Element,
        Ornata.ComponentInstance<T>
    >();
    const internalInstances = new WeakMap<
        Ornata.ComponentInstance<T>,
        Ornata.InternalInstance
    >();
    const updateCleanup = new WeakMap<Ornata.InternalInstance, () => void>();
    const stateListeners = new WeakMap<
        Ornata.InternalInstance,
        StateListeners
    >();

    /**
     * Imperatively performs all actions associated with updating a component related to a specific property.
     * @param this The component instance.
     * @param property The property that was updated.
     * @param oldValue The previous value of the property.
     * @param newValue The new value of the property.
     * @param isInitial Whether the update is part of the initialization pass.
     * @private
     */
    function updateComponent(
        this: InternalInstance,
        property: string,
        oldValue: unknown,
        newValue: unknown,
        isInitial: boolean
    ) {
        const cleanupUpdate = updateCleanup.get(this);
        const externalInstance = externalInstances.get(this.root);
        const listeners = stateListeners.get(this);
        const handlers = listeners?.get(property);

        // Cleanup the previous update before starting a new one
        if (cleanupUpdate) cleanupUpdate();

        validateState(displayName, property, newValue, stateOptions);

        resolveComputedOptions.call(
            this,
            displayName,
            property,
            computedOptions
        );

        // Re-render the component
        const renderCleanup = renderComponent.call(
            this,
            displayName,
            this.elements,
            renderOptions
        );

        const watchCallback = getWatchCallback.call(
            this,
            property,
            watchOptions
        );

        watchCallback.call(this, {
            type: 'watch',
            newValue,
            oldValue,
            isInitial,
        });

        if (externalInstance && handlers) {
            const event = {
                property,
                newValue,
                oldValue,
                target: externalInstance,
            };

            handlers.forEach((handler) => {
                handler.call(externalInstance, event);
            });
        }

        updateCleanup.set(this, renderCleanup);
    }

    return class Component implements Ornata.ComponentInstance<T> {
        static readonly $$typeof: Ornata.ComponentConstructor<T>['$$typeof'] =
            ORNATA_COMPONENT_CONSTRUCTOR;

        readonly root: Ornata.ComponentInstance<T>['root'];

        state: Ornata.ComponentInstance<T>['state'];

        static readonly displayName: Ornata.ComponentConstructor<T>['displayName'] =
            displayName;

        constructor(root: Element, initialState?: Partial<T['state']>) {
            let initializing = true;

            resolveRootOptions(displayName, root, rootOptions);

            const internalInstance = {} as T;

            const computed = {} as T['computed'];

            const state = resolveStateOptions(
                displayName,
                root,
                initialState || {},
                stateOptions
            ) as T['state'];

            const elements = resolveElementOptions(
                displayName,
                root,
                elementOptions
            ) as T['elements'];

            const methods = resolveMethodOptions.call(
                internalInstance as InternalInstance,
                methodOptions
            ) as T['methods'];

            const internalState = new Proxy(state, {
                get(target, key) {
                    if (typeof key === 'symbol') {
                        return Reflect.get(target, key);
                    }

                    const property = key as string;

                    if (!Object.hasOwn(stateOptions, property)) {
                        reporter.error('ERR22', {
                            action: 'get',
                            componentName: displayName,
                            property,
                        });

                        return undefined;
                    }

                    return Reflect.get(target, key);
                },
                set(target, key, value) {
                    if (typeof key === 'symbol') {
                        return Reflect.set(target, key, value);
                    }

                    const state = target as Record<string, unknown>;
                    const property = key as string;

                    if (!Object.hasOwn(stateOptions, property)) {
                        reporter.error('ERR22', {
                            action: 'set',
                            componentName: displayName,
                            property,
                        });

                        return false;
                    }

                    const newValue = value;
                    const oldValue = state[property];

                    // Ignore the update if the value hasn't changed
                    if (newValue === oldValue) {
                        return true;
                    }

                    Reflect.set(target, key, value);

                    // Ignores updates during the initialization phase
                    if (initializing) {
                        return true;
                    }

                    updateComponent.call(
                        internalInstance as InternalInstance,
                        property,
                        oldValue,
                        newValue,
                        false
                    );

                    return true;
                },
            });

            const externalState = new Proxy(state, {
                get(target, key) {
                    if (typeof key === 'symbol') {
                        return Reflect.get(target, key);
                    }

                    const property = key as string;

                    const options = stateOptions[property];

                    if (options?.private) {
                        reporter.error('ERR15', {
                            componentName: displayName,
                            property,
                        });

                        return undefined;
                    }

                    return (internalState as Record<string, unknown>)[property];
                },
                set(target, key, value) {
                    if (typeof key === 'symbol') {
                        return Reflect.set(target, key, value);
                    }

                    const property = key as string;
                    const options = stateOptions[property];
                    const state = internalState as Record<string, unknown>;

                    if (options?.private || options?.readonly) {
                        reporter.error('ERR16', {
                            componentName: displayName,
                            type: options.private ? 'private' : 'readonly',
                            property,
                        });

                        return false;
                    }

                    state[property] = value;

                    return true;
                },
            });

            // Set up the internal instance
            internalInstance.root = root;
            internalInstance.state = internalState;
            internalInstance.elements = elements;
            internalInstance.methods = methods;
            internalInstance.data = dataOptions as T['data'];
            internalInstance.computed = computed;

            // Set up the external instance
            this.root = root;
            this.state = externalState;

            // Run the setup lifecycle method
            lifecycleOptions.setup?.call(internalInstance as InternalInstance);

            // Manually perform the initial update for every state property
            Object.keys(stateOptions).forEach((key) => {
                const property = key;
                const value = (
                    internalInstance.state as Record<string, unknown>
                )[property];

                updateComponent.call(
                    internalInstance as InternalInstance,
                    property,
                    value,
                    value,
                    true
                );
            });

            // Set the initializing flag
            initializing = false;

            internalInstances.set(this, internalInstance);
            externalInstances.set(root, this);
        }

        dispose: Ornata.ComponentInstance<T>['dispose'] = () => {
            const internalInstance = internalInstances.get(this);

            if (!internalInstance) {
                reporter.error('ERR21', {
                    componentName: displayName,
                    action: 'dispose',
                });

                return;
            }

            const cleanupUpdate = updateCleanup.get(internalInstance);

            if (cleanupUpdate) cleanupUpdate();
            stateListeners.delete(internalInstance);
            updateCleanup.delete(internalInstance);
            lifecycleOptions.teardown?.call(
                internalInstance as InternalInstance
            );
            externalInstances.delete(this.root);
            internalInstances.delete(this);
        };

        addStateListener: Ornata.ComponentInstance<T>['addStateListener'] = (
            property,
            listener
        ) => {
            const internalInstance = internalInstances.get(this);
            const handler = listener as StateListener;

            if (!internalInstance) {
                reporter.error('ERR21', {
                    componentName: displayName,
                    action: `add state listener for property "${property as string}"`,
                });

                return () => {};
            }

            if (!Object.hasOwn(stateOptions, property)) {
                reporter.error('ERR22', {
                    componentName: displayName,
                    action: 'add state listener for',
                    property: property as string,
                });

                return () => {};
            }

            let listeners = stateListeners.get(internalInstance);

            if (!listeners) {
                listeners = new Map();
                stateListeners.set(internalInstance, listeners);
            }

            let handlers = listeners.get(property as string);

            if (!handlers) {
                handlers = new Set();
                listeners.set(property as string, handlers);
            }

            const cleanup = () => {
                const currentListeners = stateListeners.get(internalInstance);
                const currentHandlers = currentListeners?.get(
                    property as string
                );

                if (!currentListeners || !currentHandlers) {
                    return;
                }

                currentHandlers.delete(handler);

                if (currentHandlers.size === 0) {
                    currentListeners.delete(property as string);
                }

                if (currentListeners.size === 0) {
                    stateListeners.delete(internalInstance);
                }
            };

            if (handlers.has(handler)) {
                reporter.warn('WRN01', {
                    componentName: displayName,
                    action: 'add',
                    property: property as string,
                    status: 'already exists',
                });

                return cleanup;
            }

            handlers.add(handler);

            return cleanup;
        };

        static createInstance: Ornata.ComponentConstructor<T>['createInstance'] =
            (instanceRoot, initialState) => {
                const root = getRootElement<T['root']>(
                    displayName,
                    instanceRoot,
                    'create'
                );

                if (externalInstances.has(root)) {
                    throw reporter.fail('ERR03', {
                        componentName: displayName,
                        action: 'create',
                        root: describeElement(root),
                    });
                }

                return new Component(root, initialState);
            };

        static getInstance: Ornata.ComponentConstructor<T>['getInstance'] = (
            instanceRoot
        ) => {
            const root = getRootElement<T['root']>(
                displayName,
                instanceRoot,
                'get'
            );

            const instance = externalInstances.get(root);

            if (!instance) {
                throw reporter.fail('ERR04', {
                    componentName: displayName,
                    action: 'get',
                    root: describeElement(root),
                });
            }

            return instance;
        };

        static queryInstance: Ornata.ComponentConstructor<T>['queryInstance'] =
            (instanceRoot) => {
                try {
                    return this.getInstance(instanceRoot);
                } catch (error) {
                    return null;
                }
            };

        static deleteInstance: Ornata.ComponentConstructor<T>['deleteInstance'] =
            (instanceRoot) => {
                const root = getRootElement<T['root']>(
                    displayName,
                    instanceRoot,
                    'delete'
                );

                const instance = externalInstances.get(root);

                if (!instance) {
                    throw reporter.fail('ERR04', {
                        componentName: displayName,
                        action: 'delete',
                        root: describeElement(root),
                    });
                }

                instance.dispose();
            };

        static updateInstance: Ornata.ComponentConstructor<T>['updateInstance'] =
            (instanceRoot, stateChanges) => {
                const root = getRootElement<T['root']>(
                    displayName,
                    instanceRoot,
                    'update'
                );

                const instance = externalInstances.get(root);

                if (!instance) {
                    throw reporter.fail('ERR04', {
                        componentName: displayName,
                        action: 'update',
                        root: describeElement(root),
                    });
                }

                Object.entries(stateChanges).forEach(([property, value]) => {
                    (instance.state as Record<string, unknown>)[property] =
                        value;
                });
            };
    };
}

export default defineComponent;
