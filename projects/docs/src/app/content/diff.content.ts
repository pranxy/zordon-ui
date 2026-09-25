import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Diff reference content. Mirrors projects/components/diff/src/diff.ts and docs/components/diff.md
 * — update them together.
 */

export const diffReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Diff',
  maturity: 'planned',
  description:
    'daisyUI’s side-by-side comparison with a draggable divider. Four directives add its classes to your own figure and content.',
  facts: controlFacts('[zdDiff]', 'diff', 'diff'),
  notice: plannedNotice,
  install: {
    description: 'Import the directives, and register the classes they add with Tailwind.',
    importCode: `import { ZdDiff, ZdDiffItem1, ZdDiffItem2, ZdDiffResizer } from '@pranxy/zordon-ui/diff';`,
    stylesCode: tailwindSource('diff diff-item-1 diff-item-2 diff-resizer'),
  },
  playgroundDescription:
    'Drag the handle at the bottom edge to reveal more of either side. The resizer is pure CSS.',
  api: {
    description: 'Four standalone directives with no inputs.',
    tables: [
      {
        id: 'parts',
        heading: 'Parts',
        caption: 'Diff directives',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          { name: '[zdDiff]', description: '`diff` on the container, often a figure.' },
          { name: '[zdDiffItem1]', description: '`diff-item-1`: the first (left) item.' },
          { name: '[zdDiffItem2]', description: '`diff-item-2`: the second item.' },
          { name: '[zdDiffResizer]', description: '`diff-resizer`: the drag handle.' },
        ],
      },
    ],
  },
  accessibility: {
    description:
      'The divider is a CSS resize handle, not a slider, so it has no keyboard value. Put the comparison in words too.',
    features: [
      {
        title: 'Describe both sides',
        body: 'Give images alt text and caption the figure so the difference is stated.',
      },
      {
        title: 'Pointer only',
        body: 'Dragging needs a pointer. Offer the two items separately if the comparison matters.',
      },
      {
        title: 'Focus for iOS',
        body: 'daisyUI documents tabindex="0" on the container and first item for iOS; add it yourself.',
      },
      {
        title: 'No live value',
        body: 'Nothing is announced while resizing; the position isn’t state.',
      },
    ],
  },
  customization: {
    description:
      'Aspect ratio and size are your classes on the container. Leave the width of each item’s child alone: daisyUI sizes it to the whole container so the two sides line up.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.comparison {
  aspect-ratio: 16 / 9;
  inline-size: min(28rem, 100%);
}`,
    },
  },
  ssr: 'Classes and content render on the server; resizing is native CSS and needs no hydration.',
};

export const diffCode = `<figure zdDiff class="comparison" tabindex="0">
  <div zdDiffItem1 tabindex="0"><div class="before" role="img" aria-label="Before: flat grey"></div></div>
  <div zdDiffItem2><div class="after" role="img" aria-label="After: vivid gradient"></div></div>
  <div zdDiffResizer></div>
</figure>`;

export const textCode = `<figure>
  <div zdDiff class="comparison">
    <div zdDiffItem1><p class="old">Our plans start at $12 per seat.</p></div>
    <div zdDiffItem2><p class="new">Our plans start at $9 per seat.</p></div>
    <div zdDiffResizer></div>
  </div>
  <figcaption>Pricing copy, before and after the September change.</figcaption>
</figure>`;
