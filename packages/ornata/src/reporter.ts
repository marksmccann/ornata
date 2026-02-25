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
      };

const messages: RuntimeReporterMessages<Messages> = {
    ERR01: '{{ componentName }}: Failed to {{ action }} instance. Could not find root element with selector: "{{ selector }}"',
    ERR02: '{{ componentName }}: Failed to {{ action }} instance. Invalid root element of type "{{ element }}" provided.',
    ERR03: '{{ componentName }}: Failed to {{ action }} instance. Instance already exists for root element: "{{ root }}"',
    ERR04: '{{ componentName }}: Failed to {{ action }} instance. Instance does not exists for root element: "{{ root }}"',
    ERR05: '{{ componentName }}: Invalid root element. The root element does not match the selector: "{{ selector }}".',
};

/**
 * The runtime reporter for Ornata.
 * @private
 */
const reporter = createReporter(
    process.env.NODE_ENV === 'production' ? ({} as typeof messages) : messages
);

export default reporter;
