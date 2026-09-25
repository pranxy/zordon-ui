import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Toast reference content. Mirrors projects/components/toast/src/toast.ts and
 * docs/components/toast.md — update them together.
 */

export const toastColors = ['info', 'success', 'warning', 'error'] as const;
export const toastPositions = [
  'top-start',
  'top-center',
  'top-end',
  'middle-start',
  'middle-center',
  'middle-end',
  'bottom-start',
  'bottom-center',
  'bottom-end',
] as const;

const optionColumns = [
  { key: 'name', label: 'Option', kind: 'name' as const },
  { key: 'type', label: 'Type', kind: 'code' as const },
  { key: 'default', label: 'Default', kind: 'code' as const },
  { key: 'description', label: 'Description' },
];

export const toastReference: DocsReference = {
  eyebrow: 'Feedback',
  heading: 'Toast',
  maturity: 'planned',
  description:
    'Short, non-blocking notifications from a service, shown in a fixed outlet and announced from regions that exist before the first message.',
  facts: controlFacts('zd-toast-outlet', 'toast', 'toast'),
  notice: plannedNotice,
  install: {
    description:
      'Mount one outlet per service instance, near the root, then call the service. Each toast is an Alert, so register both sets of classes.',
    importCode: `import { ZdToastOutlet, ZdToastService } from '@pranxy/zordon-ui/toast';`,
    stylesCode: tailwindSource(
      'toast toast-top toast-middle toast-bottom toast-start toast-center toast-end alert alert-horizontal alert-info alert-success alert-warning alert-error',
    ),
  },
  playgroundDescription:
    'Show a few in a row: up to three are visible and the rest wait their turn. Hovering or focusing a toast pauses its timer.',
  api: {
    description:
      'ZdToastService holds the queue; ZdToastOutlet renders it. The root service suits app-wide messages; provide your own for an isolated scope.',
    tables: [
      {
        id: 'service',
        heading: 'Service',
        caption: 'Toast service methods',
        columns: [
          { key: 'name', label: 'Method', kind: 'name' },
          { key: 'type', label: 'Returns', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'show(options)',
            type: 'string',
            description:
              'Queues a message and returns its id. A duplicate key returns the existing id.',
          },
          {
            name: 'update(id, options)',
            type: 'boolean',
            description: 'Replaces the options in place. `false` if the id is gone.',
          },
          { name: 'dismiss(id)', type: 'boolean', description: 'Removes one message.' },
          { name: 'clear()', type: 'void', description: 'Removes every message.' },
          {
            name: 'track(promise, flow)',
            type: 'Promise<T>',
            description: 'Shows a loading message, then swaps in success or error options.',
          },
          {
            name: 'items()',
            type: 'readonly ZdToastItem[]',
            description: 'Visible and queued messages, oldest first.',
          },
        ],
      },
      {
        id: 'options',
        heading: 'Options',
        caption: 'Toast options',
        columns: optionColumns,
        rows: [
          {
            name: 'message',
            type: 'string',
            default: 'required',
            description: 'Plain text; also the announcement for custom templates.',
          },
          {
            name: 'color',
            type: 'string',
            default: 'undefined',
            description: '`info`, `success`, `warning` or `error`.',
          },
          {
            name: 'position',
            type: 'ZdToastPosition',
            default: "'bottom-end'",
            description: 'top, middle or bottom, with start, center or end.',
          },
          {
            name: 'duration',
            type: 'number',
            default: '5000',
            description:
              'Visible milliseconds. 0 persists; messages with an action persist by default.',
          },
          {
            name: 'priority',
            type: 'ZdToastPriority',
            default: "'polite'",
            description: '`off`, `polite` or `assertive`. Color never implies it.',
          },
          {
            name: 'key',
            type: 'string',
            default: 'undefined',
            description: 'Deduplicates: a second show with the same key is ignored.',
          },
          {
            name: 'action',
            type: 'ZdToastAction',
            default: 'undefined',
            description: 'A label, a run callback and an error message for when it fails.',
          },
          {
            name: 'template',
            type: 'TemplateRef<ZdToastContext>',
            default: 'undefined',
            description: 'Custom content; the implicit context is the item.',
          },
          {
            name: 'dismissLabel',
            type: 'string',
            default: "'Dismiss notification'",
            description: 'Accessible name of the close button.',
          },
        ],
      },
      {
        id: 'outlet',
        heading: 'Outlet inputs',
        caption: 'Toast outlet inputs',
        columns: optionColumns.map(column =>
          column.key === 'name' ? { ...column, label: 'Input' } : column,
        ),
        rows: [
          {
            name: 'label',
            type: 'string',
            default: "'Notifications'",
            description: 'Name of the outlet’s region landmark.',
          },
          {
            name: 'limit',
            type: 'number',
            default: '3',
            description: 'How many are visible at once, across all positions (1–20).',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/toast',
    typesCode: `export type ZdToastPosition = \`\${'top' | 'middle' | 'bottom'}-\${'start' | 'center' | 'end'}\`;
export type ZdToastPriority = 'off' | 'polite' | 'assertive';
export interface ZdToastAction {
  readonly label: string;
  readonly run: () => void | Promise<void>;
  readonly errorMessage: string;
}
export interface ZdToastFlow<T> {
  readonly loading: ZdToastOptions;
  readonly success: (value: T) => ZdToastOptions;
  readonly error: (error: unknown) => ZdToastOptions;
}`,
  },
  accessibility: {
    description:
      'The outlet owns live regions that exist before any message, so new toasts are announced once, by priority.',
    features: [
      {
        title: 'Focus stays put',
        body: 'Showing or timing out a toast never moves focus. Dismissing a focused one returns focus to where it came from.',
      },
      {
        title: 'Always dismissible',
        body: 'Every toast has a named close button with a 44px target.',
      },
      {
        title: 'Actions persist',
        body: 'Toasts with actions don’t time out. A failed action says so, assertively, and stays for a retry.',
      },
      {
        title: 'Not for essentials',
        body: 'Anything people must acknowledge belongs in a dialog or on the page, not in a toast.',
      },
    ],
  },
  customization: {
    description:
      'Toasts are fixed to the viewport. Mount the outlet outside transformed or clipping ancestors; start and end follow the text direction.',
    code: {
      label: 'app.component.html',
      language: 'html',
      code: `<router-outlet />
<zd-toast-outlet label="Notifications" [limit]="4" />`,
    },
  },
  ssr: 'The server renders any initial messages and the empty live regions, with no timers. Messages present at first render are shown but not announced.',
};

export const toastPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'color',
    options: ['default', ...toastColors].map(value => ({ value, label: value })),
    defaultValue: 'success',
    omit: ['default'],
  },
  {
    kind: 'choice',
    key: 'position',
    options: toastPositions.map(value => ({ value, label: value })),
    defaultValue: 'bottom-end',
    omit: ['bottom-end'],
  },
];

/** Turns the playground's serialised attributes into `show()` options. */
export function showOptions(attributes: string): string {
  const options = [...attributes.matchAll(/(\w+)="([^"]*)"/g)].map(
    ([, key, value]) => `, ${key}: '${value}'`,
  );
  return `{ message: 'Draft saved'${options.join('')} }`;
}

export const toastPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-toast-outlet />
<button type="button" (click)="toasts.show(${showOptions(attributes)})">
  Save draft
</button>`,
};

export const actionFiles = [
  {
    label: 'delete.ts',
    language: 'ts' as const,
    code: `protected delete(): void {
  this.toasts.show({
    message: 'Invoice deleted',
    action: {
      label: 'Undo',
      run: () => this.restore(),
      errorMessage: 'Undo failed. Try again.',
    },
  });
}`,
  },
];

export const trackFiles = [
  {
    label: 'publish.ts',
    language: 'ts' as const,
    code: `protected async publish(): Promise<void> {
  await this.toasts
    .track(this.api.publish(), {
      loading: { message: 'Publishing' },
      success: () => ({ message: 'Published', color: 'success' }),
      error: () => ({ message: 'Publishing failed', color: 'error', duration: 0 }),
    })
    .catch(() => undefined); // the error toast already reports it
}`,
  },
];

export const templateFiles = [
  {
    label: 'invite.html',
    language: 'html' as const,
    code: `<ng-template #invite let-item>
  <strong>{{ item.message }}</strong>
  <span> · 3 people added to Design</span>
</ng-template>`,
  },
  {
    label: 'invite.ts',
    language: 'ts' as const,
    code: `private readonly invite = viewChild.required<TemplateRef<ZdToastContext>>('invite');

protected notify(): void {
  this.toasts.show({ message: 'Invitations sent', color: 'info', template: this.invite() });
}`,
  },
];
