import defineComponent from './defineComponent';

/**
 * Ornata - a progressive enhancement framework for server-rendered websites
 */

interface Ornata {
    defineComponent: typeof defineComponent;
}

namespace Ornata {
    export type ComponentState = Record<string, any>;

    export type ComponentElement = Element | null | Element[];

    export type ComponentElements = Record<string, ComponentElement>;

    export type ComponentMethod = (...args: any[]) => any;

    export type ComponentMethods = Record<string, ComponentMethod>;

    export interface ComponentInternalInstance {
        $root: Element;
        $state: ComponentState;
        $elements: ComponentElements;
        $methods: ComponentMethods;
    }

    // ------------------------------------------------------------

    export interface ComponentRootOptions<T extends Element> {
        /**
         * Inform the user when the root element they supplied to the constructor
         * does not match the expected type via a CSS selector.
         * @since v0.1.0
         */
        matches?: string;
    }

    export interface ComponentStateOption<T> {
        // controls?: T extends (...args: any[]) => any
        //     ? boolean | undefined
        //     : never;

        /**
         * The default value to use for the state property if no value is provided.
         * @since v0.1.0
         */
        defaultValue?: T;

        /**
         * The expected type of the state property. Used to validate
         * the type of the state property. Supported values include:
         * `String`, `Number`, `Boolean`, `Array`, `Object`, and `Function`.
         * @since v0.1.0
         */
        type?:
            | StringConstructor
            | NumberConstructor
            | BooleanConstructor
            | ArrayConstructor
            | ObjectConstructor
            | FunctionConstructor;

        /**
         * A function to parse the value from the HTML. Used to parse the value
         * from the HTML if no `defaultValue` is provided.
         * @since v0.1.0
         */
        parse?: (value: string) => T;
    }

    export type ComponentStateOptions<T extends ComponentState> = {
        [K in keyof T]: ComponentStateOption<T[K]>;
    };

    export interface ComponentElementOption<T extends ComponentElement> {}

    export type ComponentElementOptions<T extends ComponentElements> = {
        [K in keyof T]: ComponentElementOption<T[K]>;
    };

    export interface ComponentHookOptions<T extends ComponentInternalInstance> {
        setup?: (this: ComponentInstance<T>) => void;
        teardown?: (this: ComponentInstance<T>) => void;
        update?: (
            this: ComponentInstance<T>,
            property: keyof T['$state'],
            value: T['$state'][keyof T['$state']]
        ) => void;
    }

    export interface ComponentOptions<T extends ComponentInternalInstance> {
        name?: string;
        root?: ComponentRootOptions<T['$root']>;
        state?: ComponentStateOptions<T['$state']>;
        elements?: ComponentElementOptions<T['$elements']>;
        hooks?: ComponentHookOptions<T>;
        // watch?: any;
        // computed?: any;
        // methods?: any;
        // render?: any;
    }

    // ------------------------------------------------------------

    export type ComponentStateListener<T> = (
        value: T,
        previousValue: T
    ) => void;

    export interface ComponentInstance<T extends ComponentInternalInstance> {
        $$typeof: Symbol;

        $root: T['$root'];

        $state: T['$state'];

        dispose(this: ComponentInstance<T>): void;

        addStateListener<U extends keyof T['$state']>(
            property: U | U[],
            listener: ComponentStateListener<T['$state'][U]>
        ): void;

        removeStateListener<U extends keyof T['$state']>(
            property: U | U[],
            listener: ComponentStateListener<T['$state'][U]>
        ): void;
    }

    export interface ComponentConstructor<T extends ComponentInternalInstance> {
        new (
            root: Element,
            initialState?: Partial<T['$state']>
        ): ComponentInstance<T>;

        displayName: string;

        createInstance(
            elementOrQuery: string | Element | null | undefined,
            initialState?: Partial<T['$state']>
        ): ComponentInstance<T>;

        deleteInstance(
            elementOrQuery: string | Element | null | undefined
        ): void;

        getInstance(
            elementOrQuery: string | Element | null | undefined
        ): ComponentInstance<T>;

        queryInstance(
            elementOrQuery: string | Element | null | undefined
        ): ComponentInstance<T> | null;
    }
}

export { defineComponent };

export default Ornata;
