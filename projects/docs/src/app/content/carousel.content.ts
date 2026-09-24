import type { DocsFeature } from '../ui/page/feature-grid.component';
import type { DocsMetaItem } from '../ui/page/meta-grid.component';
import type { DocsTableColumn, DocsTableRow } from '../ui/reference/api-table.component';
import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';

/**
 * Carousel reference content. Mirrors projects/components/carousel/src/carousel.ts and
 * docs/components/carousel.md — update them together.
 */

export const carouselFacts: readonly DocsMetaItem[] = [
  { label: 'Root', value: '[zdCarousel]', mono: true },
  { label: 'Item', value: '[zdCarouselItem]', mono: true },
  { label: 'Entry point', value: '@pranxy/zordon-ui/carousel', mono: true },
  {
    label: 'Source',
    value: 'carousel.ts',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/projects/components/carousel/src/carousel.ts',
    mono: true,
  },
];

export const carouselImportCode = `import { ZdCarousel, ZdCarouselItem } from '@pranxy/zordon-ui/carousel';`;

export const carouselSourceCode = `@source inline("carousel carousel-item carousel-horizontal carousel-vertical carousel-start carousel-center carousel-end");`;

/** Slides are theme colours, so the examples need no images. */
export const carouselSlides = [
  { id: 'primary', label: 'Primary' },
  { id: 'secondary', label: 'Secondary' },
  { id: 'accent', label: 'Accent' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'info', label: 'Info' },
] as const;

export const carouselPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'align',
    options: ['start', 'center', 'end'].map(value => ({ value, label: value })),
    defaultValue: 'start',
    omit: ['start'],
  },
  {
    kind: 'choice',
    key: 'orientation',
    options: ['horizontal', 'vertical'].map(value => ({ value, label: value })),
    defaultValue: 'horizontal',
    omit: ['horizontal'],
  },
];

export const carouselPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render:
    attributes => `<div zdCarousel${attributes} role="region" aria-label="Theme colours" tabindex="0">
  @for (slide of slides; track slide.id) {
    <div zdCarouselItem role="group" [attr.aria-label]="slide.label">…</div>
  }
</div>`,
};

export const controlsFiles = [
  {
    label: 'gallery.html',
    language: 'html' as const,
    code: `<div #track zdCarousel role="region" aria-label="Theme colours" tabindex="0">
  @for (slide of slides; track slide.id; let i = $index) {
    <div zdCarouselItem role="group" [attr.aria-label]="(i + 1) + ' of ' + slides.length">…</div>
  }
</div>
<button zdButton (click)="scroll(track, -1)">Previous</button>
<button zdButton (click)="scroll(track, 1)">Next</button>`,
  },
  {
    label: 'gallery.ts',
    language: 'ts' as const,
    code: `protected scroll(track: HTMLElement, step: -1 | 1): void {
  const rtl = getComputedStyle(track).direction === 'rtl';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  track.scrollBy({
    left: step * (rtl ? -1 : 1) * track.clientWidth,
    behavior: reduce ? 'auto' : 'smooth',
  });
}`,
  },
];

export const peekCode = `<!-- Item width is yours: a partial next item hints that the region scrolls -->
<div zdCarousel align="center" class="gap-4 px-8">
  <div zdCarouselItem class="w-4/5">…</div>
  …
</div>`;

export const verticalCode = `<div zdCarousel orientation="vertical" class="h-64">
  <div zdCarouselItem class="h-full">…</div>
  …
</div>`;

const partColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Directive', kind: 'name' },
  { key: 'description', label: 'Adds' },
];

export const carouselParts = {
  columns: partColumns,
  rows: [
    {
      name: '[zdCarousel]',
      description: '`carousel`, plus the axis and alignment modifiers. A native scroll container.',
    },
    { name: '[zdCarouselItem]', description: '`carousel-item`, a snap point.' },
  ] satisfies readonly DocsTableRow[],
};

const inputColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Input', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'default', label: 'Default', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export const carouselInputs = {
  columns: inputColumns,
  rows: [
    {
      name: 'orientation',
      type: 'ZdCarouselOrientation',
      default: 'undefined',
      description: '`horizontal` or `vertical`. Omit for daisyUI’s horizontal default.',
    },
    {
      name: 'align',
      type: 'ZdCarouselAlign',
      default: 'undefined',
      description: 'Snap alignment: `start`, `center` or `end`. Omit for start.',
    },
  ] satisfies readonly DocsTableRow[],
};

export const carouselTypesCode = `export type ZdCarouselOrientation = 'horizontal' | 'vertical';
export type ZdCarouselAlign = 'start' | 'center' | 'end';`;

export const carouselAccessibilityNotes: readonly DocsFeature[] = [
  {
    title: 'Label the region',
    body: 'Give the scroll container role="region", an aria-label and tabindex="0" so keyboard users can scroll it.',
  },
  {
    title: 'Controls are yours',
    body: 'Use native buttons for previous and next, and describe position (for example “2 of 5”) on each item.',
  },
  {
    title: 'No autoplay',
    body: 'Carousel has no timer, loop or index. Anything that moves on its own needs a pause control you provide.',
  },
  {
    title: 'Respect reduced motion',
    body: 'Scroll with behavior "auto" instead of "smooth" when the user prefers reduced motion.',
  },
];

export const carouselCustomizationCode = `<!-- Width, gap, padding and responsive axis are ordinary utilities -->
<div zdCarousel align="center" class="gap-4 rounded-box bg-base-200 p-4 md:carousel-vertical">
  …
</div>`;
