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
         */
        matches?: string;
    }

    export interface ComponentStateOption<T> {
        defaultValue?: T;
        controls?: T extends (...args: any[]) => any
            ? boolean | undefined
            : never;
        // type: BooleanConstructor | NumberConstructor | StringConstructor | ObjectConstructor | ArrayConstructor;
    }

    export type ComponentStateOptions<T extends ComponentState> = {
        [K in keyof T]: ComponentStateOption<T[K]>;
    };

    export interface ComponentElementOption<T extends ComponentElement> {}

    export type ComponentElementOptions<T extends ComponentElements> = {
        [K in keyof T]: ComponentElementOption<T[K]>;
    };

    export interface ComponentOptions<T extends ComponentInternalInstance> {
        name?: string;
        root?: ComponentRootOptions<T['$root']>;
        state?: ComponentStateOptions<T['$state']>;
        elements?: ComponentElementOptions<T['$elements']>;
        // hooks: any;
        // watch: any;
        // computed: any;
        // methods: any;
        // render: any;
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

        dispose(): void;

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
