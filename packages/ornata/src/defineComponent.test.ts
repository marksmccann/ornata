// @vitest-environment jsdom

import type Ornata from './index.js';
import { describe, it, expect, vi } from 'vitest';
import { defineComponent } from './index.js';
import reporter from './reporter.js';
import describeElement from './describeElement.js';

describe('defineComponent', () => {
    it('should create component constructor', () => {
        const Test = defineComponent({ name: 'Test' });

        expect(Test.displayName).toStrictEqual('Test');
        expect(Test.createInstance).toBeInstanceOf(Function);
        expect(Test.getInstance).toBeInstanceOf(Function);
        expect(Test.queryInstance).toBeInstanceOf(Function);
    });

    it('should create component instance', () => {
        const Test = defineComponent({ name: 'Test' });
        const root = document.createElement('div');
        const instance = Test.createInstance(root);

        expect(instance).toBeInstanceOf(Test);
        expect(instance.$$typeof).toStrictEqual(Symbol.for('ornata.component'));
        expect(instance.$root).toStrictEqual(root);
        expect(instance.$state).toStrictEqual({});
        expect(instance.addStateListener).toBeInstanceOf(Function);
        expect(instance.removeStateListener).toBeInstanceOf(Function);

        instance.dispose();
    });

    describe('instance methods', () => {
        it('should dispose instance', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            instance.dispose();

            expect(Test.queryInstance(root)).toBeNull();
        });
    });

    describe('lifecycle option', () => {
        it('should call setup when instance is created', () => {
            const setup = vi.fn();
            const Test = defineComponent({
                name: 'Test',
                lifecycle: { setup },
            });
            const root = document.createElement('div');

            Test.createInstance(root);

            expect(setup).toHaveBeenCalledOnce();

            Test.deleteInstance(root);
        });

        it('should call teardown when instance is disposed', () => {
            const teardown = vi.fn();
            const Test = defineComponent({
                name: 'Test',
                lifecycle: { teardown },
            });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            expect(teardown).not.toHaveBeenCalled();

            instance.dispose();

            expect(teardown).toHaveBeenCalledOnce();
        });

        it('should call setup with the internal component instance as this', () => {
            let capturedThis = {} as Ornata.ComponentInternalInstance;
            const Test = defineComponent({
                name: 'Test',
                lifecycle: {
                    setup() {
                        capturedThis = this;
                    },
                },
            });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            expect(capturedThis.root).toBe(root);
            expect(capturedThis.state).toStrictEqual({});
            expect(capturedThis.elements).toStrictEqual({});
            expect(capturedThis.methods).toStrictEqual({});
            expect(capturedThis.data).toStrictEqual({});

            instance.dispose();
        });

        it('should call teardown with the internal component instance as this', () => {
            let capturedThis = {} as Ornata.ComponentInternalInstance;
            const Test = defineComponent({
                name: 'Test',
                lifecycle: {
                    teardown() {
                        capturedThis = this;
                    },
                },
            });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            instance.dispose();

            expect(capturedThis.root).toBe(root);
            expect(capturedThis.state).toStrictEqual({});
            expect(capturedThis.elements).toStrictEqual({});
            expect(capturedThis.methods).toStrictEqual({});
            expect(capturedThis.data).toStrictEqual({});
        });

        it('should give setup access to instance properties via this', () => {
            let capturedRoot: unknown;
            const root = document.createElement('div');
            const Test = defineComponent({
                name: 'Test',
                lifecycle: {
                    setup() {
                        capturedRoot = this.root;
                    },
                },
            });

            Test.createInstance(root);

            expect(capturedRoot).toBe(root);

            Test.deleteInstance(root);
        });

        it('should not throw when setup is not provided', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');

            expect(() => Test.createInstance(root)).not.toThrow();

            Test.deleteInstance(root);
        });

        it('should not throw when teardown is not provided', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            expect(() => instance.dispose()).not.toThrow();
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
            const instance = Test.createInstance(root);

            void instance.$state.secret;

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
            const instance = Test.createInstance(root);

            expect(instance.$state.secret).toBeUndefined();

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
            const instance = Test.createInstance(root);

            try {
                instance.$state.secret = 'exposed';
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
            const instance = Test.createInstance(root);

            try {
                instance.$state.secret = 'exposed';
            } catch {
                /* proxy returns false in strict mode */
            }

            expect(instance.$state.secret).toBeUndefined();

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
            const instance = Test.createInstance(root, { count: 0 });

            try {
                instance.$state.count = 99;
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
            const instance = Test.createInstance(root, { count: 0 });

            try {
                instance.$state.count = 99;
            } catch {
                /* proxy returns false in strict mode */
            }

            expect(instance.$state.count).toBe(0);

            vi.restoreAllMocks();
            instance.dispose();
        });

        it('should allow reading a readonly state property externally', () => {
            const Test = defineComponent({
                name: 'Test',
                state: { count: { type: Number, readonly: true } },
            });
            const root = document.createElement('div');
            const instance = Test.createInstance(root, { count: 42 });

            expect(instance.$state.count).toBe(42);

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

            expect(() => Test.createInstance(root)).not.toThrow();

            Test.deleteInstance(root);
        });
    });

    describe('static methods', () => {
        it('should fail to create instance if root element already has an instance', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            expect(() => Test.createInstance(root)).toThrow(
                reporter.message('ERR03', {
                    componentName: 'Test',
                    action: 'create',
                    root: describeElement(root),
                })
            );

            instance.dispose();
        });

        it('should get instance by root element', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            expect(Test.getInstance(root)).toStrictEqual(instance);

            instance.dispose();
        });

        it('should get instance by selector', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

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

        it('should query instance by root element', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            expect(Test.queryInstance(root)).toStrictEqual(instance);

            instance.dispose();
        });

        it('should query instance by selector', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            document.body.appendChild(root);

            expect(Test.queryInstance('div')).toStrictEqual(instance);

            document.body.removeChild(root);
            instance.dispose();
        });

        it('should return null if instance does not exist', () => {
            const Test = defineComponent({ name: 'Test' });

            expect(Test.queryInstance('div')).toBeNull();
        });

        it('should delete instance by root element', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');

            Test.createInstance(root);
            Test.deleteInstance(root);

            expect(Test.queryInstance(root)).toBeNull();
        });

        it('should delete instance by selector', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');

            Test.createInstance(root);
            document.body.appendChild(root);

            Test.deleteInstance('div');

            document.body.removeChild(root);
        });

        it('should fail to delete instance if instance does not exist for root element', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');

            expect(() => Test.deleteInstance(root)).toThrow(
                reporter.message('ERR04', {
                    componentName: 'Test',
                    action: 'delete',
                    root: describeElement(root),
                })
            );
        });
    });
});
