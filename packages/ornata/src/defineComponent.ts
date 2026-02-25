import type Ornata from './index';
import reporter from './reporter';
import describeElement from './describeElement';
import getRootElement from './getRootElement';
import resolveRootOptions from './resolveRootOptions';
import resolveStateOptions from './resolveStateOptions';
import validateState from './validateState';

function defineComponent<T extends Ornata.ComponentInternalInstance>(
    options: Ornata.ComponentOptions<T>
): Ornata.ComponentConstructor<T> {
    const {
        name: displayName = 'UnnamedComponent',
        root: rootOptions = {} as Ornata.ComponentRootOptions<T['$root']>,
        state: stateOptions = {} as Ornata.ComponentStateOptions<T['$state']>,
        elements: elementsOptions = {} as Ornata.ComponentElementOptions<
            T['$elements']
        >,
        hooks: hookOptions = {} as Ornata.ComponentHookOptions<T>,
    } = options;
    const instances = new WeakMap<Element, Ornata.ComponentInstance<T>>();

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

            this.$state = resolveStateOptions(
                displayName,
                root,
                initialState || {},
                stateOptions
            );

            hookOptions.setup?.call(this);

            if (stateOptions) {
                validateState(displayName, this.$state, stateOptions);
            }

            instances.set(root, this);
        }

        dispose: Ornata.ComponentInstance<T>['dispose'] = () => {
            hookOptions.teardown?.call(this);
            instances.delete(this.$root);
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

                if (instances.has(root)) {
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

            const instance = instances.get(root);

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

                const instance = instances.get(root);

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
