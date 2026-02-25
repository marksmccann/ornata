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
          template: '{{ componentName }}: State option missing required property. The state option for "{{ property }}" must have at least one of the following defined: "defaultValue", "type", or "parse".';
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
      };

const messages: RuntimeReporterMessages<Messages> = {
    ERR01: '{{ componentName }}: Failed to {{ action }} instance. Could not find root element with selector: "{{ selector }}"',
    ERR02: '{{ componentName }}: Failed to {{ action }} instance. Invalid root element of type "{{ element }}" provided.',
    ERR03: '{{ componentName }}: Failed to {{ action }} instance. Instance already exists for root element: "{{ root }}"',
    ERR04: '{{ componentName }}: Failed to {{ action }} instance. Instance does not exists for root element: "{{ root }}"',
    ERR05: '{{ componentName }}: Invalid root element. The root element does not match the selector: "{{ selector }}".',
    ERR06: '{{ componentName }}: State option missing required property. The state option for "{{ property }}" must have at least one of the following defined: "defaultValue", "type", or "parse".',
    ERR07: '{{ componentName }}: Unknown state property. The property "{{ property }}" was provided, but it does not have a state option.',
    ERR08: '{{ componentName }}: Failed to parse state from HTML. The value "{{ value }}" for property "{{ property }}" from the root element is not valid.',
    ERR09: '{{ componentName }}: Invalid state type. The value "{{ value }}" for property "{{ property }}" is not of type "{{ type }}".',
};

/**
 * The runtime reporter for Ornata.
 * @private
 */
const reporter = createReporter(
    process.env.NODE_ENV === 'production' ? ({} as typeof messages) : messages
);

export default reporter;
