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
    const componentMetadata = new WeakMap<
        Ornata.ComponentInternalInstance,
        Ornata.ComponentMetadata
    >();
    const initializing = new WeakMap<
        Ornata.ComponentInternalInstance,
        boolean
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
        const metadata = componentMetadata.get(
            this
        ) as Ornata.ComponentMetadata;

        // Cleanup the previous update before starting a new one
        if (cleanupUpdate) cleanupUpdate();

        // validate the state property
        validateState(displayName, property, newValue, stateOptions);

        // Re-render the component
        const renderCleanup = renderComponent.call(
            this,
            displayName,
            this.elements,
            metadata,
            renderOptions
        );

        // Get the watcher callback for the property
        const watchCallback = getWatchCallback.call(
            this,
            property,
            watchOptions
        );

        // Run the watcher callback
        watchCallback.call(this, oldValue, newValue, metadata);

        // external state listeners

        updateCleanup.set(this, renderCleanup);
    }

    return class Component implements Ornata.ComponentInstance<T> {
        readonly $$typeof: Ornata.ComponentInstance<T>['$$typeof'];

        readonly $root: Ornata.ComponentInstance<T>['$root'];

        $state: Ornata.ComponentInstance<T>['$state'];

        static readonly displayName: Ornata.ComponentConstructor<T>['displayName'] =
            displayName;

        constructor(root: Element, initialState?: Partial<T['state']>) {
            resolveRootOptions(displayName, root, rootOptions);

            const internalInstance = {} as T;

            const computed = {} as T['computed'];

            const metadata: Ornata.ComponentMetadata = {
                initialized: false,
            };

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
                    const newState = { ...state, [key]: value };
                    const oldState = { ...state };
                    const newValue = value;
                    const oldValue = target[key];

                    // Ignore the update if the value hasn't changed
                    if (newValue === oldValue) {
                        return true;
                    }

                    target[property] = value;

                    // Resolve the computed options after the state has been updated
                    resolveComputedOptions.call(
                        internalInstance,
                        displayName,
                        oldState,
                        newState,
                        metadata,
                        computedOptions
                    );

                    // Ignores updates during the initialization phase
                    if (initializing.get(internalInstance)) {
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
            this.$root = root;
            this.$state = externalState;

            // Resolve the computed options before setup
            resolveComputedOptions.call(
                internalInstance,
                displayName,
                state,
                state,
                metadata,
                computedOptions
            );

            // Run the setup lifecycle method
            lifecycleOptions.setup?.call(internalInstance);

            // Set the component metadata before updating the component
            componentMetadata.set(internalInstance, metadata);

            // Manually perform the update for every state property
            Object.keys(stateOptions).forEach((key) => {
                const property = key as keyof Ornata.ComponentState;
                const value = internalInstance.state[property];
                updateComponent.call(internalInstance, property, value, value);
            });

            // Set the initialized flag
            metadata.initialized = true;

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
            externalInstances.delete(this.$root);
            internalInstances.delete(this);
        };

        addStateListener: Ornata.ComponentInstance<T>['addStateListener'] = (
            property,
            listener
        ) => {
            console.log('addStateListener', property, listener);
        };

        removeStateListener: Ornata.ComponentInstance<T>['removeStateListener'] =
            (property, listener) => {
                console.log('removeStateListener', property, listener);
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
                    instance.$state[property as keyof T['state']] = value;
                });
            };
    };
}

export default defineComponent;
