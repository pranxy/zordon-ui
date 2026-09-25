import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { apiColumns, controlFacts, plannedNotice } from './form-controls.content';

/**
 * Drawer reference content. Mirrors projects/components/drawer/src/drawer.ts and
 * docs/components/drawer.md — update them together.
 */

export const drawerReference: DocsReference = {
  eyebrow: 'Layout',
  heading: 'Drawer',
  maturity: 'planned',
  description:
    'A side panel beside your content: a modal dialog on small screens, an inline sidebar on wide ones. Open state stays in your signal.',
  facts: controlFacts('zd-drawer', 'drawer', 'drawer'),
  notice: plannedNotice,
  install: {
    description:
      'Import the component and the panel template directive. Drawer ships its own layout CSS; it does not use daisyUI’s checkbox drawer.',
    importCode: `import { ZdDrawer, ZdDrawerPanel } from '@pranxy/zordon-ui/drawer';`,
  },
  playgroundDescription:
    'Modal traps focus and closes with Escape or the backdrop. Persistent and push keep the panel in the page as a named landmark.',
  api: {
    description:
      'A component with a lazy `ng-template[zdDrawerPanel]`. Everything else you project becomes the main content.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Drawer inputs',
        columns: apiColumns,
        rows: [
          {
            name: 'open',
            type: 'boolean',
            default: 'false',
            description:
              'Accepted state. Interaction never changes it; accept requests from openChange.',
          },
          {
            name: 'mode',
            type: 'ZdDrawerMode',
            default: "'modal'",
            description:
              '`modal`, `persistent`, `push`, or `responsive` (modal below the breakpoint).',
          },
          {
            name: 'desktopMode',
            type: 'ZdDrawerInlineMode',
            default: "'persistent'",
            description: 'Responsive mode at or above the breakpoint: `persistent` or `push`.',
          },
          {
            name: 'side',
            type: 'ZdDrawerSide',
            default: "'start'",
            description: 'Logical `start` or `end`; follows the text direction.',
          },
          {
            name: 'label',
            type: 'string',
            default: "'Drawer'",
            description: 'Name of the modal dialog or the inline landmark.',
          },
          {
            name: 'width',
            type: 'number',
            default: '320',
            description: 'Panel width in CSS pixels; inline panels are capped at 45%.',
          },
          {
            name: 'breakpoint',
            type: 'number',
            default: '768',
            description: 'Viewport width in CSS pixels where responsive mode goes inline.',
          },
          {
            name: 'closeOnEscape / closeOnBackdrop',
            type: 'boolean',
            default: 'true',
            description: 'Whether modal Escape and backdrop clicks request closing.',
          },
          {
            name: 'closeOnNavigation',
            type: 'boolean',
            default: 'false',
            description: 'Request closing after each successful Router navigation.',
          },
          {
            name: 'swipe / closeLabel',
            type: 'boolean / string',
            default: "false / 'Close drawer'",
            description: 'Adds a labelled close button that also accepts an outward swipe.',
          },
        ],
      },
      {
        id: 'outputs',
        heading: 'Outputs and members',
        caption: 'Drawer outputs and members',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          { name: 'openChange', description: 'Emits `false` when closing is requested.' },
          {
            name: 'closeRequest',
            description:
              'Emits the reason first: `close`, `escape`, `backdrop`, `navigation` or `swipe`.',
          },
          { name: 'requestClose(reason?)', description: 'Requests closing from code.' },
          { name: 'panelId', description: 'Stable id for your trigger’s aria-controls.' },
          { name: 'effectiveMode()', description: 'The mode in use right now.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/drawer',
    typesCode: `export type ZdDrawerMode = 'modal' | 'persistent' | 'push' | 'responsive';
export type ZdDrawerInlineMode = 'persistent' | 'push';
export type ZdDrawerSide = 'start' | 'end';
export type ZdDrawerReason = 'close' | 'escape' | 'backdrop' | 'navigation' | 'swipe';
export interface ZdDrawerContext {
  readonly $implicit: () => void; // close request
}`,
  },
  accessibility: {
    description:
      'Modal mode reuses Modal: a named dialog, trapped focus, Escape, scroll lock and focus return. Inline modes are named complementary landmarks.',
    features: [
      {
        title: 'Wire the trigger',
        body: 'Give your button aria-controls="drawer.panelId" and aria-expanded from your signal.',
      },
      {
        title: 'Focus goes in and back',
        body: 'The first control in the modal panel gets focus; closing returns it to the trigger.',
      },
      {
        title: 'Name it',
        body: 'label names the dialog or landmark. Keep it short, such as “Project navigation”.',
      },
      {
        title: 'Requests, not changes',
        body: 'If you ignore a close request the drawer stays open, focus stays trapped, and nothing else happens.',
      },
    ],
    keyboard: {
      caption: 'Drawer keyboard (modal mode)',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: 'Tab / Shift+Tab', action: 'Moves focus within the open panel' },
        { key: 'Escape', action: 'Requests closing with reason escape' },
      ],
    },
  },
  customization: {
    description:
      'Panel contents, colors and the trigger are yours. The --zd-drawer-width variable follows the width input.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `zd-drawer .zd-drawer-inline,
.zd-drawer-surface {
  background: var(--color-base-100);
  border-inline-end: 1px solid var(--color-base-300);
}`,
    },
  },
  ssr: 'Open persistent and push panels render on the server. Modal panels exist only in the browser, and responsive mode starts in its desktop layout until hydration measures the viewport.',
};

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const drawerPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'mode',
    options: choices(['modal', 'persistent', 'push', 'responsive']),
    defaultValue: 'persistent',
  },
  {
    kind: 'choice',
    key: 'side',
    options: choices(['start', 'end']),
    defaultValue: 'start',
    omit: ['start'],
  },
];

export const drawerPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<button
  zdButton
  type="button"
  [attr.aria-controls]="drawer.panelId"
  [attr.aria-expanded]="open()"
  (click)="open.set(!open())"
>
  Navigation
</button>
<zd-drawer
  #drawer
  label="Project navigation"${attributes.replace(/ (\w+)=/g, '\n  $1=')}
  [open]="open()"
  (openChange)="open.set($event)"
>
  <ng-template zdDrawerPanel let-close>
    <nav aria-label="Project sections">…</nav>
    <button type="button" (click)="close()">Close</button>
  </ng-template>
  <div>Main content</div>
</zd-drawer>`,
};

export const guardFiles = [
  {
    label: 'editor.html',
    language: 'html' as const,
    code: `<zd-drawer
  label="Edit profile"
  side="end"
  [open]="open()"
  (closeRequest)="reason.set($event)"
  (openChange)="requestClose()"
>
  <ng-template zdDrawerPanel let-close>
    <label>Name <input [value]="name()" (input)="edit($event)" /></label>
    @if (blocked()) {
      <p role="status">You have unsaved changes.</p>
      <button type="button" (click)="discard()">Discard changes</button>
    }
    <button type="button" (click)="save()">Save</button>
    <button type="button" (click)="close()">Close</button>
  </ng-template>
</zd-drawer>`,
  },
  {
    label: 'editor.ts',
    language: 'ts' as const,
    code: `protected readonly open = signal(false);
protected readonly dirty = signal(false);
protected readonly blocked = signal(false);
protected readonly reason = signal<ZdDrawerReason | null>(null);

protected requestClose(): void {
  // Ignoring the request keeps the drawer open, with focus still inside.
  if (this.dirty()) this.blocked.set(true);
  else this.open.set(false);
}`,
  },
];
