import type Ornata from './index.js';

/**
 * The broad object shape accepted by the inferred `defineComponent` overload.
 * Each property mirrors a top-level component option section before Ornata
 * derives a normalized internal instance shape from it.
 * @private
 */
export type LooseComponentOptions = {
    name?: string;
    root?: unknown;
    state?: object;
    elements?: object;
    lifecycle?: object;
    watch?: object;
    methods?: object;
    computed?: object;
    data?: object;
    render?: object;
};

/**
 * Widens literal primitives inferred from option values so `default: 0`
 * becomes `number` instead of the literal `0` in the public instance type.
 */
type WidenLiteral<TValue> = TValue extends string
    ? string
    : TValue extends number
      ? number
      : TValue extends boolean
        ? boolean
        : TValue extends bigint
          ? bigint
          : TValue extends symbol
            ? symbol
            : TValue;

/**
 * Infers the runtime value type for a single state option from `parse`,
 * `default`, or `type` in that order.
 */
type InferStateValue<TOption> = TOption extends {
    parse: (value: string) => infer TParsed;
}
    ? TParsed
    : TOption extends { default: infer TDefault }
      ? WidenLiteral<TDefault>
      : TOption extends { type: StringConstructor }
        ? string
        : TOption extends { type: NumberConstructor }
          ? number
          : TOption extends { type: BooleanConstructor }
            ? boolean
            : TOption extends { type: ArrayConstructor }
              ? unknown[]
              : TOption extends { type: ObjectConstructor }
                ? object
                : TOption extends { type: FunctionConstructor }
                  ? Function
                  : unknown;

/**
 * Builds the inferred public state object from the raw `state` option map.
 */
type InferStateFromOptions<TOptions> = TOptions extends object
    ? {
          [K in keyof TOptions]: InferStateValue<TOptions[K]>;
      }
    : {};

/**
 * Infers the resolved element type for a single element option from `resolve`,
 * `queryAll`, `query`, or `create`.
 */
type InferElementValue<TOption> = TOption extends {
    resolve: (root: Element) => infer TResolved;
}
    ? TResolved
    : TOption extends { queryAll: string }
      ? Element[]
      : TOption extends { query: string }
        ? Element | null
        : TOption extends {
                create: infer TTag extends keyof HTMLElementTagNameMap;
            }
          ? HTMLElementTagNameMap[TTag]
          : Ornata.ComponentElement;

/**
 * Builds the inferred public elements object from the raw `elements` option map.
 */
type InferElementsFromOptions<TOptions> = TOptions extends object
    ? {
          [K in keyof TOptions]: InferElementValue<TOptions[K]>;
      }
    : {};

/**
 * Removes an explicit `this` parameter from method option callbacks so the
 * inferred public `methods` shape matches the externally callable signature.
 */
type StripThis<TValue> = TValue extends (
    this: any,
    ...args: infer TArgs
) => infer TReturn
    ? (...args: TArgs) => TReturn
    : TValue extends (...args: infer TArgs) => infer TReturn
      ? (...args: TArgs) => TReturn
      : never;

/**
 * Builds the inferred public methods object from the raw `methods` option map.
 */
type InferMethodsFromOptions<TOptions> = TOptions extends object
    ? {
          [K in keyof TOptions]: StripThis<TOptions[K]>;
      }
    : {};

/**
 * Builds the inferred public computed object from the return types of the raw
 * `computed` callbacks.
 */
type InferComputedFromOptions<TOptions> = TOptions extends object
    ? {
          [K in keyof TOptions]: TOptions[K] extends (
              this: any,
              context: any
          ) => infer TReturn
              ? WidenLiteral<TReturn>
              : TOptions[K] extends (...args: any[]) => infer TReturn
                ? WidenLiteral<TReturn>
              : never;
      }
    : {};

/**
 * Widens literal values from the raw `data` option object into the public data
 * shape available on component callbacks.
 */
type InferDataFromOptions<TData> = TData extends object
    ? {
          [K in keyof TData]: WidenLiteral<TData[K]>;
      }
    : {};

/**
 * Collects the inferred component sections that are derived from the loose
 * inferred `defineComponent` options object.
 */
type InferComponentParts<TOptions extends LooseComponentOptions> = {
    state: InferStateFromOptions<TOptions['state']>;
    elements: InferElementsFromOptions<TOptions['elements']>;
    methods: InferMethodsFromOptions<TOptions['methods']>;
    data: InferDataFromOptions<TOptions['data']>;
    computed: InferComputedFromOptions<TOptions['computed']>;
};

/**
 * Normalizes the inferred component sections into the full internal instance
 * shape expected by Ornata's public component types.
 * @private
 */
export type InferComponentInstance<TOptions extends LooseComponentOptions> =
    Ornata.NormalizeComponentParts<InferComponentParts<TOptions>>;

/**
 * The softer render context used by the inferred overload so unannotated render
 * callbacks receive editor-friendly autocomplete without conditional index types.
 */
type InferredRenderContext = {
    type: 'render';
    index?: number;
};

/**
 * Reconstructs the contextual typing for the inferred `defineComponent` overload
 * from the raw options object so callbacks, watch handlers, render functions,
 * and instance creation all share the same derived component shape.
 * @private
 */
export type InferredComponentOptions<TOptions extends LooseComponentOptions> = {
    name?: string;
    root?: Ornata.RootOptions<InferComponentInstance<TOptions>>;
    state?: TOptions['state'] extends object
        ? {
              [K in keyof TOptions['state']]: Ornata.StateOptions<
                  InferComponentInstance<TOptions>,
                  Extract<K, keyof InferComponentInstance<TOptions>['state']>
              >;
          }
        : never;
    elements?: TOptions['elements'] extends object
        ? {
              [K in keyof TOptions['elements']]: Ornata.ElementOptions<
                  InferComponentInstance<TOptions>,
                  Extract<K, keyof InferComponentInstance<TOptions>['elements']>
              >;
          }
        : never;
    lifecycle?: {
        setup?: (this: InferComponentInstance<TOptions>) => void;
        teardown?: (this: InferComponentInstance<TOptions>) => void;
    };
    watch?: TOptions['watch'] extends object
        ? {
              [K in keyof TOptions['watch']]: K extends keyof InferComponentInstance<TOptions>['state']
                  ? Ornata.WatchCallback<InferComponentInstance<TOptions>, K>
                  : never;
          }
        : never;
    methods?: TOptions['methods'] extends object
        ? {
              [K in keyof TOptions['methods']]: K extends keyof InferComponentInstance<TOptions>['methods']
                  ? Ornata.MethodDefinition<
                        InferComponentInstance<TOptions>,
                        InferComponentInstance<TOptions>['methods'][K]
                    >
                  : never;
          }
        : never;
    computed?: TOptions['computed'] extends object
        ? {
              [K in keyof TOptions['computed']]: K extends keyof InferComponentInstance<TOptions>['computed']
                  ? Ornata.ComputedCallback<InferComponentInstance<TOptions>, K>
                  : never;
          }
        : never;
    data?: TOptions['data'];
    render?: TOptions['elements'] extends object
        ? {
              [K in keyof TOptions['elements']]?: (
                  this: InferComponentInstance<TOptions>,
                  context: InferredRenderContext
              ) => Ornata.RenderOptions;
          }
        : never;
};
