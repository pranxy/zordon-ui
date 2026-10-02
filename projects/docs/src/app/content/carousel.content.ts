import type { DocsReference } from '../ui/reference/reference-page.component';
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

export const carouselSlides = [
  {
    id: 'morning',
    label: 'Morning lake',
    src: 'images/showcase/lake-morning.webp',
    height: 512,
    alt: 'Mountain lake in the morning',
  },
  {
    id: 'sunset',
    label: 'Sunset lake',
    src: 'images/showcase/lake-sunset.webp',
    height: 512,
    alt: 'Mountain lake at sunset',
  },
  {
    id: 'coast',
    label: 'Coast',
    src: 'images/showcase/coast.webp',
    height: 432,
    alt: 'Cliffs overlooking the sea',
  },
] as const;

export const carouselPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'align',
    options: ['start', 'center', 'end'].map(value => ({
      value,
      label: value,
    })),
    defaultValue: 'start',
    omit: ['start'],
  },
  {
    kind: 'choice',
    key: 'orientation',
    options: ['horizontal', 'vertical'].map(value => ({
      value,
      label: value,
    })),
    defaultValue: 'horizontal',
    omit: ['horizontal'],
  },
];

export const carouselPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render:
    attributes => `<div zdCarousel${attributes} class="track${attributes.includes('orientation="vertical"') ? ' vertical' : ''}" role="region" aria-label="Landscapes" tabindex="0">
@for (slide of slides; track slide.id; let index = $index) {
  <div zdCarouselItem class="slide half" role="group" [attr.aria-label]="index + 1 + ' of ' + slides.length">
    <img [src]="slide.src" width="768" [height]="slide.height" [alt]="slide.alt" loading="lazy" />
  </div>
}
</div>
<!-- Add the slides data and track/image CSS from the examples below. -->`,
};

export const controlsFiles = [
  {
    label: 'gallery.html',
    language: 'html',
    code: `<div class="docs-stack full">
  <div #track zdCarousel class="track" role="region" aria-label="Landscape gallery with controls" tabindex="0" (scroll)="controlIndex.set(nearestIndex(track))">
    @for (slide of slides; track slide.id; let index = $index) {
      <div zdCarouselItem class="slide full-width" role="group" [attr.aria-label]="index + 1 + ' of ' + slides.length">
        <img [src]="slide.src" width="768" [height]="slide.height" [alt]="slide.alt" loading="lazy" />
      </div>
    }
  </div>
  <div class="docs-cluster controls">
    <button zdButton type="button" size="sm" [disabled]="controlIndex() === 0" (click)="scroll(track, -1)">Previous</button>
    <button zdButton type="button" size="sm" [disabled]="controlIndex() === slides.length - 1" (click)="scroll(track, 1)">Next</button>
  </div>
</div>`,
  },
  {
    label: 'gallery.ts',
    language: 'ts',
    code: `import { DOCUMENT } from '@angular/common';
import { inject, signal } from '@angular/core';

// Inside your component:
protected readonly slides = [
  {
    "id": "morning",
    "label": "Morning lake",
    "src": "images/showcase/lake-morning.webp",
    "height": 512,
    "alt": "Mountain lake in the morning"
  },
  {
    "id": "sunset",
    "label": "Sunset lake",
    "src": "images/showcase/lake-sunset.webp",
    "height": 512,
    "alt": "Mountain lake at sunset"
  },
  {
    "id": "coast",
    "label": "Coast",
    "src": "images/showcase/coast.webp",
    "height": 432,
    "alt": "Cliffs overlooking the sea"
  }
];
  private readonly document = inject(DOCUMENT);
  protected readonly controlIndex = signal(0);
  protected readonly indicatorIndex = signal(0);

  protected nearestIndex(track: HTMLElement): number {
    const view = this.document.defaultView;
    if (!view) return 0;
    const style = view.getComputedStyle(track);
    const rtl = style.direction === 'rtl';
    const bounds = track.getBoundingClientRect();
    const edge = rtl
      ? bounds.left + track.clientLeft + track.clientWidth - parseFloat(style.paddingRight)
      : bounds.left + track.clientLeft + parseFloat(style.paddingLeft);
    const distances = Array.from(track.children, child => {
      const rect = child.getBoundingClientRect();
      return Math.abs((rtl ? rect.right : rect.left) - edge);
    });
    return distances.indexOf(Math.min(...distances));
  }

  protected goTo(track: HTMLElement, index: number): void {
    const view = this.document.defaultView;
    const item = track.children.item(index);
    if (!view || !item) return;
    const style = view.getComputedStyle(track);
    const rtl = style.direction === 'rtl';
    const bounds = track.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    const edge = rtl
      ? bounds.left + track.clientLeft + track.clientWidth - parseFloat(style.paddingRight)
      : bounds.left + track.clientLeft + parseFloat(style.paddingLeft);
    track.scrollBy({
      left: (rtl ? rect.right : rect.left) - edge,
      behavior: view.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  protected scroll(track: HTMLElement, step: -1 | 1): void {
    const next = Math.max(0, Math.min(track.children.length - 1, this.nearestIndex(track) + step));
    this.goTo(track, next);
  }`,
  },
  {
    label: 'gallery.css',
    language: 'css',
    code: `    .track {
      inline-size: 100%; min-inline-size: 0; gap: 0.75rem; padding: 0.75rem;
      scroll-padding-inline: 0.75rem; border-radius: 1rem; background: var(--color-base-100);
    }
    .track.vertical { block-size: 15rem; scroll-padding-block: 0.75rem; }
    .track.padded { padding-inline: 2rem; scroll-padding-inline: 2rem; }
    .full { inline-size: 100%; min-inline-size: 0; }
    .slide { min-inline-size: 0; overflow: hidden; border-radius: 0.75rem; }
    .slide img { display: block; inline-size: 100%; block-size: 100%; object-fit: cover; aspect-ratio: 3 / 2; }
    .half { inline-size: 65%; }
    .full-width { inline-size: 100%; }
    .peek { inline-size: 80%; }
    .full-height { inline-size: 100%; block-size: 100%; }
    .controls { justify-content: center; }
    .controls [aria-current='true'] { outline: 2px solid var(--color-primary); outline-offset: 2px; }
    .track:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) { .track { scroll-behavior: auto; } }
`,
  },
] as const;

export const indicatorFiles = [
  {
    label: 'gallery.html',
    language: 'html',
    code: `<div class="docs-stack full">
  <div #indicators zdCarousel class="track" role="region" aria-label="Landscape gallery with indicators" tabindex="0" (scroll)="indicatorIndex.set(nearestIndex(indicators))">
    @for (slide of slides; track slide.id; let index = $index) {
      <div zdCarouselItem class="slide full-width" role="group" [attr.aria-label]="index + 1 + ' of ' + slides.length">
        <img [src]="slide.src" width="768" [height]="slide.height" [alt]="slide.alt" loading="lazy" />
      </div>
    }
  </div>
  <div class="docs-cluster controls" role="group" aria-label="Choose a landscape">
    @for (slide of slides; track slide.id; let index = $index) {
      <button zdButton type="button" size="sm" [attr.aria-label]="'Show ' + slide.label" [attr.aria-current]="indicatorIndex() === index ? 'true' : null" (click)="goTo(indicators, index)">{{ index + 1 }}</button>
    }
  </div>
</div>`,
  },
  {
    label: 'gallery.ts',
    language: 'ts',
    code: `import { DOCUMENT } from '@angular/common';
import { inject, signal } from '@angular/core';

// Inside your component:
protected readonly slides = [
  {
    "id": "morning",
    "label": "Morning lake",
    "src": "images/showcase/lake-morning.webp",
    "height": 512,
    "alt": "Mountain lake in the morning"
  },
  {
    "id": "sunset",
    "label": "Sunset lake",
    "src": "images/showcase/lake-sunset.webp",
    "height": 512,
    "alt": "Mountain lake at sunset"
  },
  {
    "id": "coast",
    "label": "Coast",
    "src": "images/showcase/coast.webp",
    "height": 432,
    "alt": "Cliffs overlooking the sea"
  }
];
  private readonly document = inject(DOCUMENT);
  protected readonly controlIndex = signal(0);
  protected readonly indicatorIndex = signal(0);

  protected nearestIndex(track: HTMLElement): number {
    const view = this.document.defaultView;
    if (!view) return 0;
    const style = view.getComputedStyle(track);
    const rtl = style.direction === 'rtl';
    const bounds = track.getBoundingClientRect();
    const edge = rtl
      ? bounds.left + track.clientLeft + track.clientWidth - parseFloat(style.paddingRight)
      : bounds.left + track.clientLeft + parseFloat(style.paddingLeft);
    const distances = Array.from(track.children, child => {
      const rect = child.getBoundingClientRect();
      return Math.abs((rtl ? rect.right : rect.left) - edge);
    });
    return distances.indexOf(Math.min(...distances));
  }

  protected goTo(track: HTMLElement, index: number): void {
    const view = this.document.defaultView;
    const item = track.children.item(index);
    if (!view || !item) return;
    const style = view.getComputedStyle(track);
    const rtl = style.direction === 'rtl';
    const bounds = track.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    const edge = rtl
      ? bounds.left + track.clientLeft + track.clientWidth - parseFloat(style.paddingRight)
      : bounds.left + track.clientLeft + parseFloat(style.paddingLeft);
    track.scrollBy({
      left: (rtl ? rect.right : rect.left) - edge,
      behavior: view.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  protected scroll(track: HTMLElement, step: -1 | 1): void {
    const next = Math.max(0, Math.min(track.children.length - 1, this.nearestIndex(track) + step));
    this.goTo(track, next);
  }`,
  },
  {
    label: 'gallery.css',
    language: 'css',
    code: `    .track {
      inline-size: 100%; min-inline-size: 0; gap: 0.75rem; padding: 0.75rem;
      scroll-padding-inline: 0.75rem; border-radius: 1rem; background: var(--color-base-100);
    }
    .track.vertical { block-size: 15rem; scroll-padding-block: 0.75rem; }
    .track.padded { padding-inline: 2rem; scroll-padding-inline: 2rem; }
    .full { inline-size: 100%; min-inline-size: 0; }
    .slide { min-inline-size: 0; overflow: hidden; border-radius: 0.75rem; }
    .slide img { display: block; inline-size: 100%; block-size: 100%; object-fit: cover; aspect-ratio: 3 / 2; }
    .half { inline-size: 65%; }
    .full-width { inline-size: 100%; }
    .peek { inline-size: 80%; }
    .full-height { inline-size: 100%; block-size: 100%; }
    .controls { justify-content: center; }
    .controls [aria-current='true'] { outline: 2px solid var(--color-primary); outline-offset: 2px; }
    .track:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) { .track { scroll-behavior: auto; } }
`,
  },
] as const;

export const peekFiles = [
  {
    label: 'gallery.html',
    language: 'html',
    code: `<div zdCarousel align="center" class="track padded" role="region" aria-label="Centred landscapes" tabindex="0">@for (slide of slides; track slide.id; let index = $index) {
  <div zdCarouselItem class="slide peek" role="group" [attr.aria-label]="index + 1 + ' of ' + slides.length">
    <img [src]="slide.src" width="768" [height]="slide.height" [alt]="slide.alt" loading="lazy" />
  </div>
}</div>`,
  },
  {
    label: 'gallery.ts',
    language: 'ts',
    code: `import { DOCUMENT } from '@angular/common';
import { inject, signal } from '@angular/core';

// Inside your component:
protected readonly slides = [
  {
    "id": "morning",
    "label": "Morning lake",
    "src": "images/showcase/lake-morning.webp",
    "height": 512,
    "alt": "Mountain lake in the morning"
  },
  {
    "id": "sunset",
    "label": "Sunset lake",
    "src": "images/showcase/lake-sunset.webp",
    "height": 512,
    "alt": "Mountain lake at sunset"
  },
  {
    "id": "coast",
    "label": "Coast",
    "src": "images/showcase/coast.webp",
    "height": 432,
    "alt": "Cliffs overlooking the sea"
  }
];
  private readonly document = inject(DOCUMENT);
  protected readonly controlIndex = signal(0);
  protected readonly indicatorIndex = signal(0);

  protected nearestIndex(track: HTMLElement): number {
    const view = this.document.defaultView;
    if (!view) return 0;
    const style = view.getComputedStyle(track);
    const rtl = style.direction === 'rtl';
    const bounds = track.getBoundingClientRect();
    const edge = rtl
      ? bounds.left + track.clientLeft + track.clientWidth - parseFloat(style.paddingRight)
      : bounds.left + track.clientLeft + parseFloat(style.paddingLeft);
    const distances = Array.from(track.children, child => {
      const rect = child.getBoundingClientRect();
      return Math.abs((rtl ? rect.right : rect.left) - edge);
    });
    return distances.indexOf(Math.min(...distances));
  }

  protected goTo(track: HTMLElement, index: number): void {
    const view = this.document.defaultView;
    const item = track.children.item(index);
    if (!view || !item) return;
    const style = view.getComputedStyle(track);
    const rtl = style.direction === 'rtl';
    const bounds = track.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    const edge = rtl
      ? bounds.left + track.clientLeft + track.clientWidth - parseFloat(style.paddingRight)
      : bounds.left + track.clientLeft + parseFloat(style.paddingLeft);
    track.scrollBy({
      left: (rtl ? rect.right : rect.left) - edge,
      behavior: view.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  protected scroll(track: HTMLElement, step: -1 | 1): void {
    const next = Math.max(0, Math.min(track.children.length - 1, this.nearestIndex(track) + step));
    this.goTo(track, next);
  }`,
  },
  {
    label: 'gallery.css',
    language: 'css',
    code: `    .track {
      inline-size: 100%; min-inline-size: 0; gap: 0.75rem; padding: 0.75rem;
      scroll-padding-inline: 0.75rem; border-radius: 1rem; background: var(--color-base-100);
    }
    .track.vertical { block-size: 15rem; scroll-padding-block: 0.75rem; }
    .track.padded { padding-inline: 2rem; scroll-padding-inline: 2rem; }
    .full { inline-size: 100%; min-inline-size: 0; }
    .slide { min-inline-size: 0; overflow: hidden; border-radius: 0.75rem; }
    .slide img { display: block; inline-size: 100%; block-size: 100%; object-fit: cover; aspect-ratio: 3 / 2; }
    .half { inline-size: 65%; }
    .full-width { inline-size: 100%; }
    .peek { inline-size: 80%; }
    .full-height { inline-size: 100%; block-size: 100%; }
    .controls { justify-content: center; }
    .controls [aria-current='true'] { outline: 2px solid var(--color-primary); outline-offset: 2px; }
    .track:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) { .track { scroll-behavior: auto; } }
`,
  },
] as const;

export const verticalFiles = [
  {
    label: 'gallery.html',
    language: 'html',
    code: `<div zdCarousel orientation="vertical" class="track vertical" role="region" aria-label="Vertical landscapes" tabindex="0">@for (slide of slides; track slide.id; let index = $index) {
  <div zdCarouselItem class="slide full-height" role="group" [attr.aria-label]="index + 1 + ' of ' + slides.length">
    <img [src]="slide.src" width="768" [height]="slide.height" [alt]="slide.alt" loading="lazy" />
  </div>
}</div>`,
  },
  {
    label: 'gallery.ts',
    language: 'ts',
    code: `import { DOCUMENT } from '@angular/common';
import { inject, signal } from '@angular/core';

// Inside your component:
protected readonly slides = [
  {
    "id": "morning",
    "label": "Morning lake",
    "src": "images/showcase/lake-morning.webp",
    "height": 512,
    "alt": "Mountain lake in the morning"
  },
  {
    "id": "sunset",
    "label": "Sunset lake",
    "src": "images/showcase/lake-sunset.webp",
    "height": 512,
    "alt": "Mountain lake at sunset"
  },
  {
    "id": "coast",
    "label": "Coast",
    "src": "images/showcase/coast.webp",
    "height": 432,
    "alt": "Cliffs overlooking the sea"
  }
];
  private readonly document = inject(DOCUMENT);
  protected readonly controlIndex = signal(0);
  protected readonly indicatorIndex = signal(0);

  protected nearestIndex(track: HTMLElement): number {
    const view = this.document.defaultView;
    if (!view) return 0;
    const style = view.getComputedStyle(track);
    const rtl = style.direction === 'rtl';
    const bounds = track.getBoundingClientRect();
    const edge = rtl
      ? bounds.left + track.clientLeft + track.clientWidth - parseFloat(style.paddingRight)
      : bounds.left + track.clientLeft + parseFloat(style.paddingLeft);
    const distances = Array.from(track.children, child => {
      const rect = child.getBoundingClientRect();
      return Math.abs((rtl ? rect.right : rect.left) - edge);
    });
    return distances.indexOf(Math.min(...distances));
  }

  protected goTo(track: HTMLElement, index: number): void {
    const view = this.document.defaultView;
    const item = track.children.item(index);
    if (!view || !item) return;
    const style = view.getComputedStyle(track);
    const rtl = style.direction === 'rtl';
    const bounds = track.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    const edge = rtl
      ? bounds.left + track.clientLeft + track.clientWidth - parseFloat(style.paddingRight)
      : bounds.left + track.clientLeft + parseFloat(style.paddingLeft);
    track.scrollBy({
      left: (rtl ? rect.right : rect.left) - edge,
      behavior: view.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  protected scroll(track: HTMLElement, step: -1 | 1): void {
    const next = Math.max(0, Math.min(track.children.length - 1, this.nearestIndex(track) + step));
    this.goTo(track, next);
  }`,
  },
  {
    label: 'gallery.css',
    language: 'css',
    code: `    .track {
      inline-size: 100%; min-inline-size: 0; gap: 0.75rem; padding: 0.75rem;
      scroll-padding-inline: 0.75rem; border-radius: 1rem; background: var(--color-base-100);
    }
    .track.vertical { block-size: 15rem; scroll-padding-block: 0.75rem; }
    .track.padded { padding-inline: 2rem; scroll-padding-inline: 2rem; }
    .full { inline-size: 100%; min-inline-size: 0; }
    .slide { min-inline-size: 0; overflow: hidden; border-radius: 0.75rem; }
    .slide img { display: block; inline-size: 100%; block-size: 100%; object-fit: cover; aspect-ratio: 3 / 2; }
    .half { inline-size: 65%; }
    .full-width { inline-size: 100%; }
    .peek { inline-size: 80%; }
    .full-height { inline-size: 100%; block-size: 100%; }
    .controls { justify-content: center; }
    .controls [aria-current='true'] { outline: 2px solid var(--color-primary); outline-offset: 2px; }
    .track:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) { .track { scroll-behavior: auto; } }
`,
  },
] as const;

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

export const carouselReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Carousel',
  maturity: 'preview',
  description:
    "Scroll-snap layout for a native scroll container. zdCarousel and zdCarouselItem apply daisyUI's carousel classes; scrolling, controls, semantics and position stay with you.",
  facts: carouselFacts,
  notice:
    'A layout directive with consumer-owned controls and scroll position. Manual assistive-technology review is pending.',
  install: {
    description: 'Import the directives and register their classes with Tailwind.',
    importCode: carouselImportCode,
    stylesCode: carouselSourceCode,
  },
  playgroundDescription:
    'Scroll the region with a trackpad, a mouse wheel or arrow keys after focusing it.',
  api: {
    description: 'Two standalone directives. No outputs, models, navigation methods or timers.',
    tables: [
      {
        id: 'directives',
        heading: 'Directives',
        caption: 'Carousel directives',
        ...carouselParts,
      },
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Carousel inputs',
        ...carouselInputs,
      },
    ],
    typesLabel: '@pranxy/zordon-ui/carousel',
    typesCode: carouselTypesCode,
  },
  accessibility: {
    description: 'Semantics, labels, focus and controls belong to your markup.',
    features: carouselAccessibilityNotes,
  },
  customization: {
    description: 'Item width, gap, padding and responsive axis are ordinary classes and styles.',
    code: {
      label: 'custom.html',
      language: 'html',
      code: carouselCustomizationCode,
    },
  },
  ssr: 'The server renders the scroll container and images. Native scrolling works before hydration; the example buttons start working once the page hydrates.',
};
