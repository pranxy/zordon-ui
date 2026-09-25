import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  controlFacts,
  controlSizes,
  modifierClasses,
  plannedNotice,
  tailwindSource,
} from './form-controls.content';

/**
 * Card reference content. Mirrors projects/components/card/src/card.ts and docs/components/card.md
 * — update them together.
 */

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const cardReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Card',
  maturity: 'planned',
  description:
    'daisyUI’s card container and its body, title and actions parts on your own native markup: an article, a section, or a link.',
  facts: controlFacts('[zdCard]', 'card', 'card'),
  notice: plannedNotice,
  install: {
    description: 'Import the directives you use, and register the classes they add with Tailwind.',
    importCode: `import { ZdCard, ZdCardActions, ZdCardBody, ZdCardTitle } from '@pranxy/zordon-ui/card';`,
    stylesCode: tailwindSource(
      modifierClasses('card', {
        colors: false,
        extra: [
          'card-body',
          'card-title',
          'card-actions',
          'card-border',
          'card-dash',
          'card-side',
          'image-full',
        ],
      }),
    ),
  },
  playgroundDescription:
    'A direct figure child becomes the media: beside the body with side, or behind it with imageFull.',
  api: {
    description: 'Four standalone directives. Only the card itself has inputs.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Card inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'size',
            type: 'ZdCardSize',
            default: 'undefined',
            description: 'Padding and title size, `xs` to `xl`.',
          },
          {
            name: 'variant',
            type: 'ZdCardVariant',
            default: 'undefined',
            description: '`border` or `dash`.',
          },
          {
            name: 'side',
            type: 'boolean',
            default: 'false',
            description: 'Puts a direct figure beside the body.',
          },
          {
            name: 'imageFull',
            type: 'boolean',
            default: 'false',
            description: 'Puts a direct figure behind the body.',
          },
        ],
      },
      {
        id: 'parts',
        heading: 'Parts',
        caption: 'Card part directives',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          { name: '[zdCardBody]', description: '`card-body`: the padded content area.' },
          { name: '[zdCardTitle]', description: '`card-title` on a heading you choose.' },
          { name: '[zdCardActions]', description: '`card-actions`: a wrapping row of actions.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/card',
    typesCode: `export type ZdCardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdCardVariant = 'border' | 'dash';`,
  },
  accessibility: {
    description: 'Card adds classes only; the host element decides the semantics.',
    features: [
      {
        title: 'Pick the element',
        body: 'An article or section for content, a link when the whole card navigates.',
      },
      {
        title: 'One interactive owner',
        body: 'A card link must not contain other links or buttons; use sibling actions instead.',
      },
      {
        title: 'Headings are yours',
        body: 'zdCardTitle styles your heading; choose the level that fits the page outline.',
      },
      {
        title: 'Describe media',
        body: 'Give meaningful images alt text; decorative media gets alt="".',
      },
    ],
  },
  customization: {
    description:
      'Width, background, shadow and radius are your classes; daisyUI’s card variables are internal.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.product-card {
  inline-size: 20rem;
  background: var(--color-base-100);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
}`,
    },
  },
  ssr: 'The directives only add classes, so the server renders the finished card.',
};

export const cardPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'variant',
    options: choices(['default', 'border', 'dash']),
    defaultValue: 'border',
    omit: ['default'],
  },
  {
    kind: 'choice',
    key: 'size',
    options: choices(controlSizes),
    defaultValue: 'md',
    omit: ['md'],
  },
  { kind: 'boolean', key: 'side', defaultValue: false },
];

export const cardPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<article zdCard${attributes}>
  <figure><div class="art" role="img" aria-label="Mountain lake at dawn"></div></figure>
  <div zdCardBody>
    <h3 zdCardTitle>Lake trip</h3>
    <p>Three days by the water, cabins included.</p>
    <div zdCardActions>
      <button zdButton type="button" color="primary">Book</button>
    </div>
  </div>
</article>`,
};

export const linkCardCode = `<a zdCard variant="border" routerLink="/components/badge">
  <div zdCardBody>
    <h3 zdCardTitle>Badge</h3>
    <p>Compact labels and counts.</p>
  </div>
</a>`;

export const imageFullCode = `<article zdCard imageFull>
  <figure><div class="art" role="img" aria-label="Mountain lake at dawn"></div></figure>
  <div zdCardBody>
    <h3 zdCardTitle>Lake trip</h3>
    <p>Three days by the water.</p>
  </div>
</article>`;
