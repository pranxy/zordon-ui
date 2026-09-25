import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { apiColumns, controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Join reference content. Mirrors projects/components/join/src/join.ts and docs/components/join.md
 * — update them together.
 */

export const joinReference: DocsReference = {
  eyebrow: 'Layout',
  heading: 'Join',
  maturity: 'planned',
  description:
    'daisyUI’s way of butting controls together into one segmented group. Every item keeps its own native behaviour and name.',
  facts: controlFacts('[zdJoin]', 'join', 'join'),
  notice: plannedNotice,
  install: {
    description: 'Import the directives, and register the classes they add with Tailwind.',
    importCode: `import { ZdJoin, ZdJoinItem } from '@pranxy/zordon-ui/join';`,
    stylesCode: tailwindSource('join join-item join-horizontal join-vertical'),
  },
  playgroundDescription:
    'Only the outer corners stay rounded. Each item is still its own button, with its own focus stop.',
  api: {
    description: 'A container directive with one input, and an item directive for each child.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Join inputs',
        columns: apiColumns,
        rows: [
          {
            name: 'direction',
            type: 'ZdJoinDirection',
            default: 'undefined',
            description:
              '`horizontal` or `vertical` adds `join-<direction>`. Omit it for daisyUI’s horizontal default.',
          },
          {
            name: '[zdJoinItem]',
            type: '—',
            default: '—',
            description: 'Adds `join-item` to each direct child you want joined.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/join',
    typesCode: `export type ZdJoinDirection = 'horizontal' | 'vertical';`,
  },
  accessibility: {
    description:
      'Join is visual only. It adds no group role, roving focus or selection; your markup says what the group is.',
    features: [
      {
        title: 'Name the group',
        body: 'Wrap related buttons in role="group" with a label, or a fieldset for radios.',
      },
      {
        title: 'Each item stands alone',
        body: 'Every control needs its own accessible name, even when icons sit side by side.',
      },
      {
        title: 'Show selection in text or state',
        body: 'For toggles, use aria-pressed or native radios, not only a different color.',
      },
      {
        title: 'Label the input',
        body: 'A joined search field still needs a label; a visually hidden one is fine.',
      },
    ],
  },
  customization: {
    description:
      'The items are your elements: Buttons, inputs, selects or links. A Tailwind variant switches direction at a breakpoint.',
    code: {
      label: 'toolbar.html',
      language: 'html',
      code: `<div zdJoin direction="vertical" class="md:join-horizontal" role="group" aria-label="Zoom">…</div>`,
    },
  },
  ssr: 'The directives only add classes, so the server renders the finished group.',
};

export const joinPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'direction',
    options: ['default', 'horizontal', 'vertical'].map(value => ({ value, label: value })),
    defaultValue: 'default',
    omit: ['default'],
  },
];

export const joinPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<div zdJoin${attributes} role="group" aria-label="Text alignment">
  <button zdButton zdJoinItem type="button" [attr.aria-pressed]="align() === 'start'">Start</button>
  <button zdButton zdJoinItem type="button" [attr.aria-pressed]="align() === 'center'">Center</button>
  <button zdButton zdJoinItem type="button" [attr.aria-pressed]="align() === 'end'">End</button>
</div>`,
};

export const searchCode = `<form zdJoin role="search" (submit)="search($event)">
  <label for="docs-search" class="visually-hidden">Search components</label>
  <input zdTextInput zdJoinItem id="docs-search" type="search" placeholder="Search components" />
  <button zdButton zdJoinItem color="primary" type="submit">Search</button>
</form>`;
