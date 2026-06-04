import type { InternalInstance, MethodOptions, Methods } from './runtime.js';

/**
 * Resolves the methods options for a component.
 * @param internalInstance The internal instance of the component.
 * @param methodOptions The method options.
 * @returns The methods object to be assigned to the component instance.
 */
export default function resolveMethodOptions(
    this: InternalInstance,
    methodsOptions: MethodOptions
): Methods {
    const methods = {} as Methods;

    Object.entries(methodsOptions).forEach((entry) => {
        const property = entry[0];
        const method = entry[1];

        methods[property] = method.bind(this);
    });

    return methods;
}
