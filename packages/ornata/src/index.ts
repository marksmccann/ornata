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

    export type ComponentData = Record<string, any>;

    export interface ComponentInternalInstance {
        root: Element;
        state: ComponentState;
        elements: ComponentElements;
        methods: ComponentMethods;
        data: ComponentData;
    }

    // ------------------------------------------------------------

    /**
     * The configuration options for the root element for the `defineComponent` function.
     * @since v0.1.0
     */
    export interface ComponentRootOptions<T extends ComponentInternalInstance> {
        /**
         * Inform the user when the root element they supplied to the constructor
         * does not match the expected type via a CSS selector.
         * @since v0.1.0
         */
        matches?: string;
    }

    /**
     * The configuration options for the state properties for the `defineComponent` function.
     * @since v0.1.0
     */
    export interface ComponentStateOptions<
        T extends ComponentInternalInstance,
        K extends keyof T['state'],
    > {
        // controls?: T extends (...args: any[]) => any
        //     ? boolean | undefined
        //     : never;

        /**
         * The default value to use for the state property if no value is provided.
         * @since v0.1.0
         */
        default?: T['state'][K];

        /**
         * The expected type of the state property. Used to validate the type of the
         * state property. Supported values include: `String`, `Number`, `Boolean`,
         * `Array`, `Object`, and `Function`.
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
         * A function to parse the value from the HTML. Useful for parsing more complex values
         * that cannot be inferred from the `type` or `default` options.
         * @since v0.1.0
         */
        parse?: (value: string) => T['state'][K];

        /**
         * Whether the state property is private. If `true`, the state property will
         * not be accessible from external instances of the component.
         * @since v0.1.0
         */
        private?: boolean;

        /**
         * Whether the state property is readonly. If `true`, the state property will
         * not be writable from external instances of the component.
         * @since v0.1.0
         */
        readonly?: boolean;
    }

    /**
     * The configuration options for the elements properties for the `defineComponent` function.
     * @since v0.1.0
     */
    export interface ComponentElementOptions<
        T extends ComponentInternalInstance,
        K extends keyof T['elements'],
    > {
        /**
         * A CSS selector to query all elements within the root element
         * that match the selector.
         * @since v0.1.0
         */
        queryAll?: string;

        /**
         * A CSS selector to query the first element within the root element
         * that matches the selector.
         * @since v0.1.0
         */
        query?: string;

        /**
         * The name of the HTML element to create.
         * @since v0.1.0
         */
        create?: keyof HTMLElementTagNameMap;

        /**
         * Manually resolve the element. Must return an element or an array of elements.
         * @since v0.1.0
         */
        resolve?: (root: T['root']) => T['elements'][K];

        /**
         * The minimum number of elements that must be found. When provided, the component will log an
         * error if the number of elements it resolves to is less than the minimum number of elements.
         * @since v0.1.0
         */
        min?: number;

        /**
         * The maximum number of elements that can be found. When provided, the component will log an
         * error if the number of elements it resolves to is greater than the maximum number of elements.
         * @since v0.1.0
         */
        max?: number;
    }

    /**
     * The callback function for the watch property for the `defineComponent` function.
     * @since v0.1.0
     */
    export type ComponentWatchCallback<
        T extends ComponentInternalInstance,
        K extends keyof T['state'],
    > = (
        this: T,
        newValue: T['state'][K],
        oldValue: T['state'][K],
        initial: boolean
    ) => void;

    /**
     * A helper type to get the non-nullable options for the component.
     * @since v0.1.0
     */
    export type ComponentOption<
        T extends ComponentInternalInstance,
        K extends keyof ComponentOptions<T>,
    > = NonNullable<ComponentOptions<T>[K]>;

    /**
     * The configuration options for the component.
     * @since v0.1.0
     */
    export interface ComponentOptions<T extends ComponentInternalInstance> {
        /**
         * Configure the display name of the component. Defaults to `UnnamedComponent`.
         * @since v0.1.0
         */
        name?: string;

        /**
         * Configure the settings for the root element of the component.
         * @since v0.1.0
         */
        root?: ComponentRootOptions<T>;

        /**
         * Name and configure the state properties of the component.
         * @since v0.1.0
         */
        state?: {
            [K in keyof T['state']]: ComponentStateOptions<T, K>;
        };

        /**
         * Name and configure the DOM elements of the component.
         * @since v0.1.0
         */
        elements?: {
            [K in keyof T['elements']]: ComponentElementOptions<T, K>;
        };

        /**
         * The lifecycle methods for the component.
         * @since v0.1.0
         */
        lifecycle?: {
            setup?: (this: T) => void;
            teardown?: (this: T) => void;
        };

        /**
         * Respond to value changes in the state properties. Each callback function is called with the
         * new value, the previous value, and a convenient flag indicating whether the callback is being
         * called for the first time (during initialization).
         * @since v0.1.0
         */
        watch?: {
            [K in keyof T['state']]: ComponentWatchCallback<T, K>;
        };

        /**
         * Define internal and custom methods for the component.
         * @since v0.1.0
         */
        methods?: {
            [K in keyof T['methods']]: T['methods'][K];
        };

        /**
         * Define internal and custom data for the component.
         * @since v0.1.0
         */
        data?: {
            [K in keyof T['data']]: T['data'][K];
        };

        // computed?: any;
        // render?: any;
    }

    // ------------------------------------------------------------

    export type ComponentStateListener<T> = (
        value: T,
        previousValue: T
    ) => void;

    export interface ComponentInstance<T extends ComponentInternalInstance> {
        $$typeof: Symbol;

        $root: T['root'];

        $state: T['state'];

        dispose(this: ComponentInstance<T>): void;

        addStateListener<U extends keyof T['state']>(
            property: U | U[],
            listener: ComponentStateListener<T['state'][U]>
        ): void;

        removeStateListener<U extends keyof T['state']>(
            property: U | U[],
            listener: ComponentStateListener<T['state'][U]>
        ): void;
    }

    export interface ComponentConstructor<T extends ComponentInternalInstance> {
        new (
            root: Element,
            initialState?: Partial<T['state']>
        ): ComponentInstance<T>;

        displayName: string;

        createInstance(
            elementOrQuery: string | Element | null | undefined,
            initialState?: Partial<T['state']>
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
