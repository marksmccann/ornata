import type Ornata from './index';
import reporter from './reporter';
import describeElement from './describeElement';
import getRootElement from './getRootElement';
import resolveRootOptions from './resolveRootOptions';
import resolveStateOptions from './resolveStateOptions';
import validateState from './validateState';
import resolveElementsOptions from './resolveElementsOptions';

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

        constructor(root: Element, initialState?: Partial<T['$state']>) {
            this.$$typeof = Symbol.for('ornata.component');
            this.$root = root;

            resolveRootOptions(displayName, root, rootOptions);

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

            internalInstances.set(this, {
                $root: root,
                $state: state,
                $elements: elements,
                $methods: {},
            });

            lifecycleOptions.setup?.call(this);

            if (stateOptions) {
                validateState(displayName, this.$state, stateOptions);
            }

            externalInstances.set(root, this);
        }

        dispose: Ornata.ComponentInstance<T>['dispose'] = () => {
            lifecycleOptions.teardown?.call(this);
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
                const root = getRootElement<T['$root']>(
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
            const root = getRootElement<T['$root']>(
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
                const root = getRootElement<T['$root']>(
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
