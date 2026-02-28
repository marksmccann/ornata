import type Ornata from './index.js';

/**
 * Resolves the methods options for a component.
 * @param internalInstance The internal instance of the component.
 * @param methodOptions The method options.
 * @returns The methods object to be assigned to the component instance.
 */
export default function resolveMethodOptions<
    T extends Ornata.ComponentInternalInstance,
>(this: T, methodsOptions: Ornata.ComponentOption<T, 'methods'>): T['methods'] {
    const methods = {} as T['methods'];

    Object.entries(methodsOptions).forEach((entry) => {
        const property = entry[0] as keyof T['methods'];
        const method = entry[1] as Ornata.ComponentMethod;

        methods[property] = method.bind(this);
    });

    return methods;
}
