import type Ornata from './index';
import reporter from './reporter';
import describeElement from './describeElement';
import getRootElement from './getRootElement';

function defineComponent<T extends Ornata.ComponentInternalInstance>(
    options: Ornata.ComponentOptions<T>
): Ornata.ComponentConstructor<T> {
    const {
        name: displayName = 'UnnamedComponent',
        root: rootOptions = {} as Ornata.ComponentRootOptions<T['$root']>,
        state: stateOptions,
        elements: elementsOptions,
    } = options;
    const instances = new WeakMap<Element, Ornata.ComponentInstance<T>>();

    return class Component implements Ornata.ComponentInstance<T> {
        $$typeof: Ornata.ComponentInstance<T>['$$typeof'];

        $root: Ornata.ComponentInstance<T>['$root'];

        $state: Ornata.ComponentInstance<T>['$state'];

        static displayName: Ornata.ComponentConstructor<T>['displayName'] =
            displayName;

        constructor(root: Element, initialState?: Partial<T['$state']>) {
            this.$$typeof = Symbol.for('ornata.component');
            this.$root = root;

            if (rootOptions) {
                const { matches } = rootOptions;

                if (matches && !root.matches(matches)) {
                    reporter.error('ERR05', {
                        componentName: displayName,
                        selector: matches,
                    });
                }
            }

            // console.log(this.$root);

            instances.set(root, this);
        }

        dispose: Ornata.ComponentInstance<T>['dispose'] = () => {
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
