import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { colorControl, controlFacts, plannedNotice, tailwindSource } from './form-controls.content';
import { valueControl } from './progress.content';

/**
 * Radial Progress reference content. Mirrors
 * projects/components/radial-progress/src/radial-progress.ts and docs/components/radial-progress.md
 * — update them together.
 */

export const radialSizes = ['4rem', '5rem', '7rem'] as const;

export const radialProgressReference: DocsReference = {
  eyebrow: 'Feedback',
  heading: 'Radial Progress',
  maturity: 'planned',
  description:
    'A ring that fills as work completes, with a center label and optional color thresholds. The host is a named progressbar; the ring is decoration.',
  facts: controlFacts('zd-radial-progress', 'radial-progress', 'radial-progress'),
  notice: plannedNotice,
  install: {
    description: 'Import the component, and register daisyUI’s ring class.',
    importCode: `import {
  ZdRadialProgress,
  type ZdRadialProgressFormatter,
  type ZdRadialProgressThreshold,
} from '@pranxy/zordon-ui/radial-progress';`,
    stylesCode: tailwindSource('radial-progress'),
  },
  playgroundDescription:
    'The center shows the same text screen readers hear. An unknown value spins a quarter ring.',
  api: {
    description:
      'A standalone component. Size and thickness are CSS lengths; numbers use property bindings.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Radial Progress inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'label',
            type: 'string',
            default: 'required',
            description: 'Accessible name of the progressbar.',
          },
          {
            name: 'value',
            type: 'number | null',
            default: 'null',
            description: 'Clamped to 0–max. `null` means the total is unknown.',
          },
          { name: 'max', type: 'number', default: '100', description: 'A positive total.' },
          {
            name: 'size',
            type: 'string',
            default: "'5rem'",
            description: 'Ring diameter. Use a definite length, not a percentage.',
          },
          {
            name: 'thickness',
            type: 'string',
            default: "'calc(var(--size) / 10)'",
            description: 'Ring width; keep it under half the diameter.',
          },
          {
            name: 'color',
            type: 'ZdRadialProgressColor',
            default: 'undefined',
            description: 'Ring color. Center text keeps the surrounding color for contrast.',
          },
          {
            name: 'thresholds',
            type: 'readonly ZdRadialProgressThreshold[]',
            default: '[]',
            description: 'Colors from a percentage up, e.g. warning at 50, success at 80.',
          },
          {
            name: 'animated',
            type: 'boolean',
            default: 'true',
            description: '`false` stops the value transition and the unknown-total spin.',
          },
          {
            name: 'format',
            type: 'ZdRadialProgressFormatter',
            default: 'percentage',
            description: 'Builds `aria-valuetext` and the default center label.',
          },
        ],
      },
      {
        id: 'slots',
        heading: 'Content and state',
        caption: 'Radial Progress projection selectors and signals',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          { name: 'zdRadialProgressIcon', description: 'Decorative artwork in the center.' },
          {
            name: 'zdRadialProgressLabel',
            description: 'Replaces the center text. The accessible value still comes from format.',
          },
          {
            name: 'state() / complete()',
            description: 'Clamped value, max, percent and completion.',
          },
          { name: 'resolvedColor()', description: 'The color after thresholds are applied.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/radial-progress',
    typesCode: `export type ZdRadialProgressColor =
  | 'neutral' | 'primary' | 'secondary' | 'accent'
  | 'info' | 'success' | 'warning' | 'error';
export interface ZdRadialProgressThreshold {
  readonly at: number; // inclusive percentage, 0–100
  readonly color: ZdRadialProgressColor;
}
export interface ZdRadialProgressState {
  readonly value: number | null;
  readonly max: number;
  readonly percent: number | null;
  readonly complete: boolean;
}
export type ZdRadialProgressFormatter = (state: ZdRadialProgressState) => string;`,
  },
  accessibility: {
    description:
      'The host has role="progressbar" with a name, range and value text. The ring and the center are hidden from assistive technology.',
    features: [
      {
        title: 'Required name',
        body: 'label names the bar. A projected center label is visual only.',
      },
      {
        title: 'Say it in the text',
        body: 'If the center shows words, return the same words from format.',
      },
      {
        title: 'Color is a hint',
        body: 'Thresholds change the ring only. The value text must carry the meaning.',
      },
      {
        title: 'Nothing interactive',
        body: 'The center is inert. Put buttons and links next to the ring, not in it.',
      },
    ],
  },
  customization: {
    description:
      'Size and thickness map to daisyUI’s ring variables. Forced colors swap the gradient for a plain outline and keep the text.',
    code: {
      label: 'dashboard.html',
      language: 'html',
      code: `<zd-radial-progress label="Quota" [value]="72" size="10rem" thickness="0.75rem" />`,
    },
  },
  ssr: 'The server renders the role, name, value and center text. Percentages are computed from inputs, so the server and first client render agree.',
};

export const radialPlaygroundControls: readonly PlaygroundControl[] = [
  valueControl('70'),
  colorControl,
  {
    kind: 'choice',
    key: 'size',
    options: radialSizes.map(value => ({ value, label: value })),
    defaultValue: '5rem',
    omit: ['5rem'],
  },
];

export const radialPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-radial-progress label="Download"${attributes} />`,
};

export const thresholdsFiles = [
  {
    label: 'battery.html',
    language: 'html' as const,
    code: `<zd-radial-progress
  label="Battery"
  color="error"
  [value]="charge()"
  [thresholds]="thresholds"
/>`,
  },
  {
    label: 'battery.ts',
    language: 'ts' as const,
    code: `protected readonly charge = signal(20);
protected readonly thresholds: readonly ZdRadialProgressThreshold[] = [
  { at: 30, color: 'warning' },
  { at: 70, color: 'success' },
];`,
  },
];

export const centerCode = `<zd-radial-progress label="Archive" [value]="100" color="success">
  <span zdRadialProgressIcon>✓</span>
  <bdi zdRadialProgressLabel>Done</bdi>
</zd-radial-progress>`;

export const formatFiles = [
  {
    label: 'files.html',
    language: 'html' as const,
    code: `<zd-radial-progress label="Files" [value]="12" [max]="40" [format]="files" size="7rem" />`,
  },
  {
    label: 'files.ts',
    language: 'ts' as const,
    code: `protected readonly files: ZdRadialProgressFormatter = state =>
  state.value === null ? 'Counting files' : \`\${state.value} of \${state.max} files\`;`,
  },
];
