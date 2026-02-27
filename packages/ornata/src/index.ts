import defineComponent from './defineComponent';

/**
 * Ornata - a progressive enhancement framework for server-rendered websites
 */

interface Ornata {
    defineComponent: typeof defineComponent;
}

namespace Ornata {
    /**
     * The state of the component.
     * @since v0.1.0
     */
    export type ComponentState = Record<string, any>;

    /**
     * An individual element or an array of elements for a component.
     * @since v0.1.0
     */
    export type ComponentElement = Element | null | Element[];

    /**
     * The elements of the component.
     * @since v0.1.0
     */
    export type ComponentElements = Record<string, ComponentElement>;

    /**
     * An individual method for a component.
     * @since v0.1.0
     */
    export type ComponentMethod = (...args: any[]) => any;

    /**
     * The methods of the component.
     * @since v0.1.0
     */
    export type ComponentMethods = Record<string, ComponentMethod>;

    /**
     * The user-defined data of the component.
     * @since v0.1.0
     */
    export type ComponentData = Record<string, any>;

    /**
     * The internal instance of the component.
     * @since v0.1.0
     */
    export interface ComponentInternalInstance {
        root: Element;
        state: ComponentState;
        elements: ComponentElements;
        methods: ComponentMethods;
        data: ComponentData;
    }

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
         * @parameter value The value to parse.
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
     * @parameter newValue The new value of the state property.
     * @parameter oldValue The previous value of the state property.
     * @parameter initial Whether the callback is being called for the first time (during initialization).
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
     * The configuration options for the render method for the `defineComponent` function.
     * @since v0.1.0
     */
    export interface ComponentRenderOptions {
        /**
         * The style properties to set on the element.
         * @since v0.1.0
         */
        style?: Record<string, string>;

        /**
         * The classes to apply to the element. Set to `true` to add the class, `false` to remove it
         * @since v0.1.0
         */
        classes?: Record<string, boolean>;

        /**
         * The attributes to set on the element. The type of value determines the DOM action to perform:
         * - **string**: Sets value directly (e.g., `setAttribute(name, value)`)
         * - **number**: Converts and sets value (e.g., `setAttribute(name, String(value))`)
         * - **true**: Adds a boolean attribute (e.g., `setAttribute(name, '')`)
         * - **false**: Removes a boolean attribute (e.g., `removeAttribute(name)`)
         * - **null**: Removes the attribute (e.g., `removeAttribute(name)`)
         * - **undefined**: Ignores the change (no-op)
         * @since v0.1.0
         */
        attributes?: Record<
            string,
            string | number | boolean | null | undefined
        >;

        /**
         * The dataset properties to set on the element.
         * @since v0.1.0
         */
        dataset?: Record<string, string>;

        /**
         * The events to attach to the element.
         * @since v0.1.0
         */
        events?: Partial<{
            [K in keyof HTMLElementEventMap]: (
                event: HTMLElementEventMap[K]
            ) => void;
        }>;

        /**
         * Sets the `innerHTML` of elements directly.
         * @since v0.1.0
         */
        html?: string;

        /**
         * Sets the `textContent` of the element directly.
         * @since v0.1.0
         */
        text?: string;
    }

    /**
     * The callback function for the render method for the `defineComponent` function.
     * @parameter index The index of the element in the array of elements (only available for element arrays)
     * @returns The options for the render method.
     * @since v0.1.0
     */
    export type ComponentRenderCallback<
        T extends ComponentInternalInstance,
        K extends keyof T['elements'],
    > = (
        this: T,
        index: T['elements'][K] extends Element[] ? number : never
    ) => ComponentRenderOptions;

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

        /**
         * The render method for the elements of the component.
         * @since v0.1.0
         */
        render?: {
            [K in keyof T['elements']]: ComponentRenderCallback<T, K>;
        };
    }

    /**
     * The callback function for the state listener for the `defineComponent` function.
     * @parameter value The new value of the state property.
     * @parameter previousValue The previous value of the state property.
     * @since v0.1.0
     */
    export type ComponentStateListener<T> = (
        value: T,
        previousValue: T
    ) => void;

    /**
     * The instance of the component. The primary interface for interacting with the component externally.
     * @since v0.1.0
     */
    export interface ComponentInstance<T extends ComponentInternalInstance> {
        $$typeof: Symbol;

        /**
         * The resolved root element of the component that was passed to the constructor.
         * @since v0.1.0
         */
        $root: T['root'];

        /**
         * The resolved and current state of the component. This object is reactive; it will
         * automatically update the component when any of the properties are updated.
         * @since v0.1.0
         */
        $state: T['state'];

        /**
         * Dispose of the component instance. This will clean up any and all
         * resources associated with the component.
         * @since v0.1.0
         */
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

    /**
     * The constructor for the component. This is the object that is returned when the component is defined.
     * @since v0.1.0
     */
    export interface ComponentConstructor<T extends ComponentInternalInstance> {
        /**
         * Create a new instance of the component.
         * _Note: This method is typically not called directly by users. Instead, it is called by the `createInstance` method._
         * @parameter root The root element of the instance to create. Can be a CSS selector or the element itself.
         * @parameter initialState The initial state of the component.
         * @returns The instance of the component.
         * @since v0.1.0
         */
        new (
            root: Element,
            initialState?: Partial<T['state']>
        ): ComponentInstance<T>;

        /**
         * The display name of the component; used primarily for debugging and error reporting.
         * @since v0.1.0
         */
        displayName: string;

        /**
         * Create a new instance of the component.
         * @parameter elementOrQuery The element or query to create the instance from.
         * @parameter initialState The initial state of the component.
         * @returns The instance of the component.
         * @since v0.1.0
         */
        createInstance(
            elementOrQuery: string | Element | null | undefined,
            initialState?: Partial<T['state']>
        ): ComponentInstance<T>;

        /**
         * Delete an instance of the component; calls instance.dispose().
         * @parameter instanceRoot A reference to the root element of the instance to delete. Can be a CSS selector or the element itself.
         * @since v0.1.0
         */
        deleteInstance(instanceRoot: string | Element | null | undefined): void;

        /**
         * Retrieves an instance of the component. Will throw an error if the instance does not exist.
         * @param instanceRoot A reference to the root element of the instance to get. Can be a CSS selector or the element itself.
         * @returns The instance of the component.
         * @since v0.1.0
         */
        getInstance(
            instanceRoot: string | Element | null | undefined
        ): ComponentInstance<T>;

        /**
         * Retrieves an instance of the component. Will return `null` if the instance does not exist.
         * @param instanceRoot A reference to the root element of the instance to get. Can be a CSS selector or the element itself.
         * @returns The instance of the component or `null` if the instance does not exist.
         * @since v0.1.0
         */
        queryInstance(
            instanceRoot: string | Element | null | undefined
        ): ComponentInstance<T> | null;

        /**
         * Updates an instance of the component.
         * @param instanceRoot A reference to the root element of the instance to update. Can be a CSS selector or the element itself.
         * @param stateChanges The state changes to apply to the instance.
         * @since v0.1.0
         */
        updateInstance(
            instanceRoot: string | Element | null | undefined,
            stateChanges: Partial<T['state']>
        ): void;
    }
}

export { defineComponent };

export default Ornata;
