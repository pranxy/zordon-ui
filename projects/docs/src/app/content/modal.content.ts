import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Modal reference content. Mirrors projects/components/modal/src/modal.ts and
 * docs/components/modal.md — update them together.
 */

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

const optionColumns = [
  { key: 'name', label: 'Option', kind: 'name' as const },
  { key: 'type', label: 'Type', kind: 'code' as const },
  { key: 'default', label: 'Default', kind: 'code' as const },
  { key: 'description', label: 'Description' },
];

export const modalReference: DocsReference = {
  eyebrow: 'Actions',
  heading: 'Modal',
  maturity: 'planned',
  description:
    'A modal dialog from a template or a service, with typed results, close guards and a built-in confirmation. The native dialog element is used when the browser supports it.',
  facts: controlFacts('ng-template[zdModal]', 'modal-box', 'modal'),
  notice: plannedNotice,
  install: {
    description:
      'Import the template directive, or inject the service. The dialog box uses daisyUI’s modal-box class.',
    importCode: `import { ZdModal, ZdModalService, type ZdModalOptions } from '@pranxy/zordon-ui/modal';`,
    stylesCode: tailwindSource('modal-box'),
  },
  playgroundDescription:
    'Open it, then close with a button, Escape or a click on the backdrop. Focus returns to the button that opened it.',
  api: {
    description:
      'ZdModal opens a template while open is true. ZdModalService opens templates or a built-in confirmation from code and returns a ref.',
    tables: [
      {
        id: 'directive',
        heading: 'Template directive',
        caption: 'Modal directive inputs and outputs',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'open',
            type: 'boolean',
            description: 'Opens the template while true. Defaults to false.',
          },
          {
            name: 'options',
            type: 'ZdModalOptions<T>',
            description: 'Required: at least a label. Read once per opening.',
          },
          {
            name: 'openChange',
            type: 'boolean',
            description: 'Emits false for a permitted close. Leave open true to veto.',
          },
          {
            name: 'closed',
            type: 'ZdModalResult<T>',
            description: 'The accepted result: a reason and an optional value.',
          },
          {
            name: 'let-modal',
            type: 'ZdModalRef<T>',
            description: 'The template context: call `modal.close(value)` from your buttons.',
          },
        ],
      },
      {
        id: 'service',
        heading: 'Service and ref',
        caption: 'Modal service methods and ref members',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'type', label: 'Returns', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'open(template, options, vcr?)',
            type: 'ZdModalRef<T>',
            description: 'Opens now. Pass a ViewContainerRef to inherit direction and lifetime.',
          },
          {
            name: 'confirm(options, vcr?)',
            type: 'Promise<boolean>',
            description: 'Built-in message and buttons; true only when confirmed.',
          },
          {
            name: 'enqueue(template, options, vcr?)',
            type: 'Promise<ZdModalResult<T>>',
            description: 'Waits for earlier queued dialogs to close first.',
          },
          {
            name: 'ref.close(value?, reason?)',
            type: 'Promise<boolean>',
            description: 'Requests a close through the guard; resolves whether it closed.',
          },
          {
            name: 'ref.result',
            type: 'Promise<ZdModalResult<T>>',
            description: 'Resolves exactly once, including on destruction.',
          },
          {
            name: 'ref.pending() / error()',
            type: 'Signal',
            description: 'A guard or action is running / the last one failed.',
          },
        ],
      },
      {
        id: 'options',
        heading: 'Options',
        caption: 'Modal options',
        columns: optionColumns,
        rows: [
          {
            name: 'label',
            type: 'string',
            default: 'required',
            description: 'The dialog’s accessible name. Show a matching heading.',
          },
          {
            name: 'description',
            type: 'string',
            default: 'undefined',
            description: 'An accessible description.',
          },
          {
            name: 'backend',
            type: 'ZdModalBackend',
            default: "'auto'",
            description: 'Native dialog, or `overlay` when it holds Dropdowns or Tooltips.',
          },
          {
            name: 'size',
            type: 'ZdModalSize',
            default: "'md'",
            description: '`sm` 24rem, `md` 32rem, `lg` 48rem, or `full` screen.',
          },
          {
            name: 'placement',
            type: 'ZdModalPlacement',
            default: "'center'",
            description: '`center`, `top`, `bottom`, or logical `start`/`end`.',
          },
          {
            name: 'closeOnEscape / closeOnBackdrop',
            type: 'boolean',
            default: 'true',
            description: 'Whether those requests are allowed at all.',
          },
          {
            name: 'initialFocus',
            type: "'first' | 'dialog'",
            default: "'first'",
            description: 'First tabbable control, or the dialog itself.',
          },
          {
            name: 'beforeClose',
            type: '(result) => boolean | Promise<boolean>',
            default: 'undefined',
            description: 'A guard; return false to keep the dialog open.',
          },
          {
            name: 'message / confirmLabel / cancelLabel',
            type: 'string',
            default: "'Confirm' / 'Cancel'",
            description: 'Text for the built-in confirmation.',
          },
          {
            name: 'action / errorMessage',
            type: '() => void | Promise<void>',
            default: 'undefined',
            description: 'Work to run on confirm; a failure shows the error and keeps it open.',
          },
          {
            name: 'panelClass',
            type: 'string',
            default: 'undefined',
            description: 'Classes on the pane, for scoped styling.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/modal',
    typesCode: `export type ZdModalBackend = 'auto' | 'native' | 'overlay';
export type ZdModalSize = 'sm' | 'md' | 'lg' | 'full';
export type ZdModalPlacement = 'center' | 'top' | 'bottom' | 'start' | 'end';
export type ZdModalReason =
  | 'close' | 'escape' | 'backdrop' | 'submit' | 'confirm' | 'cancel' | 'destroy';
export interface ZdModalResult<T = unknown> {
  readonly reason: ZdModalReason;
  readonly value?: T;
}`,
  },
  accessibility: {
    description:
      'The native dialog provides modality, the dialog role and Escape. The overlay backend traps focus and makes the background inert instead.',
    features: [
      {
        title: 'Name it twice',
        body: 'label is the accessible name; show the same words as a visible heading.',
      },
      {
        title: 'Focus in, focus back',
        body: 'Focus moves to the first control on open and returns to the opener on close.',
      },
      {
        title: 'Escape asks',
        body: 'Escape and backdrop clicks are close requests that a guard can refuse, for unsaved work.',
      },
      {
        title: 'Failures stay visible',
        body: 'A failed confirm action keeps the dialog open with an alert, so people can retry.',
      },
    ],
    keyboard: {
      caption: 'Modal keyboard',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: 'Tab / Shift+Tab', action: 'Moves through the dialog’s controls only' },
        { key: 'Escape', action: 'Requests a close (reason escape)' },
        { key: 'Enter', action: 'Submits a method="dialog" form as a guarded submit' },
      ],
    },
  },
  customization: {
    description:
      'Style .zd-modal-pane, .zd-modal-dialog and .zd-modal-actions, or scope rules with panelClass. Don’t add daisyUI’s modal or modal-open classes: the dialog owns visibility.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.billing-modal .zd-modal-dialog {
  border-top: 4px solid var(--color-primary);
}`,
    },
  },
  ssr: 'Nothing is portaled on the server. A declarative modal opens only after hydration, and service calls on the server throw, so keep essential content in the page.',
};

export const modalPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'size',
    options: choices(['sm', 'md', 'lg', 'full']),
    defaultValue: 'md',
    omit: ['md'],
  },
  {
    kind: 'choice',
    key: 'placement',
    options: choices(['center', 'top', 'bottom', 'start', 'end']),
    defaultValue: 'center',
    omit: ['center'],
  },
  { kind: 'boolean', key: 'closeOnBackdrop', defaultValue: true },
];

/** Turns the playground's serialised attributes into an options object literal. */
function optionsLiteral(attributes: string): string {
  const entries = [...attributes.matchAll(/(\w+)="([^"]*)"/g)].map(
    ([, key, value]) => `, ${key}: '${value}'`,
  );
  const backdrop = /\bcloseOnBackdrop\b/.test(attributes) ? '' : ', closeOnBackdrop: false';
  return `{ label: 'Rename file'${entries.join('')}${backdrop} }`;
}

export const modalPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<button type="button" (click)="open.set(true)">Rename</button>
<ng-template
  zdModal
  [open]="open()"
  [options]="${optionsLiteral(attributes)}"
  (openChange)="open.set($event)"
  let-modal
>
  <h2>Rename file</h2>
  <button type="button" (click)="modal.close()">Done</button>
</ng-template>`,
};

export const formFiles = [
  {
    label: 'rename.html',
    language: 'html' as const,
    code: `<button type="button" (click)="editing.set(true)">Rename</button>
<ng-template
  zdModal
  [open]="editing()"
  [options]="{ label: 'Rename file' }"
  (openChange)="editing.set($event)"
  (closed)="onClosed($event)"
  let-modal
>
  <h2>Rename file</h2>
  <label>Name <input [formControl]="name" /></label>
  <div class="zd-modal-actions">
    <button type="button" (click)="modal.close()">Cancel</button>
    <button type="button" (click)="modal.close(name.value)">Save</button>
  </div>
</ng-template>`,
  },
  {
    label: 'rename.ts',
    language: 'ts' as const,
    code: `protected readonly editing = signal(false);
protected readonly name = new FormControl('report.pdf', { nonNullable: true });

protected onClosed(result: ZdModalResult<string>): void {
  if (result.value) this.fileName.set(result.value);
}`,
  },
];

export const confirmFiles = [
  {
    label: 'delete.ts',
    language: 'ts' as const,
    code: `private readonly modal = inject(ZdModalService);

protected async delete(): Promise<void> {
  const confirmed = await this.modal.confirm({
    label: 'Delete project',
    message: 'Delete “Website redesign” and its 12 files?',
    confirmLabel: 'Delete',
    cancelLabel: 'Keep it',
    action: () => this.api.deleteProject(),
  });
  if (confirmed) this.status.set('Deleted');
}`,
  },
];

export const guardFiles = [
  {
    label: 'notes.ts',
    language: 'ts' as const,
    code: `protected readonly options: ZdModalOptions<string> = {
  label: 'Edit notes',
  // Refuse Escape, backdrop and Cancel while there are unsaved changes
  beforeClose: result => result.reason === 'submit' || !this.notes.dirty,
};`,
  },
];
