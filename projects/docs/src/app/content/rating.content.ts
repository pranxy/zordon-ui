import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  apiColumns,
  controlFacts,
  controlSizes,
  disabledControl,
  nativeSsr,
  plannedNotice,
  sizeControl,
  sizeRow,
  tailwindSource,
} from './form-controls.content';

/**
 * Rating reference content. Mirrors projects/components/rating/src/rating.ts and
 * docs/components/rating.md — update them together.
 */

const ratingClasses = [
  'rating',
  ...controlSizes.map(size => `rating-${size}`),
  'rating-half',
  'rating-hidden',
  'mask',
  'mask-star-2',
  'mask-half-1',
  'mask-half-2',
].join(' ');

export const ratingReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Rating',
  maturity: 'planned',
  description:
    'A native radio group laid out as daisyUI stars. zdRating styles the container, zdRatingHidden marks the clear option, and Mask shapes each input; selection, arrow keys and Angular Forms stay native.',
  facts: controlFacts('[zdRating]', 'rating', 'rating'),
  notice: plannedNotice,
  install: {
    description:
      'Import the directives and Mask for the star shapes, and register the classes with Tailwind.',
    importCode: `import { ZdRating, ZdRatingHidden } from '@pranxy/zordon-ui/rating';
import { ZdMask } from '@pranxy/zordon-ui/mask';`,
    stylesCode: tailwindSource(ratingClasses),
  },
  playgroundDescription:
    'Size is the only visual input. Tab into the stars, then use the arrow keys, just like any radio group.',
  api: {
    description: 'Two standalone directives. Colors, icons and the number of options are yours.',
    tables: [
      {
        id: 'directives',
        heading: 'Directives',
        caption: 'Rating directives',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          {
            name: '[zdRating]',
            description:
              '`rating`, plus the size and half modifiers. Put it on the element that holds the radios.',
          },
          {
            name: 'input[type="radio"][zdRatingHidden]',
            description: '`rating-hidden`: a transparent first option that clears the rating.',
          },
        ],
      },
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Rating inputs',
        columns: apiColumns,
        rows: [
          sizeRow('ZdRatingSize', 'rating'),
          {
            name: 'half',
            type: 'boolean',
            default: 'false',
            description:
              'Adds `rating-half`, which halves each input’s width. Pair `mask-half-1` and `mask-half-2` shapes yourself.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/rating',
    typesCode: `export type ZdRatingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';`,
  },
  accessibility: {
    description:
      'Stars are native radios, so the group has one tab stop and arrow keys change the value.',
    features: [
      {
        title: 'Name every star',
        body: 'The inputs have no visible text, so give each an aria-label such as "3 stars".',
      },
      {
        title: 'Name the group',
        body: 'Wrap the stars in a fieldset with a legend, so the question is read before the options.',
      },
      {
        title: 'Say how to clear',
        body: 'Label the zdRatingHidden option ("No rating") so the clear choice is discoverable.',
      },
      {
        title: 'Big enough to tap',
        body: 'WCAG 2.2 asks for 24px targets. md and larger stars meet it; xs, sm and half stars below a 3rem --size do not, and the clear option needs widening from its 0.5rem default.',
      },
      {
        title: 'Contrast for unselected stars',
        body: 'daisyUI dims unselected stars. Check that they still read as stars against your background.',
      },
    ],
    keyboard: {
      caption: 'Keyboard',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: 'Tab', action: 'Moves into the rating, onto the selected star' },
        { key: '→ ↑', action: 'One more star (← ↓ one fewer)' },
      ],
    },
  },
  customization: {
    description:
      'Stars are the inputs’ backgrounds, so color them with a background color, and change the shape with another Mask. Your classes and theme scopes stay on the elements.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.review-stars input:not(.rating-hidden) {
  background-color: var(--color-warning);
}

/* daisyUI's clear option is 0.5rem wide; widen it to the 24px minimum target */
.review-stars .rating-hidden {
  inline-size: 1.5rem;
}`,
    },
  },
  ssr: nativeSsr,
};

export const ratingPlaygroundControls: readonly PlaygroundControl[] = [
  sizeControl,
  disabledControl,
];

export const ratingPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<fieldset${attributes.includes(' disabled') ? ' disabled' : ''}>
  <legend>Your rating</legend>
  <div zdRating${attributes.replace(' disabled', '')} class="review-stars">
    <input type="radio" zdRatingHidden name="review" value="0" aria-label="No rating" />
    <input type="radio" zdMask shape="star-2" name="review" value="1" aria-label="1 star" />
    …
    <input type="radio" zdMask shape="star-2" name="review" value="5" aria-label="5 stars" />
  </div>
</fieldset>`,
};

export const starValues = [1, 2, 3, 4, 5] as const;
export const halfValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;

export function starLabel(value: number): string {
  return value === 1 ? '1 star' : `${value} stars`;
}

export const starsFiles = [
  {
    label: 'review.html',
    language: 'html' as const,
    code: `<fieldset>
  <legend>How was your delivery?</legend>
  <div zdRating size="lg" class="review-stars">
    <input type="radio" zdRatingHidden name="delivery" [value]="0"
           aria-label="No rating" [formControl]="rating" />
    @for (value of [1, 2, 3, 4, 5]; track value) {
      <input type="radio" zdMask shape="star-2" name="delivery" [value]="value"
             [attr.aria-label]="value + ' stars'" [formControl]="rating" />
    }
  </div>
</fieldset>`,
  },
  {
    label: 'review.ts',
    language: 'ts' as const,
    code: `readonly rating = new FormControl(3, { nonNullable: true });`,
  },
];

export const halfCode = `<!-- .large-half { --size: 3rem; } keeps each half at least 24px wide -->
<div zdRating half class="review-stars large-half">
  <input type="radio" zdRatingHidden name="score" value="0" aria-label="No rating" />
  <input type="radio" zdMask shape="star-2" half="half-1" name="score" value="0.5" aria-label="0.5 stars" />
  <input type="radio" zdMask shape="star-2" half="half-2" name="score" value="1" aria-label="1 star" />
  …
</div>`;

export const ratingSizesCode = controlSizes
  .map(size => `<div zdRating size="${size}">…</div>`)
  .join('\n');
