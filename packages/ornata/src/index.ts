import defineComponent from './defineComponent';
import isComponent from './isComponent';
import createInitializer from './createInitializer';

interface Ornata {
    defineComponent: typeof defineComponent;
    isComponent: typeof isComponent;
    createInitializer: typeof createInitializer;
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
     * The computed data of the component.
     * @since v0.1.0
     */
    export type ComponentComputed = Record<string, any>;

    /**
     * The internal instance of the component.
     * @since v0.1.0
     */
    export interface InternalInstance {
        root: Element;
        state: object;
        elements: object;
        methods: object;
        data: object;
        computed: object;
    }

    /**
     * The configuration options for the root element for the `defineComponent` function.
     * @since v0.1.0
     */
    export interface RootOptions<T extends InternalInstance> {
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
    export interface StateOptions<
        T extends InternalInstance,
        K extends keyof T['state'],
    > {
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
    export interface ElementOptions<
        T extends InternalInstance,
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
     * Context passed to watch callbacks.
     * @since v0.2.0
     */
    export interface WatchContext<
        TState extends object,
        K extends keyof TState,
    > {
        /**
         * Identifies the framework callback context.
         */
        type: 'watch';

        /**
         * The latest value for the watched state property.
         */
        newValue: TState[K];

        /**
         * The previous value for the watched state property.
         */
        oldValue: TState[K];

        /**
         * Whether this is the initialization-time watch invocation.
         */
        isInitial: boolean;
    }

    /**
     * Context passed to computed callbacks.
     * @since v0.2.0
     */
    export interface ComputedContext<TState extends object, TValue> {
        /**
         * Identifies the framework callback context.
         */
        type: 'computed';

        /**
         * The current computed value before recomputation.
         */
        currentValue: TValue;

        /**
         * The state property that triggered this recomputation.
         */
        changedProperty: keyof TState;
    }

    /**
     * Context passed to render callbacks.
     * @since v0.2.0
     */
    export interface RenderContext<TElement = ComponentElement> {
        /**
         * Identifies the framework callback context.
         */
        type: 'render';

        /**
         * The index of the current element when rendering an element array.
         */
        index?: number;
    }

    /**
     * The callback function for the watch property for the `defineComponent` function.
     * @since v0.1.0
     */
    export type WatchCallback<
        T extends InternalInstance,
        K extends keyof T['state'],
    > = (this: T, context: WatchContext<T['state'], K>) => void;

    /**
     * The callback function for the computed property for the `defineComponent` function.
     * @since v0.1.0
     */
    export type ComputedCallback<
        T extends InternalInstance,
        K extends keyof T['computed'],
    > = (
        this: T,
        context: ComputedContext<T['state'], T['computed'][K]>
    ) => T['computed'][K];

    /**
     * The configuration options for the render method for the `defineComponent` function.
     * @since v0.1.0
     */
    export interface RenderOptions {
        /**
         * The style properties to set on the element. The type of value determines the DOM action to perform:
         * - **string**: Sets value directly (e.g., `style.setProperty(property, value)`)
         * - **null**: Removes the property (e.g., `style.removeProperty(property)`)
         * - **undefined**: Ignores the change (no-op)
         * @since v0.1.0
         */
        style?: Record<string, string | null | undefined>;

        /**
         * The classes to apply to the element. Set to `true` to add the class, `false` to remove it
         * @since v0.1.0
         */
        classes?: Record<string, boolean>;

        /**
         * The attributes to set on the element. The type of value determines the DOM action to perform:
         * - **string**: Sets value directly (e.g., `setAttribute(name, value)`)
         * - **true**: Adds a boolean attribute (e.g., `setAttribute(name, '')`)
         * - **false**: Removes a boolean attribute (e.g., `removeAttribute(name)`)
         * - **null**: Removes the attribute (e.g., `removeAttribute(name)`)
         * - **undefined**: Ignores the change (no-op)
         * @since v0.1.0
         */
        attributes?: Record<string, string | boolean | null | undefined>;

        /**
         * The dataset properties to set on the element. The type of value determines the DOM action to perform:
         * - **string**: Sets value directly (e.g., `dataset.setProperty(property, value)`)
         * - **null**: Removes the property (e.g., `dataset.removeProperty(property)`)
         * - **undefined**: Ignores the change (no-op)
         * @since v0.1.0
         */
        dataset?: Record<string, string | null | undefined>;

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
     * @since v0.1.0
     */
    export type RenderCallback<
        T extends InternalInstance,
        K extends keyof T['elements'],
    > = (this: T, context: RenderContext<T['elements'][K]>) => RenderOptions;

    /**
     * The callback function for a method defined on the component.
     * @since v0.2.0
     */
    export type MethodDefinition<
        T extends InternalInstance,
        TMethod,
    > = TMethod extends (...args: infer TArgs) => infer TReturn
        ? (this: T, ...args: TArgs) => TReturn
        : never;

    /**
     * The configuration options for the component.
     * @since v0.1.0
     */
    export interface ComponentOptions<T extends InternalInstance> {
        /**
         * Configure the display name of the component. Defaults to `UnnamedComponent`.
         * @since v0.1.0
         */
        name?: string;

        /**
         * Configure the settings for the root element of the component.
         * @since v0.1.0
         */
        root?: RootOptions<T>;

        /**
         * Name and configure the state properties of the component.
         * @since v0.1.0
         */
        state?: {
            [K in keyof T['state']]: StateOptions<T, K>;
        };

        /**
         * Name and configure the DOM elements of the component.
         * @since v0.1.0
         */
        elements?: {
            [K in keyof T['elements']]: ElementOptions<T, K>;
        };

        /**
         * The lifecycle methods for the component.
         * @since v0.1.0
         */
        lifecycle?: {
            /**
             * A function that is called once when the component is mounted; useful for performing activation logic.
             * @since v0.1.0
             */
            mount?: (this: T) => void;

            /**
             * A function that is called once when the component is unmounted; useful for performing cleanup logic.
             * @since v0.1.0
             */
            unmount?: (this: T) => void;
        };

        /**
         * Respond to value changes in the state properties with framework-provided watch context.
         * @since v0.1.0
         */
        watch?: {
            [K in keyof T['state']]: WatchCallback<T, K>;
        };

        /**
         * Define internal and custom methods for the component.
         * @since v0.1.0
         */
        methods?: {
            [K in keyof T['methods']]: MethodDefinition<T, T['methods'][K]>;
        };

        /**
         * Define internal and custom computed properties for the component.
         * @since v0.1.0
         */
        computed?: {
            [K in keyof T['computed']]: ComputedCallback<T, K>;
        };

        /**
         * Define internal and custom data for the component.
         * @since v0.1.0
         */
        data?: {
            [K in keyof T['data']]: T['data'][K];
        };

        /**
         * The render method for the elements of the component.
         * @since v0.1.0
         */
        render?: {
            [K in keyof T['elements']]: RenderCallback<T, K>;
        };
    }

    /**
     * Event payload passed to state listeners.
     * @since v0.2.0
     */
    export interface StateListenerEvent<
        TValue,
        TProperty extends PropertyKey = string,
        TTarget = unknown,
    > {
        /**
         * The state property that changed.
         */
        property: TProperty;

        /**
         * The new value of the state property.
         */
        newValue: TValue;

        /**
         * The previous value of the state property.
         */
        oldValue: TValue;

        /**
         * The component instance that emitted the change.
         */
        target: TTarget;
    }

    /**
     * The callback function for the state listener for the `defineComponent` function.
     * @since v0.1.0
     */
    export type StateListener<
        TValue,
        TProperty extends PropertyKey = string,
        TTarget = unknown,
    > = (event: StateListenerEvent<TValue, TProperty, TTarget>) => void;

    /**
     * Cleanup function returned by `addStateListener`.
     * @since v0.2.0
     */
    export type StateListenerCleanup = () => void;

    /**
     * The instance of the component. The primary interface for interacting with the component externally.
     * @since v0.1.0
     */
    export interface ComponentInstance<T extends InternalInstance> {
        /**
         * The resolved root element of the component that was passed to the constructor.
         * @since v0.1.0
         */
        root: T['root'];

        /**
         * The resolved and current state of the component. This object is reactive; it will
         * automatically update the component when any of the properties are updated.
         * @since v0.1.0
         */
        state: T['state'];

        /**
         * Dispose of the component instance. This will clean up any and all
         * resources associated with the component.
         * @since v0.1.0
         */
        dispose(this: ComponentInstance<T>): void;

        /**
         * Add a state listener to the component; a function that is called when the state property is updated.
         * @param this The component instance.
         * @param property The property to add the state listener to.
         * @param listener The callback function to call when the state property is updated.
         * @returns A cleanup function that removes the state listener.
         * @since v0.1.0
         */
        addStateListener<U extends keyof T['state']>(
            this: ComponentInstance<T>,
            property: U,
            listener: StateListener<T['state'][U], U, ComponentInstance<T>>
        ): StateListenerCleanup;
    }

    /**
     * The constructor for the component. This is the object that is returned when the component is defined.
     * @since v0.1.0
     */
    export interface ComponentConstructor<T extends InternalInstance> {
        /**
         * The symbol that is used to identify the component constructor.
         * @since v0.1.0
         */
        readonly $$typeof: Symbol;

        /**
         * Create a new instance of the component.
         * _Note: Use the `mount` method instead of the constructor directly to create an instance of the component._
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
        readonly displayName: string;

        /**
         * Mount a new instance of the component.
         * @parameter elementOrQuery The element or query to mount the instance on.
         * @parameter initialState The initial state of the component.
         * @returns The instance of the component.
         * @since v0.3.0
         */
        mount(
            elementOrQuery: string | Element | null | undefined,
            initialState?: Partial<T['state']>
        ): ComponentInstance<T>;

        /**
         * Retrieves an instance of the component. Will throw an error if the instance does not exist.
         * @param instanceRoot A reference to the root element of the instance to get. Can be a CSS selector or the element itself.
         * @returns The instance of the component.
         * @since v0.3.0
         */
        getInstance(
            instanceRoot: string | Element | null | undefined
        ): ComponentInstance<T>;

        /**
         * Retrieves an instance of the component. Will return `null` if the instance does not exist.
         * @param instanceRoot A reference to the root element of the instance to get. Can be a CSS selector or the element itself.
         * @returns The instance of the component or `null` if the instance does not exist.
         * @since v0.3.0
         */
        findInstance(
            instanceRoot: string | Element | null | undefined
        ): ComponentInstance<T> | null;

        /**
         * Unmount an instance of the component; calls instance.dispose().
         * @parameter instanceRoot A reference to the root element of the instance to unmount. Can be a CSS selector or the element itself.
         * @since v0.3.0
         */
        unmount(instanceRoot: string | Element | null | undefined): void;
    }

    /**
     * Infers the public instance type from a component constructor.
     * @since v0.2.0
     */
    export type InferComponentInstance<
        T extends ComponentConstructor<InternalInstance>,
    > = T extends ComponentConstructor<infer U> ? ComponentInstance<U> : never;

    /**
     * The optional typed parts of a component definition.
     * @since v0.2.0
     */
    export interface ComponentParts {
        root?: Element;
        state?: object;
        elements?: object;
        methods?: object;
        data?: object;
        computed?: object;
    }

    /**
     * Builds a fully-typed internal instance shape from the typed parts of a component definition.
     * @since v0.2.0
     */
    export type NormalizeComponentParts<T extends ComponentParts> = {
        root: 'root' extends keyof T ? NonNullable<T['root']> : Element;
        state: 'state' extends keyof T ? NonNullable<T['state']> : {};
        elements: 'elements' extends keyof T ? NonNullable<T['elements']> : {};
        methods: 'methods' extends keyof T ? NonNullable<T['methods']> : {};
        data: 'data' extends keyof T ? NonNullable<T['data']> : {};
        computed: 'computed' extends keyof T ? NonNullable<T['computed']> : {};
    };
}

/**
 * A progressive enhancement framework for server-rendered websites
 */
const Ornata: Ornata = {
    defineComponent,
    isComponent,
    createInitializer,
};

export { defineComponent, isComponent, createInitializer };

export default Ornata;
