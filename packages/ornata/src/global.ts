/**
 * IIFE entry point. Exports only named exports (no default) so the global
 * Ornata object does not have a redundant .default property.
 */
export { defineComponent, isComponent } from './index';
