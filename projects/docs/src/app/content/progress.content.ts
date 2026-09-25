import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  colorControl,
  controlFacts,
  modifierClasses,
  plannedNotice,
  tailwindSource,
} from './form-controls.content';

/**
 * Progress reference content. Mirrors projects/components/progress/src/progress.ts and
 * docs/components/progress.md — update them together.
 */

/** Playground value choices; "null" is an unknown total. */
export const progressValues = ['null', '0', '35', '70', '100'] as const;

/** The `[value]` playground control, shared with Radial Progress. */
export function valueControl(defaultValue: (typeof progressValues)[number]): PlaygroundControl {
  return {
    kind: 'choice',
    key: '[value]',
    options: progressValues.map(value => ({ value, label: value === 'null' ? 'unknown' : value })),
    defaultValue,
    omit: ['null'],
  };
}

/** Reads the playground's value choice as a number, or null for an unknown total. */
export function progressValueOf(value: unknown): number | null {
  return value === 'null' ? null : Number(value);
}

export const progressReference: DocsReference = {
  eyebrow: 'Feedback',
  heading: 'Progress',
  maturity: 'planned',
  description:
    'A labelled native progress bar for work with a known or unknown total, with an optional buffer and your own value text.',
  facts: controlFacts('zd-progress', 'progress', 'progress'),
  notice: plannedNotice,
  install: {
    description: 'Import the component, and register the daisyUI classes it adds.',
    importCode: `import { ZdProgress, type ZdProgressFormatter } from '@pranxy/zordon-ui/progress';`,
    stylesCode: tailwindSource(modifierClasses('progress', { sizes: false })),
  },
  playgroundDescription:
    'Bind numbers with property syntax. An unknown value makes the bar indeterminate.',
  api: {
    description:
      'A standalone component around one native progress element. Invalid numbers and blank labels throw a RangeError.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Progress inputs',
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
            description: 'Accessible name of the bar, and the visible caption.',
          },
          {
            name: 'value',
            type: 'number | null',
            default: 'null',
            description: 'Clamped to 0–max. `null` means the total is unknown.',
          },
          {
            name: 'max',
            type: 'number',
            default: '100',
            description: 'A positive total, in your own units.',
          },
          {
            name: 'buffer',
            type: 'number | null',
            default: 'null',
            description: 'A decorative second bar, clamped between value and max.',
          },
          {
            name: 'color',
            type: 'ZdProgressColor',
            default: 'undefined',
            description: 'Adds `progress-<color>`.',
          },
          {
            name: 'showLabel',
            type: 'boolean',
            default: 'true',
            description:
              'Shows the label and value text above the bar. The name stays when hidden.',
          },
          {
            name: 'animated',
            type: 'boolean',
            default: 'true',
            description: '`false` stops the indeterminate animation and value transitions.',
          },
          {
            name: 'format',
            type: 'ZdProgressFormatter',
            default: 'percentage',
            description: 'Builds the visible value text and `aria-valuetext`. Keep it pure.',
          },
        ],
      },
      {
        id: 'state',
        heading: 'State',
        caption: 'Progress signals',
        columns: [
          { key: 'name', label: 'Signal', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'state()',
            type: 'ZdProgressState',
            description: 'Clamped value, max, percent, buffer and completion.',
          },
          {
            name: 'complete()',
            type: 'boolean',
            description: 'True whenever value equals max. There is no completion event.',
          },
          { name: 'text()', type: 'string', description: 'The formatted value text.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/progress',
    typesCode: `export type ZdProgressColor =
  | 'neutral' | 'primary' | 'secondary' | 'accent'
  | 'info' | 'success' | 'warning' | 'error';
export interface ZdProgressState {
  readonly value: number | null;
  readonly max: number;
  readonly percent: number | null;
  readonly buffer: number | null;
  readonly complete: boolean;
}
export type ZdProgressFormatter = (state: ZdProgressState) => string;`,
  },
  accessibility: {
    description:
      'The native progress element is the progressbar: it carries the name, value and value text.',
    features: [
      {
        title: 'Name every bar',
        body: 'label is required and becomes the bar’s accessible name, even with showLabel off.',
      },
      {
        title: 'Words, not just percent',
        body: 'Use format for units ("12 of 40 files"). The same text is shown and announced.',
      },
      {
        title: 'Don’t announce every tick',
        body: 'Progress is not a live region. Announce the start, failure and completion yourself.',
      },
      {
        title: 'The buffer is decoration',
        body: 'It never changes the announced value. Put it in format if it matters.',
      },
    ],
  },
  customization: {
    description:
      'The bar fills the host’s width; size the host. Reduced motion stops the animation, and forced colors restore the native look.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `zd-progress.upload {
  max-inline-size: 24rem;
}`,
    },
  },
  ssr: 'The server renders the native element with its value, name and text. Keep formatters pure so the first client render matches the server.',
};

export const progressPlaygroundControls: readonly PlaygroundControl[] = [
  valueControl('35'),
  colorControl,
  {
    kind: 'choice',
    key: '[showLabel]',
    options: ['true', 'false'].map(value => ({ value, label: value })),
    defaultValue: 'true',
    omit: ['true'],
  },
];

export const progressPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-progress label="Upload"${attributes} />`,
};

export const uploadFiles = [
  {
    label: 'upload.html',
    language: 'html' as const,
    code: `<zd-progress
  #upload
  label="Upload"
  color="primary"
  [value]="sent()"
  [buffer]="sent() + 50"
  [max]="200"
  [format]="megabytes"
/>
<p>{{ upload.complete() ? 'Upload complete' : 'Upload pending' }}</p>`,
  },
  {
    label: 'upload.ts',
    language: 'ts' as const,
    code: `protected readonly sent = signal(0);
protected readonly megabytes: ZdProgressFormatter = state =>
  state.value === null ? 'Waiting for total' : \`\${state.value} of \${state.max} MB\`;`,
  },
];

export const indeterminateCode = `<!-- No value: the total is unknown -->
<zd-progress label="Preparing export" />
<zd-progress label="Preparing export" [animated]="false" />`;

export const colorsCode = `<zd-progress label="Neutral" color="neutral" [value]="40" />
<zd-progress label="Success" color="success" [value]="60" />
<zd-progress label="Warning" color="warning" [value]="80" />
<zd-progress label="Error" color="error" [value]="100" [showLabel]="false" />`;
