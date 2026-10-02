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
          {
            name: '[zdCardBody]',
            description: '`card-body`: the padded content area.',
          },
          {
            name: '[zdCardTitle]',
            description: '`card-title` on a heading you choose.',
          },
          {
            name: '[zdCardActions]',
            description: '`card-actions`: a wrapping row of actions.',
          },
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
  render: attributes => `<article zdCard${attributes} class="demo">
  <figure><img src="images/showcase/lake-morning.webp" width="768" height="512" alt="Mountain lake in the morning" loading="lazy" /></figure>
  <div zdCardBody>
    <h3 zdCardTitle>Lake trip</h3>
    <p>Three days by the water, cabins included.</p>
    <div zdCardActions>
      <button zdButton type="button" color="primary">Book</button>
    </div>
  </div>
</article>
<!-- Add the image sizing CSS shown in the Side image example. -->`,
};

export const linkCardCode = `<a zdCard variant="border" routerLink="/components/badge">
  <div zdCardBody>
    <h3 zdCardTitle>Badge</h3>
    <p>Compact labels and counts.</p>
  </div>
</a>`;

export const imageFullCode = `<article zdCard imageFull class="demo">
  <figure><img src="images/showcase/lake-morning.webp" width="768" height="512" alt="Mountain lake in the morning" loading="lazy" /></figure>
  <div zdCardBody>
    <h3 zdCardTitle>Lake trip</h3>
    <p>Three days by the water.</p>
  </div>
</article>`;

export const sideFiles = [
  {
    label: 'side-card.html',
    language: 'html',
    code: `<article zdCard side class="demo side-demo" variant="border">
            <figure><img src="images/showcase/sneaker-side.webp" width="512" height="512" alt="Blue trainer in profile" loading="lazy" /></figure>
            <div zdCardBody><h3 zdCardTitle>Everyday trainer</h3><p>A comfortable companion for the city.</p></div>
          </article>`,
  },
  {
    label: 'side-card.css',
    language: 'css',
    code: `.demo { inline-size: min(20rem, 100%); background: var(--color-base-100); }
.demo figure { margin: 0; min-inline-size: 0; }
.demo figure img { display: block; width: 100%; height: 100%; object-fit: cover; }
.demo.card-side { inline-size: min(30rem, 100%); }
.demo.card-side > figure { flex: 0 0 38%; }
.demo.card-side > [zdCardBody] { min-inline-size: 0; }`,
  },
] as const;

export const responsiveFiles = [
  {
    label: 'responsive-card.html',
    language: 'html',
    code: `<article zdCard class="demo responsive-card" variant="border">
            <figure><img src="images/showcase/lake-sunset.webp" width="768" height="512" alt="Mountain lake at sunset" loading="lazy" /></figure>
            <div zdCardBody><h3 zdCardTitle>Stay by the lake</h3><p>A quiet cabin and a view to remember.</p></div>
          </article>`,
  },
  {
    label: 'responsive-card.css',
    language: 'css',
    code: `.demo { inline-size: min(20rem, 100%); background: var(--color-base-100); }
.demo figure { margin: 0; min-inline-size: 0; }
.demo figure img { display: block; width: 100%; height: 100%; object-fit: cover; }
.demo.card-side { inline-size: min(30rem, 100%); }
.demo.card-side > figure { flex: 0 0 38%; }
.demo.card-side > [zdCardBody] { min-inline-size: 0; }
.demo.responsive-card { inline-size: min(38rem, 100%); }
@media (min-width: 48rem) {
  .responsive-card { flex-direction: row; }
  .responsive-card > figure { flex: 0 0 42%; border-start-end-radius: 0; border-end-start-radius: inherit; }
  .responsive-card > [zdCardBody] { min-inline-size: 0; }
}`,
  },
] as const;

export const selectableFiles = [
  {
    label: 'selectable-cards.html',
    language: 'html',
    code: `<div class="selection-examples">
            <fieldset class="choice-set">
              <legend>Trip extras — choose any</legend>
              <div class="choice-cards">
                <label zdCard variant="border" class="selectable-card"><span zdCardBody><span class="choice-title"><input type="checkbox" name="breakfast" /><span zdCardTitle>Breakfast</span></span><span>Fresh pastries each morning.</span></span></label>
                <label zdCard variant="border" class="selectable-card"><span zdCardBody><span class="choice-title"><input type="checkbox" name="kayak" /><span zdCardTitle>Kayak hire</span></span><span>Explore the shore at your pace.</span></span></label>
                <label zdCard variant="border" class="selectable-card"><span zdCardBody><span class="choice-title"><input type="checkbox" name="sauna" disabled /><span zdCardTitle>Sauna</span></span><span>Unavailable this weekend.</span></span></label>
              </div>
            </fieldset>
            <fieldset class="choice-set">
              <legend>Room — choose one</legend>
              <div class="choice-cards">
                <label zdCard variant="border" class="selectable-card"><span zdCardBody><span class="choice-title"><input type="radio" name="showcase-room" value="cabin" checked /><span zdCardTitle>Cabin</span></span><span>A cosy room for two.</span></span></label>
                <label zdCard variant="border" class="selectable-card"><span zdCardBody><span class="choice-title"><input type="radio" name="showcase-room" value="suite" /><span zdCardTitle>Suite</span></span><span>Extra space and a private balcony.</span></span></label>
                <label zdCard variant="border" class="selectable-card"><span zdCardBody><span class="choice-title"><input type="radio" name="showcase-room" value="lodge" disabled /><span zdCardTitle>Lodge</span></span><span>Fully booked.</span></span></label>
              </div>
            </fieldset>
          </div>`,
  },
  {
    label: 'selectable-cards.css',
    language: 'css',
    code: `    .selection-examples { inline-size: 100%; display: grid; gap: 1.25rem; }
    .choice-set { margin: 0; padding: 0; border: 0; min-inline-size: 0; }
    .choice-set legend { margin-block-end: 0.75rem; font-weight: 700; }
    .choice-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr)); gap: 0.75rem; }
    .selectable-card { cursor: pointer; background: var(--color-base-100); color: var(--color-base-content); }
    .choice-title { display: flex; align-items: center; gap: 0.5rem; }
    .choice-title input { accent-color: var(--color-primary); flex-shrink: 0; }
    .selectable-card:has(input:checked) { border-color: var(--color-primary); background: var(--color-base-200); }
    .selectable-card:has(input:focus-visible) { outline: 2px solid var(--color-primary); outline-offset: 3px; }
    .selectable-card:has(input:disabled) { cursor: not-allowed; opacity: 0.6; }
`,
  },
] as const;
