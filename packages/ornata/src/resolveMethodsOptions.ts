import type Ornata from './index.js';

/**
 * Resolves the methods options for a component.
 * @param internalInstance The internal instance of the component.
 * @param methodsOptions The methods options.
 * @returns The methods object to be assigned to the component instance.
 */
export default function resolveMethodsOptions<
    T extends Ornata.ComponentInternalInstance,
>(
    internalInstance: T,
    methodsOptions: Ornata.ComponentOption<T, 'methods'>
): T['methods'] {
    const methods = {} as T['methods'];

    Object.entries(methodsOptions).forEach((entry) => {
        const property = entry[0] as keyof T['methods'];
        const method = entry[1] as Ornata.ComponentMethod;

        methods[property] = method.bind(internalInstance);
    });

    return methods;
}
