import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  colorAndSizeTypes,
  colorControl,
  controlFacts,
  controlSizes,
  modifierClasses,
  plannedNotice,
  tailwindSource,
} from './form-controls.content';

/**
 * Loading reference content. Mirrors projects/components/loading/src/loading.ts and
 * docs/components/loading.md — update them together.
 */

export const loadingVariants = ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity'] as const;

export const loadingReference: DocsReference = {
  eyebrow: 'Feedback',
  heading: 'Loading',
  maturity: 'planned',
  description:
    'An indeterminate loading indicator: daisyUI artwork plus a status message for screen readers. It can wait before appearing, so quick work never flashes a spinner.',
  facts: controlFacts('zd-loading', 'loading', 'loading'),
  notice: plannedNotice,
  install: {
    description:
      'Import the component. The glyph lives inside it, so compile the daisyUI classes in your global stylesheet.',
    importCode: `import { ZdLoading } from '@pranxy/zordon-ui/loading';`,
    stylesCode: tailwindSource(
      modifierClasses('loading', {
        colors: false,
        extra: loadingVariants.map(variant => `loading-${variant}`),
      }),
    ),
  },
  playgroundDescription:
    'The label is announced, not shown, unless you set showLabel. Reduced motion swaps the animation for a static ring.',
  api: {
    description:
      'A standalone component. It shows work you track; it never marks regions busy or blocks input.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Loading inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'active',
            type: 'boolean',
            default: 'true',
            description:
              'Whether work is in progress. `false` clears the artwork and status at once.',
          },
          {
            name: 'variant',
            type: 'ZdLoadingVariant',
            default: "'spinner'",
            description: 'One of six daisyUI animations, or `custom` for projected artwork.',
          },
          {
            name: 'size',
            type: 'ZdLoadingSize',
            default: "'md'",
            description: 'Adds `loading-<size>`, `xs` to `xl`.',
          },
          {
            name: 'color',
            type: 'ZdLoadingColor',
            default: 'undefined',
            description: 'Colors the artwork with a theme role. Omit to inherit the text color.',
          },
          {
            name: 'layout',
            type: 'ZdLoadingLayout',
            default: "'inline'",
            description:
              '`center` fills the line; `overlay` covers the nearest positioned ancestor.',
          },
          {
            name: 'label',
            type: 'string',
            default: "'Loading'",
            description: 'The status message. Describe the work: "Loading results".',
          },
          {
            name: 'showLabel',
            type: 'boolean',
            default: 'false',
            description: 'Also shows the label next to the artwork.',
          },
          {
            name: 'decorative',
            type: 'boolean',
            default: 'false',
            description:
              'Removes the status role when something else already says what is happening.',
          },
          {
            name: 'delay',
            type: 'number',
            default: '0',
            description:
              'Milliseconds before anything appears. Work that ends sooner shows nothing.',
          },
        ],
      },
      {
        id: 'slots',
        heading: 'Content and state',
        caption: 'Loading projection selector and signals',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'zdLoadingCustom',
            description: 'Projection selector for your own artwork, with `variant="custom"`.',
          },
          {
            name: 'visible()',
            description:
              'True once active work has passed its delay. Export: `#loader="zdLoading"`.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/loading',
    typesCode: `export type ZdLoadingVariant =
  | 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity' | 'custom';
${colorAndSizeTypes('ZdLoading')}
export type ZdLoadingLayout = 'inline' | 'center' | 'overlay';`,
  },
  accessibility: {
    description:
      'The host is a status region that stays mounted; its hidden text fills in when the indicator appears.',
    features: [
      {
        title: 'Say what is loading',
        body: '"Loading results" beats "Loading". The label is read once, when the indicator appears.',
      },
      {
        title: 'Busy is yours',
        body: 'Set aria-busy on the region being updated, and keep the loader outside it so its status is heard.',
      },
      {
        title: 'Artwork is hidden',
        body: 'Animation and visible label are aria-hidden, so nothing is read twice or focusable.',
      },
      {
        title: 'Motion respected',
        body: 'Reduced motion and forced colors replace every animation with a static ring.',
      },
    ],
  },
  customization: {
    description:
      'Custom artwork owns its size and animation. It can read --zd-loading-size (4 to 8) to match the built-in sizes.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.my-loader {
  inline-size: calc(var(--size-selector, 0.25rem) * var(--zd-loading-size));
  animation: my-spin 1.2s linear infinite;
}`,
    },
  },
  ssr: 'Server and browser render the same thing for the same inputs. Active loaders without a delay show immediately; delays run only in the browser, so a delayed loader renders empty until then.',
};

export const loadingPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'variant',
    options: loadingVariants.map(value => ({ value, label: value })),
    defaultValue: 'spinner',
    omit: ['spinner'],
  },
  {
    kind: 'choice',
    key: 'size',
    options: controlSizes.map(value => ({ value, label: value })),
    defaultValue: 'lg',
    omit: ['md'],
  },
  colorControl,
  { kind: 'boolean', key: 'showLabel', defaultValue: true },
];

export const loadingPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-loading${attributes} label="Loading results" />`,
};

export const variantsCode = loadingVariants
  .map(variant => `<zd-loading variant="${variant}" label="Loading (${variant})" />`)
  .join('\n');

export const loadingSizes = controlSizes;

export const delayFiles = [
  {
    label: 'results.html',
    language: 'html' as const,
    code: `<button type="button" (click)="search()">Run search</button>
<zd-loading [active]="busy()" [delay]="400" label="Searching" showLabel />
<section aria-label="Results" [attr.aria-busy]="busy()">…</section>`,
  },
  {
    label: 'results.ts',
    language: 'ts' as const,
    code: `protected readonly busy = signal(false);

protected search(): void {
  this.busy.set(true);
  setTimeout(() => this.busy.set(false), 2000);
}`,
  },
];

export const overlayCode = `<!-- .card { position: relative } -->
<div class="card">
  <p>Weekly signups</p>
  <strong>1,284</strong>
  <!-- Doesn't block the content underneath -->
  <zd-loading [active]="refreshing()" layout="overlay" label="Refreshing chart" showLabel />
</div>`;

export const customCode = `<zd-loading variant="custom" label="Preparing export" showLabel>
  <span zdLoadingCustom class="my-loader">◇</span>
</zd-loading>`;
