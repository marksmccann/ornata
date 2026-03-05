import type Ornata from './index.js';
import { ORNATA_COMPONENT_CONSTRUCTOR } from './symbols.js';

/**
 * Check if the value is an Ornata component constructor.
 * @param value The value to check if it is a component constructor.
 * @returns Whether the value is a component constructor.
 */
export default function isComponent<
    T extends Ornata.ComponentConstructor<Ornata.ComponentInternalInstance>,
>(value: unknown): value is T {
    return (
        typeof value === 'function' &&
        (value as { $$typeof?: unknown }).$$typeof ===
            ORNATA_COMPONENT_CONSTRUCTOR
    );
}
