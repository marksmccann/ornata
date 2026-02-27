import type { RuntimeReporterMessages } from 'runtime-reporter';
import { createReporter } from 'runtime-reporter';

type Messages =
    | {
          code: 'ERR01';
          template: '{{ componentName }}: Failed to {{ action }} instance. Could not find root element with selector: "{{ selector }}"';
          tokens: 'componentName' | 'action' | 'selector';
      }
    | {
          code: 'ERR02';
          template: '{{ componentName }}: Failed to {{ action }} instance. Invalid root element of type "{{ element }}" provided.';
          tokens: 'componentName' | 'action' | 'element';
      }
    | {
          code: 'ERR03';
          template: '{{ componentName }}: Failed to {{ action }} instance. Instance already exists for root element: "{{ root }}"';
          tokens: 'componentName' | 'action' | 'root';
      }
    | {
          code: 'ERR04';
          template: '{{ componentName }}: Failed to {{ action }} instance. Instance does not exists for root element: "{{ root }}"';
          tokens: 'componentName' | 'action' | 'root';
      }
    | {
          code: 'ERR05';
          template: '{{ componentName }}: Invalid root element. The root element does not match the selector: "{{ selector }}".';
          tokens: 'componentName' | 'selector';
      }
    | {
          code: 'ERR06';
          template: '{{ componentName }}: State option missing required property. The state option for "{{ property }}" must have at least one of the following: "defaultValue", "type", or "parse".';
          tokens: 'componentName' | 'property';
      }
    | {
          code: 'ERR07';
          template: '{{ componentName }}: Unknown state property. The property "{{ property }}" was provided, but it does not have a state option.';
          tokens: 'componentName' | 'property';
      }
    | {
          code: 'ERR08';
          template: '{{ componentName }}: Failed to parse state from HTML. The value "{{ value }}" for property "{{ property }}" from the root element is not valid.';
          tokens: 'componentName' | 'value' | 'property';
      }
    | {
          code: 'ERR09';
          template: '{{ componentName }}: Invalid state type. The value "{{ value }}" for property "{{ property }}" is not of type "{{ type }}".';
          tokens: 'componentName' | 'value' | 'property' | 'type';
      }
    | {
          code: 'ERR10';
          template: '{{ componentName }}: Missing minimum number of elements. The property "{{ property }}" must have at least {{ min }} elements.';
          tokens: 'componentName' | 'property' | 'min';
      }
    | {
          code: 'ERR11';
          template: '{{ componentName }}: Failed to resolve element. The property "{{ property }}" requires one of the following: "queryAll", "query", "create", or "resolve".';
          tokens: 'componentName' | 'property';
      }
    | {
          code: 'ERR12';
          template: '{{ componentName }}: Missing minimum number of elements. The property "{{ property }}" must have at least {{ min }} elements.';
          tokens: 'componentName' | 'property' | 'min';
      }
    | {
          code: 'ERR13';
          template: '{{ componentName }}: Exceeded maximum number of elements. The property "{{ property }}" must have at most {{ max }} elements.';
          tokens: 'componentName' | 'property' | 'max';
      }
    | {
          code: 'ERR14';
          template: '{{ componentName }}: Found too many element resolution methods. The property "{{ property }}" was provided "{{ provided }}" but, only "{{ used }}" was used.';
          tokens: 'componentName' | 'property' | 'provided' | 'used';
      }
    | {
          code: 'ERR15';
          template: '{{ componentName }}: Cannot access private state property. The property "{{ property }}" is private and cannot be accessed externally.';
          tokens: 'componentName' | 'property';
      }
    | {
          code: 'ERR16';
          template: '{{ componentName }}: Cannot set {{ type }} state property. The property "{{ property }}" is {{ type }} and cannot be set externally.';
          tokens: 'componentName' | 'type' | 'property';
      };

const messages: RuntimeReporterMessages<Messages> = {
    ERR01: '{{ componentName }}: Failed to {{ action }} instance. Could not find root element with selector: "{{ selector }}"',
    ERR02: '{{ componentName }}: Failed to {{ action }} instance. Invalid root element of type "{{ element }}" provided.',
    ERR03: '{{ componentName }}: Failed to {{ action }} instance. Instance already exists for root element: "{{ root }}"',
    ERR04: '{{ componentName }}: Failed to {{ action }} instance. Instance does not exists for root element: "{{ root }}"',
    ERR05: '{{ componentName }}: Invalid root element. The root element does not match the selector: "{{ selector }}".',
    ERR06: '{{ componentName }}: State option missing required property. The state option for "{{ property }}" must have at least one of the following: "defaultValue", "type", or "parse".',
    ERR07: '{{ componentName }}: Unknown state property. The property "{{ property }}" was provided, but it does not have a state option.',
    ERR08: '{{ componentName }}: Failed to parse state from HTML. The value "{{ value }}" for property "{{ property }}" from the root element is not valid.',
    ERR09: '{{ componentName }}: Invalid state type. The value "{{ value }}" for property "{{ property }}" is not of type "{{ type }}".',
    ERR10: '{{ componentName }}: Missing minimum number of elements. The property "{{ property }}" must have at least {{ min }} elements.',
    ERR11: '{{ componentName }}: Failed to resolve element. The property "{{ property }}" requires one of the following: "queryAll", "query", "create", or "resolve".',
    ERR12: '{{ componentName }}: Missing minimum number of elements. The property "{{ property }}" must have at least {{ min }} elements.',
    ERR13: '{{ componentName }}: Exceeded maximum number of elements. The property "{{ property }}" must have at most {{ max }} elements.',
    ERR14: '{{ componentName }}: Found too many element resolution methods. The property "{{ property }}" was provided "{{ provided }}" but, only "{{ used }}" was used.',
    ERR15: '{{ componentName }}: Cannot access private state property. The property "{{ property }}" is private and cannot be accessed externally.',
    ERR16: '{{ componentName }}: Cannot set {{ type }} state property. The property "{{ property }}" is {{ type }} and cannot be set externally.',
};

/**
 * The runtime reporter for Ornata.
 * @private
 */
const reporter = createReporter(
    process.env.NODE_ENV === 'production' ? ({} as typeof messages) : messages
);

export default reporter;
