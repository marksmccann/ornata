// @vitest-environment jsdom

import type Ornata from './index.js';
import { describe, it, expect, expectTypeOf, vi } from 'vitest';
import { defineComponent } from './index.js';
import reporter from './reporter.js';
import describeElement from './describeElement.js';
import { ORNATA_COMPONENT_CONSTRUCTOR } from './symbols.js';

describe('defineComponent', () => {
    it('should create component constructor', () => {
        const Test = defineComponent({ name: 'Test' });

        expect(Test.displayName).toStrictEqual('Test');
        expect(Test.$$typeof).toStrictEqual(ORNATA_COMPONENT_CONSTRUCTOR);
    });

    it('should create component instance', () => {
        const Test = defineComponent({ name: 'Test' });
        const root = document.createElement('div');
        const instance = Test.mount(root);

        expect(instance).toBeInstanceOf(Test);
        expect(instance.root).toStrictEqual(root);
        expect(instance.state).toEqual({});
        expect(instance.addStateListener).toBeInstanceOf(Function);

        instance.dispose();
    });

    it('should infer typed state for mount and instance.state', () => {
        const Test = defineComponent({
            name: 'Test',
            state: {
                count: {
                    default: 0,
                },
                label: {
                    default: '',
                },
            },
        });

        const instance = Test.mount(document.createElement('div'), {
            count: 1,
            label: 'ready',
        });
        const elementOrQuery: string | Element | null | undefined =
            document.createElement('div');

        Test.mount(elementOrQuery, {
            count: 2,
        });

        Test.mount(document.createElement('div'), {
            // @ts-expect-error - count must be a number
            count: 'wrong',
        });

        Test.mount(document.createElement('div'), {
            // @ts-expect-error - label must be a string
            label: 123,
        });

        expectTypeOf(instance.state.count).toEqualTypeOf<number>();
        expectTypeOf(instance.state.label).toEqualTypeOf<string>();
        expectTypeOf(
            instance.addStateListener('count', () => undefined)
        ).toEqualTypeOf<Ornata.StateListenerCleanup>();
        instance.addStateListener('count', (event) => {
            expectTypeOf(event.property).toEqualTypeOf<'count'>();
            expectTypeOf(event.newValue).toEqualTypeOf<number>();
            expectTypeOf(event.oldValue).toEqualTypeOf<number>();
            expectTypeOf(event.target).toEqualTypeOf<typeof instance>();
        });

        instance.dispose();
    });

    it('should preserve explicit component parts typing on the returned constructor', () => {
        interface TestState {
            count: number;
        }

        const Test = defineComponent<{
            state: TestState;
        }>({
            name: 'Test',
            state: {
                count: {
                    default: 0,
                },
            },
        });
        const instance = Test.mount(document.createElement('div'), {
            count: 1,
        });

        expectTypeOf(Test).toEqualTypeOf<
            Ornata.ComponentConstructor<
                Ornata.NormalizeComponentParts<{
                    state: TestState;
                }>
            >
        >();
        expectTypeOf(instance.state.count).toEqualTypeOf<number>();

        instance.dispose();
    });

    it('should support sparse explicit component parts typing', () => {
        interface TestState {
            count: number;
        }

        interface TestMethods {
            increment(): void;
        }

        defineComponent<{
            state: TestState;
            methods: TestMethods;
        }>({
            name: 'Test',
            state: {
                count: {
                    default: 0,
                },
            },
            methods: {
                increment() {
                    expectTypeOf(this.state.count).toEqualTypeOf<number>();
                    expectTypeOf(this.methods.increment).toEqualTypeOf<
                        () => void
                    >();
                },
            },
        });
    });

    describe('instance methods', () => {
        it('should dispose instance', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            instance.dispose();

            expect(Test.findInstance(root)).toBeNull();
        });

        it('should return cleanup function from addStateListener', () => {
            const listener = vi.fn();
            const Test = defineComponent({
                name: 'Test',
                state: {
                    count: {
                        default: 0,
                    },
                },
            });
            const instance = Test.mount(document.createElement('div'));

            const cleanup = instance.addStateListener('count', listener);

            instance.state.count = 1;
            cleanup();
            instance.state.count = 2;

            expect(listener).toHaveBeenCalledOnce();
            expect(listener).toHaveBeenCalledWith({
                property: 'count',
                newValue: 1,
                oldValue: 0,
                target: instance,
            });

            instance.dispose();
        });

        it('should allow cleanup function to be called more than once', () => {
            const listener = vi.fn();
            const Test = defineComponent({
                name: 'Test',
                state: {
                    count: {
                        default: 0,
                    },
                },
            });
            const instance = Test.mount(document.createElement('div'));

            const cleanup = instance.addStateListener('count', listener);

            cleanup();
            cleanup();
            instance.state.count = 1;

            expect(listener).not.toHaveBeenCalled();

            instance.dispose();
        });
    });

    describe('lifecycle option', () => {
        it('should call mount when instance is created', () => {
            const onMount = vi.fn();
            const Test = defineComponent({
                name: 'Test',
                lifecycle: { mount: onMount },
            });
            const root = document.createElement('div');

            Test.mount(root);

            expect(onMount).toHaveBeenCalledOnce();

            Test.unmount(root);
        });

        it('should call unmount when instance is disposed', () => {
            const onUnmount = vi.fn();
            const Test = defineComponent({
                name: 'Test',
                lifecycle: { unmount: onUnmount },
            });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            expect(onUnmount).not.toHaveBeenCalled();

            instance.dispose();

            expect(onUnmount).toHaveBeenCalledOnce();
        });

        it('should call mount with the internal component instance as this', () => {
            let capturedThis = {} as Ornata.InternalInstance;
            const Test = defineComponent({
                name: 'Test',
                lifecycle: {
                    mount() {
                        capturedThis = this;
                    },
                },
            });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            expect(capturedThis.root).toBe(root);
            expect(capturedThis.state).toEqual({});
            expect(capturedThis.elements).toStrictEqual({});
            expect(capturedThis.methods).toStrictEqual({});
            expect(capturedThis.data).toStrictEqual({});

            instance.dispose();
        });

        it('should call unmount with the internal component instance as this', () => {
            let capturedThis = {} as Ornata.InternalInstance;
            const Test = defineComponent({
                name: 'Test',
                lifecycle: {
                    unmount() {
                        capturedThis = this;
                    },
                },
            });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            instance.dispose();

            expect(capturedThis.root).toBe(root);
            expect(capturedThis.state).toEqual({});
            expect(capturedThis.elements).toStrictEqual({});
            expect(capturedThis.methods).toStrictEqual({});
            expect(capturedThis.data).toStrictEqual({});
        });

        it('should give mount access to instance properties via this', () => {
            let capturedRoot: unknown;
            const root = document.createElement('div');
            const Test = defineComponent({
                name: 'Test',
                lifecycle: {
                    mount() {
                        capturedRoot = this.root;
                    },
                },
            });

            Test.mount(root);

            expect(capturedRoot).toBe(root);

            Test.unmount(root);
        });

        it('should not throw when mount is not provided', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');

            expect(() => Test.mount(root)).not.toThrow();

            Test.unmount(root);
        });

        it('should not throw when unmount is not provided', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            expect(() => instance.dispose()).not.toThrow();
        });
    });

    describe('watch option', () => {
        it('should call watch with context object and track initial invocation', () => {
            const watch = vi.fn();
            const Test = defineComponent({
                name: 'Test',
                state: {
                    count: {
                        default: 0,
                    },
                },
                watch: {
                    count(context) {
                        watch(context);
                    },
                },
            });
            const instance = Test.mount(document.createElement('div'));

            instance.state.count = 1;

            expect(watch).toHaveBeenNthCalledWith(1, {
                type: 'watch',
                newValue: 0,
                oldValue: 0,
                isInitial: true,
            });
            expect(watch).toHaveBeenNthCalledWith(2, {
                type: 'watch',
                newValue: 1,
                oldValue: 0,
                isInitial: false,
            });

            instance.dispose();
        });

        it('should infer typed watch context from explicit component parts', () => {
            interface TestState {
                count: number;
            }

            defineComponent<{
                state: TestState;
            }>({
                name: 'Test',
                state: {
                    count: {
                        default: 0,
                    },
                },
                watch: {
                    count(context) {
                        expectTypeOf(context.type).toEqualTypeOf<'watch'>();
                        expectTypeOf(context.newValue).toEqualTypeOf<number>();
                        expectTypeOf(context.oldValue).toEqualTypeOf<number>();
                        expectTypeOf(
                            context.isInitial
                        ).toEqualTypeOf<boolean>();
                    },
                },
            });
        });
    });

    describe('computed option', () => {
        it('should call computed with context object', () => {
            interface TestState {
                count: number;
            }

            interface TestComputed {
                total: number;
            }

            const computed = vi.fn(({ changedProperty }) => {
                return changedProperty === 'count' ? 1 : 0;
            });
            const Test = defineComponent<{
                state: TestState;
                computed: TestComputed;
            }>({
                name: 'Test',
                state: {
                    count: {
                        default: 0,
                    },
                },
                computed: {
                    total(context) {
                        return computed(context);
                    },
                },
            });
            const instance = Test.mount(document.createElement('div'));

            instance.state.count = 1;

            expect(computed).toHaveBeenNthCalledWith(1, {
                type: 'computed',
                currentValue: undefined,
                changedProperty: 'count',
            });
            expect(computed).toHaveBeenNthCalledWith(2, {
                type: 'computed',
                currentValue: 1,
                changedProperty: 'count',
            });

            instance.dispose();
        });

        it('should infer typed computed context from explicit component parts', () => {
            interface TestState {
                count: number;
            }

            interface TestComputed {
                total: number;
            }

            const Test = defineComponent<{
                state: TestState;
                computed: TestComputed;
            }>({
                name: 'Test',
                state: {
                    count: {
                        default: 0,
                    },
                },
                computed: {
                    total(context) {
                        expectTypeOf(context.type).toEqualTypeOf<'computed'>();
                        expectTypeOf(
                            context.currentValue
                        ).toEqualTypeOf<number>();
                        expectTypeOf(
                            context.changedProperty
                        ).toEqualTypeOf<'count'>();

                        return 0;
                    },
                },
            });

            expectTypeOf(Test).toEqualTypeOf<
                Ornata.ComponentConstructor<
                    Ornata.NormalizeComponentParts<{
                        state: TestState;
                        computed: TestComputed;
                    }>
                >
            >();
        });
    });

    describe('render option', () => {
        it('should call render with undefined index for single elements', () => {
            const render = vi.fn(
                (_context: Ornata.RenderContext<Element | null>) => ({
                    text: 'ready',
                })
            );
            const root = document.createElement('div');
            root.innerHTML = '<button></button>';
            const Test = defineComponent({
                name: 'Test',
                state: {
                    ready: {
                        default: true,
                    },
                },
                elements: {
                    button: {
                        query: 'button',
                    },
                },
                render: {
                    button(context) {
                        return render(context);
                    },
                },
            });

            const instance = Test.mount(root);

            expect(render).toHaveBeenCalledWith({
                type: 'render',
                index: undefined,
            });

            instance.dispose();
        });

        it('should call render with numeric index for element arrays', () => {
            const render = vi.fn(({ index }) => ({ text: String(index) }));
            const root = document.createElement('div');
            root.innerHTML = '<li></li><li></li>';
            const Test = defineComponent({
                name: 'Test',
                state: {
                    ready: {
                        default: true,
                    },
                },
                elements: {
                    items: {
                        queryAll: 'li',
                    },
                },
                render: {
                    items(context) {
                        return render(context);
                    },
                },
            });

            const instance = Test.mount(root);

            expect(render).toHaveBeenNthCalledWith(1, {
                type: 'render',
                index: 0,
            });
            expect(render).toHaveBeenNthCalledWith(2, {
                type: 'render',
                index: 1,
            });

            instance.dispose();
        });

        it('should infer typed render context from explicit component parts', () => {
            interface TestElements {
                button: Element | null;
                items: Element[];
            }

            defineComponent<{
                elements: TestElements;
            }>({
                name: 'Test',
                elements: {
                    button: {
                        query: 'button',
                    },
                    items: {
                        queryAll: 'li',
                    },
                },
                render: {
                    button(context) {
                        expectTypeOf(context.type).toEqualTypeOf<'render'>();
                        expectTypeOf(context.index).toEqualTypeOf<
                            number | undefined
                        >();

                        return {};
                    },
                    items(context) {
                        expectTypeOf(context.type).toEqualTypeOf<'render'>();
                        expectTypeOf(context.index).toEqualTypeOf<
                            number | undefined
                        >();

                        return {};
                    },
                },
            });
        });

        it('should infer typed this context from explicit component parts', () => {
            interface TestState {
                count: number;
            }

            interface TestData {
                step: number;
            }

            interface TestMethods {
                increment(): void;
            }

            defineComponent<{
                state: TestState;
                data: TestData;
                methods: TestMethods;
            }>({
                name: 'Test',
                state: {
                    count: {
                        default: 0,
                    },
                },
                data: {
                    step: 1,
                },
                methods: {
                    increment() {
                        expectTypeOf(this.state.count).toEqualTypeOf<number>();
                        expectTypeOf(this.data.step).toEqualTypeOf<number>();
                        expectTypeOf(this.methods.increment).toEqualTypeOf<
                            () => void
                        >();

                        return undefined;
                    },
                },
            });
        });
    });

    describe('state option: private', () => {
        it('should log error when reading a private state property externally', () => {
            const consoleError = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            const Test = defineComponent({
                name: 'Test',
                state: { secret: { private: true } },
            });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            void instance.state.secret;

            expect(consoleError).toHaveBeenCalledWith(
                reporter.message('ERR15', {
                    componentName: 'Test',
                    property: 'secret',
                })
            );

            consoleError.mockRestore();
            instance.dispose();
        });

        it('should return undefined when reading a private state property externally', () => {
            vi.spyOn(console, 'error').mockImplementation(() => {});
            const Test = defineComponent({
                name: 'Test',
                state: { secret: { private: true } },
            });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            expect(instance.state.secret).toBeUndefined();

            vi.restoreAllMocks();
            instance.dispose();
        });

        it('should log error when setting a private state property externally', () => {
            const consoleError = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            const Test = defineComponent({
                name: 'Test',
                state: { secret: { private: true } },
            });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            try {
                instance.state.secret = 'exposed';
            } catch {
                /* proxy returns false in strict mode */
            }

            expect(consoleError).toHaveBeenCalledWith(
                reporter.message('ERR16', {
                    componentName: 'Test',
                    type: 'private',
                    property: 'secret',
                })
            );

            consoleError.mockRestore();
            instance.dispose();
        });

        it('should not update value when setting a private state property externally', () => {
            vi.spyOn(console, 'error').mockImplementation(() => {});
            const Test = defineComponent({
                name: 'Test',
                state: { secret: { private: true } },
            });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            try {
                instance.state.secret = 'exposed';
            } catch {
                /* proxy returns false in strict mode */
            }

            expect(instance.state.secret).toBeUndefined();

            vi.restoreAllMocks();
            instance.dispose();
        });
    });

    describe('state option: readonly', () => {
        it('should log error when setting a readonly state property externally', () => {
            const consoleError = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            const Test = defineComponent({
                name: 'Test',
                state: { count: { readonly: true } },
            });
            const root = document.createElement('div');
            const instance = Test.mount(root, { count: 0 });

            try {
                instance.state.count = 99;
            } catch {
                /* proxy returns false in strict mode */
            }

            expect(consoleError).toHaveBeenCalledWith(
                reporter.message('ERR16', {
                    componentName: 'Test',
                    type: 'readonly',
                    property: 'count',
                })
            );

            consoleError.mockRestore();
            instance.dispose();
        });

        it('should not update value when setting a readonly state property externally', () => {
            vi.spyOn(console, 'error').mockImplementation(() => {});
            const Test = defineComponent({
                name: 'Test',
                state: { count: { readonly: true } },
            });
            const root = document.createElement('div');
            const instance = Test.mount(root, { count: 0 });

            try {
                instance.state.count = 99;
            } catch {
                /* proxy returns false in strict mode */
            }

            expect(instance.state.count).toBe(0);

            vi.restoreAllMocks();
            instance.dispose();
        });

        it('should allow reading a readonly state property externally', () => {
            const Test = defineComponent({
                name: 'Test',
                state: { count: { type: Number, readonly: true } },
            });
            const root = document.createElement('div');
            const instance = Test.mount(root, { count: 42 });

            expect(instance.state.count).toBe(42);

            instance.dispose();
        });
    });

    describe('methods option', () => {
        it('should not throw when methods are defined', () => {
            const Test = defineComponent({
                name: 'Test',
                methods: {
                    greet() {
                        return 'hello';
                    },
                    calculate(n: number) {
                        return n * 2;
                    },
                },
            });
            const root = document.createElement('div');

            expect(() => Test.mount(root)).not.toThrow();

            Test.unmount(root);
        });
    });

    describe('instance helpers', () => {
        it('should fail to create instance if root element already has an instance', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            expect(() => Test.mount(root)).toThrow(
                reporter.message('ERR03', {
                    componentName: 'Test',
                    action: 'mount',
                    root: describeElement(root),
                })
            );

            instance.dispose();
        });

        it('should get instance by root element', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            expect(Test.getInstance(root)).toStrictEqual(instance);

            instance.dispose();
        });

        it('should get instance by selector', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            document.body.appendChild(root);

            expect(Test.getInstance('div')).toStrictEqual(instance);

            document.body.removeChild(root);

            instance.dispose();
        });

        it('should fail to get instance if instance does not exist for root element', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');

            expect(() => Test.getInstance(root)).toThrow(
                reporter.message('ERR04', {
                    componentName: 'Test',
                    action: 'get',
                    root: describeElement(root),
                })
            );
        });

        it('should find instance by root element', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            expect(Test.findInstance(root)).toStrictEqual(instance);

            instance.dispose();
        });

        it('should find instance by selector', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.mount(root);

            document.body.appendChild(root);

            expect(Test.findInstance('div')).toStrictEqual(instance);

            document.body.removeChild(root);
            instance.dispose();
        });

        it('should return null if instance does not exist', () => {
            const Test = defineComponent({ name: 'Test' });

            expect(Test.findInstance('div')).toBeNull();
        });

        it('should unmount instance by root element', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');

            Test.mount(root);
            Test.unmount(root);

            expect(Test.findInstance(root)).toBeNull();
        });

        it('should unmount instance by selector', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');

            Test.mount(root);
            document.body.appendChild(root);

            Test.unmount('div');

            document.body.removeChild(root);
        });

        it('should fail to unmount instance if instance does not exist for root element', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');

            expect(() => Test.unmount(root)).toThrow(
                reporter.message('ERR04', {
                    componentName: 'Test',
                    action: 'unmount',
                    root: describeElement(root),
                })
            );
        });
    });
});
