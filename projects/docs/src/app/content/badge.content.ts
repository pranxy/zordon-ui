import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  colorAndSizeTypes,
  colorControl,
  controlFacts,
  modifierClasses,
  plannedNotice,
  sizeControl,
  tailwindSource,
  themeColors,
} from './form-controls.content';

/**
 * Badge reference content. Mirrors projects/components/badge/src/badge.ts and
 * docs/components/badge.md — update them together.
 */

export const badgeVariants = ['outline', 'dash', 'soft', 'ghost'] as const;

export const badgeReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Badge',
  maturity: 'planned',
  description:
    'A compact label, count or marker on any native element. Badge adds classes only: announcements, roles and actions stay with your markup.',
  facts: controlFacts('[zdBadge]', 'badge', 'badge'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdBadge } from '@pranxy/zordon-ui/badge';`,
    stylesCode: tailwindSource(
      modifierClasses('badge', { extra: badgeVariants.map(variant => `badge-${variant}`) }),
    ),
  },
  playgroundDescription: 'Color is a theme role; variant changes the fill. Pair color with words.',
  api: {
    description: 'A standalone directive with three optional inputs.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Badge inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'color',
            type: 'ZdBadgeColor',
            default: 'undefined',
            description: 'Adds `badge-<color>`. Omit for the neutral base.',
          },
          {
            name: 'variant',
            type: 'ZdBadgeVariant',
            default: 'undefined',
            description: '`outline`, `dash`, `soft` or `ghost`. Omit for filled.',
          },
          {
            name: 'size',
            type: 'ZdBadgeSize',
            default: 'undefined',
            description: 'Adds `badge-<size>`, `xs` to `xl`.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/badge',
    typesCode: `${colorAndSizeTypes('ZdBadge')}
export type ZdBadgeVariant = 'outline' | 'dash' | 'soft' | 'ghost';`,
  },
  accessibility: {
    description:
      'Badge never adds a role or live region. Its host keeps whatever meaning it already has.',
    features: [
      {
        title: 'Say what a count means',
        body: '“3” next to Inbox is clear; alone it isn’t. Add hidden text such as “unread”.',
      },
      {
        title: 'Dots need words',
        body: 'An empty badge is only a marker; name its meaning somewhere readable.',
      },
      {
        title: 'Updates are yours',
        body: 'If a count changes live, announce it yourself, sparingly.',
      },
      {
        title: 'Actions stay native',
        body: 'For removable tags, put zdBadge on a native button with a clear name.',
      },
    ],
  },
  customization: {
    description:
      'Soft, outline and dash badges color their text with the role, so check contrast on your surface.',
  },
  ssr: 'The directive only adds classes, so the server renders the finished badge.',
};

export const badgePlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  {
    kind: 'choice',
    key: 'variant',
    options: ['default', ...badgeVariants].map(value => ({ value, label: value })),
    defaultValue: 'default',
    omit: ['default'],
  },
  sizeControl,
];

export const badgePlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<span zdBadge${attributes}>New</span>`,
};

export const badgeColors = themeColors;

export const colorsCode = themeColors
  .map(color => `<span zdBadge color="${color}">${color}</span>`)
  .join('\n');

export const inContextCode = `<a zdLink routerLink="/components">
  Inbox <span zdBadge color="primary" size="sm">3<span class="docs-visually-hidden"> unread</span></span>
</a>
<button zdButton type="button">
  Filters <span zdBadge size="sm">2</span>
</button>`;
