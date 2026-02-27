import type Ornata from './index';
import reporter from './reporter';
import describeElement from './describeElement';
import getRootElement from './getRootElement';
import resolveRootOptions from './resolveRootOptions';
import resolveStateOptions from './resolveStateOptions';
import validateState from './validateState';
import resolveElementsOptions from './resolveElementsOptions';
import resolveMethodsOptions from './resolveMethodsOptions';

function defineComponent<T extends Ornata.ComponentInternalInstance>(
    options: Ornata.ComponentOptions<T>
): Ornata.ComponentConstructor<T> {
    const {
        name: displayName = 'UnnamedComponent',
        root: rootOptions = {},
        state: stateOptions = {} as Ornata.ComponentOption<T, 'state'>,
        elements: elementsOptions = {} as Ornata.ComponentOption<T, 'elements'>,
        lifecycle: lifecycleOptions = {} as Ornata.ComponentOption<
            T,
            'lifecycle'
        >,
        methods: methodsOptions = {} as Ornata.ComponentOption<T, 'methods'>,
        data: dataOptions = {} as Ornata.ComponentOption<T, 'data'>,
        // watch: watchOptions = {} as Ornata.ComponentOption<T, 'watch'>,
    } = options;
    const externalInstances = new WeakMap<
        Element,
        Ornata.ComponentInstance<T>
    >();
    const internalInstances = new WeakMap<
        Ornata.ComponentInstance<T>,
        Ornata.ComponentInternalInstance
    >();

    return class Component implements Ornata.ComponentInstance<T> {
        readonly $$typeof: Ornata.ComponentInstance<T>['$$typeof'];

        readonly $root: Ornata.ComponentInstance<T>['$root'];

        $state: Ornata.ComponentInstance<T>['$state'];

        static readonly displayName: Ornata.ComponentConstructor<T>['displayName'] =
            displayName;

        constructor(root: Element, initialState?: Partial<T['state']>) {
            resolveRootOptions(displayName, root, rootOptions);

            const internalInstance = {} as T;

            const state = resolveStateOptions(
                displayName,
                root,
                initialState || {},
                stateOptions
            );

            const elements = resolveElementsOptions(
                displayName,
                root,
                elementsOptions
            );

            const methods = resolveMethodsOptions(
                internalInstance,
                methodsOptions
            );

            const internalState = new Proxy(state, {
                get(target, property) {
                    return target[property];
                },
                set(target, property, value) {
                    // Run render methods
                    // Run watchers
                    // Run state listeners
                    target[property] = value;

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

            internalInstance.root = root;
            internalInstance.state = internalState;
            internalInstance.elements = elements;
            internalInstance.methods = methods;
            internalInstance.data = dataOptions;

            this.$$typeof = Symbol.for('ornata.component');
            this.$root = root;
            this.$state = externalState;

            internalInstances.set(this, internalInstance);

            lifecycleOptions.setup?.call(internalInstance);

            if (stateOptions) {
                validateState(displayName, this.$state, stateOptions);
            }

            externalInstances.set(root, this);
        }

        dispose: Ornata.ComponentInstance<T>['dispose'] = () => {
            const internalInstance = internalInstances.get(this);
            lifecycleOptions.teardown?.call(internalInstance);
            externalInstances.delete(this.$root);
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
            (elementOrSelector, initialState) => {
                const root = getRootElement<T['root']>(
                    displayName,
                    elementOrSelector,
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
            elementOrSelector
        ) => {
            const root = getRootElement<T['root']>(
                displayName,
                elementOrSelector,
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
            (elementOrSelector) => {
                try {
                    return this.getInstance(elementOrSelector);
                } catch (error) {
                    return null;
                }
            };

        static deleteInstance: Ornata.ComponentConstructor<T>['deleteInstance'] =
            (elementOrSelector) => {
                const root = getRootElement<T['root']>(
                    displayName,
                    elementOrSelector,
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
    };
}

export default defineComponent;
