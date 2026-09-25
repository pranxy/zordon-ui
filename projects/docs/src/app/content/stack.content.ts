import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { apiColumns, controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Stack reference content. Mirrors projects/components/stack/src/stack.ts and
 * docs/components/stack.md — update them together.
 */

export const stackReference: DocsReference = {
  eyebrow: 'Layout',
  heading: 'Stack',
  maturity: 'planned',
  description:
    'daisyUI’s layered pile: direct children sit on top of each other with the rest peeking out. Order and meaning stay in your markup.',
  facts: controlFacts('[zdStack]', 'stack', 'stack'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdStack } from '@pranxy/zordon-ui/stack';`,
    stylesCode: tailwindSource('stack stack-top stack-bottom stack-start stack-end'),
  },
  playgroundDescription:
    'The first child is on top. Alignment chooses the side the others peek out from; the default is the bottom.',
  api: {
    description: 'A standalone directive with two alignment inputs.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Stack inputs',
        columns: apiColumns,
        rows: [
          {
            name: 'verticalAlignment',
            type: 'ZdStackVerticalAlignment',
            default: 'undefined',
            description: '`top` or `bottom` adds `stack-<alignment>`.',
          },
          {
            name: 'horizontalAlignment',
            type: 'ZdStackHorizontalAlignment',
            default: 'undefined',
            description: '`start` or `end` adds `stack-<alignment>`.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/stack',
    typesCode: `export type ZdStackVerticalAlignment = 'top' | 'bottom';
export type ZdStackHorizontalAlignment = 'start' | 'end';`,
  },
  accessibility: {
    description:
      'Stack is visual. Screen readers read every layer in DOM order, including the ones mostly hidden.',
    features: [
      {
        title: 'Hidden layers are still read',
        body: 'Only put real content in lower layers when people should hear it; otherwise hide it.',
      },
      {
        title: 'One focus target',
        body: 'Keep interactive controls on the top layer; covered ones are hard to reach and see.',
      },
      {
        title: 'Count in words',
        body: 'If the pile means “3 notifications”, say so in text.',
      },
      {
        title: 'Size the stack',
        body: 'Give the stack a size; its layers take the size of the grid cell.',
      },
    ],
  },
  customization: {
    description:
      'Size, shadows and spacing are your classes. daisyUI shrinks and fades the lower layers.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.notifications {
  inline-size: 18rem;
}

.notifications > * {
  box-shadow: 0 1px 3px color-mix(in oklab, var(--color-base-content) 15%, transparent);
}`,
    },
  },
  ssr: 'The directive only adds classes, so the server renders the finished stack.',
};

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const stackPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'verticalAlignment',
    options: choices(['default', 'top', 'bottom']),
    defaultValue: 'default',
    omit: ['default'],
  },
  {
    kind: 'choice',
    key: 'horizontalAlignment',
    options: choices(['default', 'start', 'end']),
    defaultValue: 'default',
    omit: ['default'],
  },
];

export const stackPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<div zdStack${attributes} class="pile">
  <div class="layer">A</div>
  <div class="layer" aria-hidden="true">B</div>
  <div class="layer" aria-hidden="true">C</div>
</div>`,
};

export const notificationsCode = `<section zdStack class="notifications" aria-label="Notifications, 3 unread">
  <article class="note">
    <p>Build 184 passed</p>
    <p class="meta">2 minutes ago</p>
  </article>
  <article class="note" aria-hidden="true"></article>
  <article class="note" aria-hidden="true"></article>
</section>`;
