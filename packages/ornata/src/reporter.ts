import { createReporter } from 'runtime-reporter';

const messages = {
    ERR01: '{{ componentName }}: Failed to {{ action }} instance. Could not find root element with selector: "{{ selector }}"',
    ERR02: '{{ componentName }}: Failed to {{ action }} instance. Invalid root element of type "{{ element }}" provided.',
    ERR03: '{{ componentName }}: Failed to {{ action }} instance. Instance already exists for root element: "{{ root }}"',
    ERR04: '{{ componentName }}: Failed to {{ action }} instance. Instance does not exist for root element: "{{ root }}"',
    ERR05: '{{ componentName }}: Invalid root element. The root element does not match the selector: "{{ selector }}".',
    ERR06: '{{ componentName }}: Invalid state options. The property "{{ property }}" has conflicting expected types from {{ sources }}: {{ types }}.',
    ERR07: '{{ componentName }}: Invalid state property. The property "{{ property }}" is not defined in the component state options.',
    ERR08: '{{ componentName }}: Failed to parse state from HTML. The value "{{ value }}" for property "{{ property }}" from the root element is not valid.',
    ERR09: '{{ componentName }}: Invalid state type. The value "{{ value }}" for property "{{ property }}" is not of type "{{ type }}".',
    ERR10: '{{ componentName }}: Missing minimum number of elements. The property "{{ property }}" must have at least {{ min }} elements.',
    ERR11: '{{ componentName }}: Failed to resolve element. The property "{{ property }}" requires one of the following: "queryAll", "query", "create", or "resolve".',
    ERR12: '{{ componentName }}: Missing minimum number of elements. The property "{{ property }}" must have at least {{ min }} elements.',
    ERR13: '{{ componentName }}: Exceeded maximum number of elements. The property "{{ property }}" must have at most {{ max }} elements.',
    ERR14: '{{ componentName }}: Found too many element resolution methods. The property "{{ property }}" was provided "{{ provided }}" but, only "{{ used }}" was used.',
    ERR15: '{{ componentName }}: Cannot access private state property. The property "{{ property }}" is private and cannot be accessed externally.',
    ERR16: '{{ componentName }}: Cannot set {{ type }} state property. The property "{{ property }}" is {{ type }} and cannot be set externally.',
    ERR17: '{{ componentName }}: Found a duplicate element reference. The DOM element "{{ element }}" referenced by {{ property }} was also referenced by {{ reference }}. Multiple references to the same DOM element will lead to unexpected behaviors when the component is rendered.',
    ERR18: '{{ componentName }}: Failed to set "{{ property }}" on element {{ element }}. The {{ property }} property can only set on elements of type: {{ supportedTypes }}.',
    ERR19: '{{ componentName }}: Failed to set property "{{ property }}" on element {{ element }}. The value is of type "{{ type }}" but must be one of: {{ supportedTypes }}.',
    ERR20: '{{ componentName }}: Failed to apply unknown render option "{{ option }}" on element {{ element }}. Expect one of: "attributes", "style", "classes", "dataset", "events", "html", "text".',
    ERR21: '{{ componentName }}: Failed to {{ action }} because component instance does not exist. It was likely disposed or never created.',
    ERR22: '{{ componentName }}: Failed to {{ action }} state property "{{ property }}". The property is not a valid state property defined in the component options.',
    ERR23: '{{ componentName }}: Failed to call "{{ property }}" in the "{{ option }}" option because it is not a valid callback function.',
    ERR24: 'Failed to initialize component for the root element "{{ root }}". The "data-ornata" attribute does not have a valid component name as its value. Found "{{ value }}", but expected one of: {{ expected }}',
    WRN01: '{{ componentName }}: Failed to {{ action }} state listener for property "{{ property }}". The listener {{ status }}.',
    WRN02: '{{ componentName }}: Could not determine the expected state type for property "{{ property }}". Provide a "type", "default", or "parse" state option for clearer validation.',
} as const;

/**
 * The runtime reporter for Ornata.
 * @private
 */
const reporter = createReporter(
    process.env.NODE_ENV === 'production'
        ? ({} as unknown as typeof messages)
        : messages
);

export default reporter;
