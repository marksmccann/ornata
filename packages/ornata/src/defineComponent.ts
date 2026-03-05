import type Ornata from './index';
import reporter from './reporter';
import describeElement from './describeElement';
import getRootElement from './getRootElement';
import resolveRootOptions from './resolveRootOptions';
import resolveStateOptions from './resolveStateOptions';
import validateState from './validateState';
import resolveElementOptions from './resolveElementOptions';
import resolveMethodOptions from './resolveMethodOptions';
import renderComponent from './renderComponent';
import getWatchCallback from './getWatchCallback';
import resolveComputedOptions from './resolveComputedOptions';

function defineComponent<T extends Ornata.ComponentInternalInstance>(
    options: Ornata.ComponentOptions<T>
): Ornata.ComponentConstructor<T> {
    const {
        name: displayName = 'UnnamedComponent',
        root: rootOptions = {} as Ornata.ComponentOption<T, 'root'>,
        state: stateOptions = {} as Ornata.ComponentOption<T, 'state'>,
        elements: elementOptions = {} as Ornata.ComponentOption<T, 'elements'>,
        // prettier-ignore
        lifecycle: lifecycleOptions = {} as Ornata.ComponentOption<T, 'lifecycle'>,
        methods: methodOptions = {} as Ornata.ComponentOption<T, 'methods'>,
        data: dataOptions = {} as Ornata.ComponentOption<T, 'data'>,
        render: renderOptions = {} as Ornata.ComponentOption<T, 'render'>,
        watch: watchOptions = {} as Ornata.ComponentOption<T, 'watch'>,
        computed: computedOptions = {} as Ornata.ComponentOption<T, 'computed'>,
    } = options;
    const externalInstances = new WeakMap<
        Element,
        Ornata.ComponentInstance<T>
    >();
    const internalInstances = new WeakMap<
        Ornata.ComponentInstance<T>,
        Ornata.ComponentInternalInstance
    >();
    const updateCleanup = new WeakMap<
        Ornata.ComponentInternalInstance,
        () => void
    >();
    const stateListeners = new WeakMap<
        Ornata.ComponentInternalInstance,
        Map<
            keyof T['state'],
            Set<Ornata.ComponentStateListener<T['state'][keyof T['state']]>>
        >
    >();

    /**
     * Imperatively performs all actions associated with updating a component related to a specific property.
     * @param this The component instance.
     * @param property The property that was updated.
     * @param oldValue The previous value of the property.
     * @param newValue The new value of the property.
     * @private
     */
    function updateComponent(
        this: T,
        property: keyof T['state'],
        oldValue: T['state'][keyof T['state']],
        newValue: T['state'][keyof T['state']]
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

        watchCallback.call(this, { newValue, oldValue });

        if (externalInstance && handlers) {
            handlers.forEach((handler) => {
                handler.call(externalInstance, newValue, oldValue);
            });
        }

        updateCleanup.set(this, renderCleanup);
    }

    return class Component implements Ornata.ComponentInstance<T> {
        readonly $$typeof: Ornata.ComponentInstance<T>['$$typeof'];

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
            );

            const elements = resolveElementOptions(
                displayName,
                root,
                elementOptions
            );

            const methods: T['methods'] = resolveMethodOptions.call(
                internalInstance,
                methodOptions
            );

            const internalState = new Proxy(state, {
                get(target, property) {
                    if (!Object.hasOwn(stateOptions, property)) {
                        reporter.error('ERR22', {
                            action: 'get',
                            componentName: displayName,
                            property: property as string,
                        });

                        return undefined;
                    }

                    return target[property];
                },
                set(target, property, value) {
                    if (!Object.hasOwn(stateOptions, property)) {
                        reporter.error('ERR22', {
                            action: 'set',
                            componentName: displayName,
                            property: property as string,
                        });

                        return false;
                    }

                    const key = property as keyof Ornata.ComponentState;
                    const newValue = value;
                    const oldValue = target[key];

                    // Ignore the update if the value hasn't changed
                    if (newValue === oldValue) {
                        return true;
                    }

                    target[property] = value;

                    // Ignores updates during the initialization phase
                    if (initializing) {
                        return true;
                    }

                    updateComponent.call(
                        internalInstance,
                        property,
                        oldValue,
                        newValue
                    );

                    return true;
                },
            });

            const externalState = new Proxy(state, {
                get(target, property) {
                    const options = stateOptions[property as keyof T['state']];

                    if (options?.private) {
                        reporter.error('ERR15', {
                            componentName: displayName,
                            property: property as string,
                        });

                        return undefined;
                    }

                    return internalState[property];
                },
                set(target, property, value) {
                    const options = stateOptions[property as keyof T['state']];

                    if (options?.private || options?.readonly) {
                        reporter.error('ERR16', {
                            componentName: displayName,
                            type: options.private ? 'private' : 'readonly',
                            property: property as string,
                        });

                        return false;
                    }

                    internalState[property] = value;

                    return true;
                },
            });

            // Set up the internal instance
            internalInstance.root = root;
            internalInstance.state = internalState;
            internalInstance.elements = elements;
            internalInstance.methods = methods;
            internalInstance.data = dataOptions;
            internalInstance.computed = computed;

            // Set up the external instance
            this.$$typeof = Symbol.for('ornata.component');
            this.root = root;
            this.state = externalState;

            // Run the setup lifecycle method
            lifecycleOptions.setup?.call(internalInstance);

            // Manually perform the initial update for every state property
            Object.keys(stateOptions).forEach((key) => {
                const property = key as keyof Ornata.ComponentState;
                const value = internalInstance.state[property];
                updateComponent.call(internalInstance, property, value, value);
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
            lifecycleOptions.teardown?.call(internalInstance);
            externalInstances.delete(this.root);
            internalInstances.delete(this);
        };

        addStateListener: Ornata.ComponentInstance<T>['addStateListener'] = (
            property,
            listener
        ) => {
            const internalInstance = internalInstances.get(this);
            const handler = listener as Ornata.ComponentStateListener<
                T['state'][keyof T['state']]
            >;

            if (!internalInstance) {
                reporter.error('ERR21', {
                    componentName: displayName,
                    action: `add state listener for property "${property as string}"`,
                });

                return;
            }

            if (!Object.hasOwn(stateOptions, property)) {
                reporter.error('ERR22', {
                    componentName: displayName,
                    action: 'add state listener for',
                    property: property as string,
                });

                return;
            }

            let listeners = stateListeners.get(internalInstance);

            if (!listeners) {
                listeners = new Map();
                stateListeners.set(internalInstance, listeners);
            }

            let handlers = listeners.get(property);

            if (!handlers) {
                handlers = new Set();
                listeners.set(property, new Set());
            }

            if (handlers.has(handler)) {
                reporter.warn('WRN01', {
                    componentName: displayName,
                    action: 'add',
                    property: property as string,
                    status: 'already exists',
                });

                return;
            }

            handlers.add(handler);
        };

        removeStateListener: Ornata.ComponentInstance<T>['removeStateListener'] =
            (property, listener) => {
                const internalInstance = internalInstances.get(this);
                const handler = listener as Ornata.ComponentStateListener<
                    T['state'][keyof T['state']]
                >;

                if (!internalInstance) {
                    reporter.error('ERR21', {
                        componentName: displayName,
                        action: `remove state listener for property "${property as string}"`,
                    });

                    return;
                }

                if (!Object.hasOwn(stateOptions, property)) {
                    reporter.error('ERR22', {
                        componentName: displayName,
                        action: 'remove state listener for',
                        property: property as string,
                    });

                    return;
                }

                const listeners = stateListeners.get(internalInstance);
                const handlers = listeners?.get(property);

                if (!listeners || !handlers || !handlers.has(handler)) {
                    reporter.warn('WRN01', {
                        componentName: displayName,
                        action: `remove`,
                        property: property as string,
                        status: 'does not exist',
                    });

                    return;
                }

                handlers.delete(handler);

                if (handlers.size === 0) {
                    listeners.delete(property);
                }

                if (listeners.size === 0) {
                    stateListeners.delete(internalInstance);
                }
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
                    instance.state[property as keyof T['state']] = value;
                });
            };
    };
}

export default defineComponent;
