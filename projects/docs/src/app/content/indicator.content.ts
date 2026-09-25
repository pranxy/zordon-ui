import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { apiColumns, controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Indicator reference content. Mirrors projects/components/indicator/src/indicator.ts and
 * docs/components/indicator.md — update them together.
 */

export const countCode = `<div zdIndicator>
  <span zdIndicatorItem zdBadge color="primary" size="sm" aria-hidden="true">3</span>
  <button zdButton type="button">Inbox<span class="visually-hidden">, 3 unread</span></button>
</div>`;

export const indicatorReference: DocsReference = {
  eyebrow: 'Layout',
  heading: 'Indicator',
  maturity: 'planned',
  description:
    'daisyUI’s corner placement for a badge, dot or label over another element. It positions content; the meaning stays in your text.',
  facts: controlFacts('[zdIndicator]', 'indicator', 'indicator'),
  notice: plannedNotice,
  install: {
    description: 'Import the directives, and register the classes they add with Tailwind.',
    importCode: `import { ZdIndicator, ZdIndicatorItem } from '@pranxy/zordon-ui/indicator';`,
    stylesCode: tailwindSource(
      'indicator indicator-item indicator-start indicator-center indicator-end indicator-top indicator-middle indicator-bottom',
    ),
  },
  playgroundDescription:
    'Placement is logical: start and end swap sides in right-to-left pages. daisyUI’s default is the top end corner.',
  api: {
    description: 'A wrapper directive and an item directive with two placement inputs.',
    tables: [
      {
        id: 'inputs',
        heading: 'Item inputs',
        caption: 'Indicator item inputs',
        columns: apiColumns,
        rows: [
          {
            name: 'horizontalPlacement',
            type: 'ZdIndicatorHorizontalPlacement',
            default: 'undefined',
            description: '`start`, `center` or `end` adds `indicator-<placement>`.',
          },
          {
            name: 'verticalPlacement',
            type: 'ZdIndicatorVerticalPlacement',
            default: 'undefined',
            description: '`top`, `middle` or `bottom` adds `indicator-<placement>`.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/indicator',
    typesCode: `export type ZdIndicatorHorizontalPlacement = 'start' | 'center' | 'end';
export type ZdIndicatorVerticalPlacement = 'top' | 'middle' | 'bottom';`,
  },
  accessibility: {
    description:
      'Indicator only positions. Screen readers meet the item where it sits in the markup, not where it appears.',
    features: [
      {
        title: 'Part of the name',
        body: 'A count on a button belongs in its name: “Inbox, 3 unread”, not a bare “3”.',
      },
      {
        title: 'Hide pure decoration',
        body: 'A dot that repeats nearby text can be aria-hidden.',
      },
      {
        title: 'Announce changes yourself',
        body: 'New counts are not announced. Use a live region when a change matters.',
      },
      {
        title: 'Don’t cover controls',
        body: 'Keep the item away from the thing people click, especially on small targets.',
      },
    ],
  },
  customization: {
    description:
      'The item is your element: a Badge, a Status dot or any content. Offsets are ordinary CSS on it.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `/* Nudge the item inward so it sits on a round avatar's edge */
.avatar-indicator > .indicator-item {
  margin: 0.25rem;
}`,
    },
  },
  ssr: 'The directives only add classes, so the server renders the finished placement.',
};

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const indicatorPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'horizontalPlacement',
    options: choices(['default', 'start', 'center', 'end']),
    defaultValue: 'default',
    omit: ['default'],
  },
  {
    kind: 'choice',
    key: 'verticalPlacement',
    options: choices(['default', 'top', 'middle', 'bottom']),
    defaultValue: 'default',
    omit: ['default'],
  },
];

export const indicatorPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<div zdIndicator>
  <span zdIndicatorItem${attributes} zdBadge color="secondary" aria-hidden="true">New</span>
  <div class="tile">Release notes <span class="visually-hidden">(new)</span></div>
</div>`,
};

export const presenceCode = `<div zdIndicator>
  <span
    zdIndicatorItem
    horizontalPlacement="end"
    verticalPlacement="bottom"
    zdStatus
    color="success"
    aria-hidden="true"
  ></span>
  <div class="avatar-tile">AL</div>
</div>
<span>Ada Lovelace · online</span>`;
