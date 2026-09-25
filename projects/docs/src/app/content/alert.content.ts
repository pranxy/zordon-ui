import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Alert reference content. Mirrors projects/components/alert/src/alert.ts and
 * docs/components/alert.md — update them together.
 */

/** Keeps the tint and border of the lighter variants but uses readable text. */
export const alertContrastCss = `zd-alert:is(.alert-soft, .alert-outline, .alert-dash) {
  color: var(--color-base-content);
}`;

export const alertColors = ['info', 'success', 'warning', 'error'] as const;
export const alertVariants = ['soft', 'outline', 'dash'] as const;

export const alertReference: DocsReference = {
  eyebrow: 'Feedback',
  heading: 'Alert',
  maturity: 'planned',
  description:
    'An inline message with an icon, title, body, actions and optional native details. Dismissal is a request you accept, so you decide when an alert goes away.',
  facts: controlFacts('zd-alert', 'alert', 'alert'),
  notice: plannedNotice,
  install: {
    description:
      'Import the component. Layout and the close button are built in; register the daisyUI classes it adds.',
    importCode: `import { ZdAlert } from '@pranxy/zordon-ui/alert';`,
    stylesCode: tailwindSource(
      'alert alert-info alert-success alert-warning alert-error alert-soft alert-outline alert-dash alert-horizontal alert-vertical',
    ),
  },
  playgroundDescription:
    'Color and urgency are separate: color changes the look, announcement changes what screen readers hear.',
  api: {
    description:
      'A standalone component. Content goes into named projection slots; no extra directives to import.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Alert inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'color',
            type: 'ZdAlertColor',
            default: 'undefined',
            description: 'Adds `alert-<color>`. Omit for the neutral style.',
          },
          {
            name: 'variant',
            type: 'ZdAlertVariant',
            default: 'undefined',
            description: '`soft`, `outline` or `dash`. Omit for the filled style.',
          },
          {
            name: 'direction',
            type: 'ZdAlertDirection',
            default: "'responsive'",
            description:
              'Stacked below 40rem and in a row above it, or always `horizontal`/`vertical`.',
          },
          {
            name: 'announcement',
            type: 'ZdAlertAnnouncement',
            default: "'off'",
            description: '`polite` sets `role="status"`, `assertive` sets `role="alert"`.',
          },
          {
            name: 'open',
            type: 'boolean',
            default: 'true',
            description: 'Yours to own. A closed alert is hidden and inert but keeps its content.',
          },
          {
            name: 'dismissible',
            type: 'boolean',
            default: 'false',
            description: 'Shows a native close button with a 44px target.',
          },
          {
            name: 'dismissLabel',
            type: 'string',
            default: "'Dismiss alert'",
            description: 'Accessible name of the close button. Localize it.',
          },
          {
            name: 'autoDismiss',
            type: 'number',
            default: '0',
            description:
              'Milliseconds of visible, unhovered, unfocused time before one close request. 0 disables.',
          },
        ],
      },
      {
        id: 'outputs',
        heading: 'Outputs and methods',
        caption: 'Alert outputs and methods',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'openChange',
            type: 'boolean',
            description: 'Emits `false` for a close request. Set `open` to accept; ignore to veto.',
          },
          {
            name: 'dismissRequested',
            type: 'ZdAlertDismissReason',
            description: 'Why: `close-button`, `timeout` or `api`. Emits before `openChange`.',
          },
          {
            name: 'dismiss(reason?)',
            type: '() => void',
            description: 'Requests a close with reason `api`. Template export: `#alert="zdAlert"`.',
          },
        ],
      },
      {
        id: 'slots',
        heading: 'Content slots',
        caption: 'Alert projection selectors',
        columns: [
          { key: 'name', label: 'Attribute', kind: 'name' },
          { key: 'description', label: 'Content' },
        ],
        rows: [
          {
            name: 'zdAlertIcon',
            description: 'Decorative icon; hidden from assistive technology.',
          },
          { name: 'zdAlertTitle', description: 'A heading or strong text, at a level that fits.' },
          { name: '(default)', description: 'Body text and other native content.' },
          {
            name: 'zdAlertDetails',
            description: 'A native `details` element for more information.',
          },
          { name: 'zdAlertActions', description: 'Buttons or links; the close button joins them.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/alert',
    typesCode: `export type ZdAlertColor = 'info' | 'success' | 'warning' | 'error';
export type ZdAlertVariant = 'soft' | 'outline' | 'dash';
export type ZdAlertDirection = 'horizontal' | 'vertical' | 'responsive';
export type ZdAlertAnnouncement = 'off' | 'polite' | 'assertive';
export type ZdAlertDismissReason = 'close-button' | 'timeout' | 'api';`,
  },
  accessibility: {
    description:
      'Alerts are silent by default. Turn on announcement only for messages that appear while someone is using the page.',
    features: [
      {
        title: 'Static by default',
        body: 'announcement="off" adds no role, so a notice already on the page doesn’t interrupt anyone.',
      },
      {
        title: 'Polite for routine news',
        body: 'Use assertive only for urgent problems. Color never implies urgency.',
      },
      {
        title: 'No surprise focus moves',
        body: 'Alert never moves focus. If you close one that holds focus, move focus somewhere sensible.',
      },
      {
        title: 'Don’t time out what matters',
        body: 'Leave autoDismiss at 0 for errors and anything with an action people need to take.',
      },
    ],
  },
  customization: {
    description:
      'Your classes and styles stay on the host. daisyUI colors soft, outline and dash text with the status color, which can fail contrast on light themes; check yours, and fall back to the base text color if needed. This page does.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: alertContrastCss,
    },
  },
  ssr: 'The server renders the message, details, actions and role. Timers start only in the browser, after the first render, and native details open without JavaScript.',
};

const withoutDefault = (values: readonly string[]) =>
  ['default', ...values].map(value => ({ value, label: value }));

export const alertPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'color',
    options: withoutDefault(alertColors),
    defaultValue: 'info',
    omit: ['default'],
  },
  {
    kind: 'choice',
    key: 'variant',
    options: withoutDefault(alertVariants),
    defaultValue: 'default',
    omit: ['default'],
  },
  {
    kind: 'choice',
    key: 'direction',
    options: ['responsive', 'horizontal', 'vertical'].map(value => ({ value, label: value })),
    defaultValue: 'responsive',
    omit: ['responsive'],
  },
  { kind: 'boolean', key: 'dismissible', defaultValue: true },
];

export const alertPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-alert${attributes} [open]="open()" (openChange)="open.set($event)">
  <span zdAlertIcon>ⓘ</span>
  <strong zdAlertTitle>Update available</strong>
  <p>Save your work before installing.</p>
</zd-alert>`,
};

export const colorsCode = [
  ...alertColors.map(color => `<zd-alert color="${color}">…</zd-alert>`),
  ...alertVariants.map(variant => `<zd-alert color="success" variant="${variant}">…</zd-alert>`),
].join('\n');

export const dismissalFiles = [
  {
    label: 'saved.html',
    language: 'html' as const,
    code: `<zd-alert
  color="success"
  variant="soft"
  dismissible
  dismissLabel="Dismiss saved message"
  [open]="open()"
  (openChange)="open.set($event)"
  (dismissRequested)="reason.set($event)"
>
  <strong zdAlertTitle>Changes saved</strong>
  <p>Your profile is up to date.</p>
</zd-alert>`,
  },
  {
    label: 'saved.ts',
    language: 'ts' as const,
    code: `protected readonly open = signal(true);
protected readonly reason = signal<ZdAlertDismissReason | null>(null);`,
  },
];

export const autoDismissCode = `<!-- Pauses while hovered, focused or in a hidden tab -->
<zd-alert
  color="info"
  announcement="polite"
  dismissible
  [autoDismiss]="6000"
  [open]="open()"
  (openChange)="open.set($event)"
>
  <p>Link copied to the clipboard.</p>
</zd-alert>`;

export const actionsCode = `<zd-alert color="warning" variant="outline" direction="horizontal">
  <span zdAlertIcon>⚠</span>
  <strong zdAlertTitle>Storage almost full</strong>
  <p>You have used 9.2 GB of 10 GB.</p>
  <details zdAlertDetails>
    <summary>What counts toward storage?</summary>
    <p>Files, attachments and version history.</p>
  </details>
  <div zdAlertActions>
    <button zdButton type="button" size="sm">Manage storage</button>
  </div>
</zd-alert>`;
