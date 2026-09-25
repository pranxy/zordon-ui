import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { apiColumns, controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Mask reference content. Mirrors projects/components/mask/src/mask.ts and docs/components/mask.md
 * — update them together.
 */

export const maskShapes = [
  'squircle',
  'decagon',
  'diamond',
  'heart',
  'hexagon',
  'hexagon-2',
  'circle',
  'pentagon',
  'star',
  'star-2',
  'triangle',
  'triangle-2',
  'triangle-3',
  'triangle-4',
] as const;

export const maskReference: DocsReference = {
  eyebrow: 'Layout',
  heading: 'Mask',
  maturity: 'planned',
  description:
    'daisyUI’s shape masks for any element: circle, squircle, hexagon, star and more, plus half masks. Your image keeps its alt text.',
  facts: controlFacts('[zdMask]', 'mask', 'mask'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes you use with Tailwind.',
    importCode: `import { ZdMask } from '@pranxy/zordon-ui/mask';`,
    stylesCode: tailwindSource(
      ['mask', ...maskShapes.map(shape => `mask-${shape}`), 'mask-half-1', 'mask-half-2'].join(' '),
    ),
  },
  playgroundDescription:
    'The mask clips the element to the shape; its box, and anything outside the shape, stays in the layout.',
  api: {
    description: 'A standalone directive with two inputs.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Mask inputs',
        columns: apiColumns,
        rows: [
          {
            name: 'shape',
            type: 'ZdMaskShape',
            default: 'undefined',
            description: 'Adds `mask-<shape>`. Every daisyUI shape is supported.',
          },
          {
            name: 'half',
            type: 'ZdMaskHalf',
            default: 'undefined',
            description: '`half-1` or `half-2` keeps only the first or second half of the shape.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/mask',
    typesCode: `export type ZdMaskShape =
  | 'squircle' | 'decagon' | 'diamond' | 'heart' | 'hexagon' | 'hexagon-2' | 'circle'
  | 'pentagon' | 'star' | 'star-2' | 'triangle' | 'triangle-2' | 'triangle-3' | 'triangle-4';
export type ZdMaskHalf = 'half-1' | 'half-2';`,
  },
  accessibility: {
    description: 'Mask is purely visual. It adds no role, name or state.',
    features: [
      {
        title: 'Alt text is unchanged',
        body: 'A masked image still needs its own alt text, or alt="" when decorative.',
      },
      {
        title: 'Focus rings get clipped',
        body: 'Don’t mask focusable elements; mask an image inside the link or button instead.',
      },
      {
        title: 'Shape isn’t meaning',
        body: 'A heart or star shape says nothing to screen readers; put the meaning in text.',
      },
      {
        title: 'Forced colors',
        body: 'Masks still apply in forced-colors mode; test that shapes stay recognisable.',
      },
    ],
  },
  customization: {
    description:
      'Size and object-fit are your CSS on the element. Any element works, not just images.',
    code: {
      label: 'profile.html',
      language: 'html',
      code: `<img zdMask shape="squircle" src="/ada.webp" alt="Ada Lovelace" width="96" height="96" />`,
    },
  },
  ssr: 'The directive only adds classes, so the server renders the finished shape.',
};

export const maskPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'shape',
    options: maskShapes.map(value => ({ value, label: value })),
    defaultValue: 'squircle',
  },
  {
    kind: 'choice',
    key: 'half',
    options: ['none', 'half-1', 'half-2'].map(value => ({ value, label: value })),
    defaultValue: 'none',
    omit: ['none'],
  },
];

export const maskPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<img zdMask${attributes} src="/lake.webp" alt="A lake at dawn" />`,
};

export const halvesCode = `<div class="halves" aria-hidden="true">
  <span zdMask shape="star-2" half="half-1" class="star"></span>
  <span zdMask shape="star-2" half="half-2" class="star"></span>
  …
</div>
<span>3.5 out of 5</span>`;
