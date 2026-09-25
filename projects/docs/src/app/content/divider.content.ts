import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  apiColumns,
  colorControl,
  colorRow,
  controlFacts,
  modifierClasses,
  plannedNotice,
  tailwindSource,
} from './form-controls.content';

/**
 * Divider reference content. Mirrors projects/components/divider/src/divider.ts and
 * docs/components/divider.md — update them together.
 */

export const dividerReference: DocsReference = {
  eyebrow: 'Layout',
  heading: 'Divider',
  maturity: 'planned',
  description:
    'daisyUI’s separator line on your own element: an hr for a real thematic break, or a div with a short label such as “OR”.',
  facts: controlFacts('[zdDivider]', 'divider', 'divider'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdDivider } from '@pranxy/zordon-ui/divider';`,
    stylesCode: tailwindSource(
      modifierClasses('divider', {
        sizes: false,
        extra: ['divider-vertical', 'divider-horizontal', 'divider-start', 'divider-end'],
      }),
    ),
  },
  playgroundDescription:
    'daisyUI names the direction by layout: vertical divides stacked blocks with a horizontal line, horizontal divides blocks side by side.',
  api: {
    description: 'A standalone directive. It adds classes only and never a role.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Divider inputs',
        columns: apiColumns,
        rows: [
          colorRow('ZdColor', 'divider'),
          {
            name: 'orientation',
            type: 'ZdDividerOrientation',
            default: 'undefined',
            description:
              '`vertical` (stacked blocks) or `horizontal` (side by side) adds `divider-<orientation>`.',
          },
          {
            name: 'placement',
            type: 'ZdDividerPlacement',
            default: 'undefined',
            description: '`start` or `end` pushes a label to that side; `center` adds nothing.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/divider',
    typesCode: `export type ZdDividerOrientation = 'vertical' | 'horizontal';
export type ZdDividerPlacement = 'start' | 'center' | 'end';
// provideZordonUi({}, withDividerDefaults({ color: 'neutral' }))`,
  },
  accessibility: {
    description:
      'Divider never adds role="separator" or aria-hidden. The element you choose decides what assistive technology hears.',
    features: [
      {
        title: 'hr for a break',
        body: 'An empty hr is announced as a separator between topics.',
      },
      {
        title: 'Labels are text',
        body: 'A labelled div reads its text, such as “OR”. Make sure the word helps.',
      },
      {
        title: 'Decoration',
        body: 'A purely visual line on a div can be hidden with aria-hidden="true".',
      },
      {
        title: 'Logical sides',
        body: 'start and end follow the text direction, so labels flip in right-to-left pages.',
      },
    ],
  },
  customization: {
    description:
      'Set app-wide defaults with withDividerDefaults. Responsive direction is a Tailwind class, registered with the others.',
    code: {
      label: 'checkout.html',
      language: 'html',
      code: `<div class="options">
  <section>Delivery</section>
  <div zdDivider class="md:divider-horizontal">OR</div>
  <section>Pickup</section>
</div>`,
    },
  },
  ssr: 'The directive only adds classes, so the server renders the finished divider.',
};

export const dividerPlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  {
    kind: 'choice',
    key: 'orientation',
    options: ['vertical', 'horizontal'].map(value => ({ value, label: value })),
    defaultValue: 'vertical',
    omit: ['vertical'],
  },
  {
    kind: 'choice',
    key: 'placement',
    options: ['start', 'center', 'end'].map(value => ({ value, label: value })),
    defaultValue: 'center',
    omit: ['center'],
  },
];

export const dividerPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<section>Sign in with email</section>
<div zdDivider${attributes}>OR</div>
<section>Continue with a passkey</section>`,
};

export const breakFiles = [
  {
    label: 'billing.html',
    language: 'html' as const,
    code: `<p>Billing contact: Ada Lovelace, ada@example.com.</p>
<hr zdDivider />
<p>Invoices are sent on the first working day of the month.</p>`,
  },
  {
    label: 'styles.css',
    language: 'css' as const,
    code: `/* An hr brings its own border; daisyUI draws the line itself */
hr.divider {
  border: 0;
}`,
  },
];

export const responsiveCode = `<div class="options">
  <section class="option">Delivery · 2 days</section>
  <div zdDivider class="md:divider-horizontal">OR</div>
  <section class="option">Pickup · today</section>
</div>`;
