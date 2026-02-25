// @vitest-environment jsdom

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
        // expect(instance.$state).toStrictEqual({});
        expect(instance.addStateListener).toBeInstanceOf(Function);
        expect(instance.removeStateListener).toBeInstanceOf(Function);

        instance.dispose();
    });

    describe('root options', () => {
        it('should log error when root element does not match selector', () => {
            const consoleError = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            const Test = defineComponent({
                name: 'Test',
                root: { matches: 'input' },
            });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            expect(consoleError).toHaveBeenCalledWith(
                reporter.message('ERR05', {
                    componentName: 'Test',
                    selector: 'input',
                })
            );

            instance.dispose();
        });

        it('should not log error when root element matches selector', () => {
            const consoleError = vi.spyOn(console, 'error');
            const Test = defineComponent({
                name: 'Test',
                root: { matches: 'div' },
            });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            expect(consoleError).not.toHaveBeenCalled();

            instance.dispose();
        });
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
            const instance = Test.createInstance(root);

            Test.deleteInstance(root);

            expect(Test.queryInstance(root)).toBeNull();
        });

        it('should delete instance by selector', () => {
            const Test = defineComponent({ name: 'Test' });
            const root = document.createElement('div');
            const instance = Test.createInstance(root);

            Test.deleteInstance('div');
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
