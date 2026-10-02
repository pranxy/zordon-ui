import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Hover 3D reference content. Mirrors projects/components/hover-3d/src/hover-3d.ts and
 * docs/components/hover-3d.md — update them together.
 */

export const hover3dReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Hover 3D Card',
  maturity: 'planned',
  description:
    'daisyUI’s tilt-toward-the-pointer effect on your own wrapper. It is pure CSS: one content child, then eight empty hover zones.',
  facts: controlFacts('[zdHover3d]', 'hover-3d', 'hover-3d'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the class it adds with Tailwind.',
    importCode: `import { RouterLink } from '@angular/router';
import { ZdHover3d } from '@pranxy/zordon-ui/hover-3d';`,
    stylesCode: tailwindSource('hover-3d'),
  },
  playgroundDescription:
    'Move the pointer over the card. The eight empty elements after the content are the zones that set the tilt.',
  api: {
    description: 'One standalone directive with no inputs. It adds the `hover-3d` class only.',
    tables: [
      {
        id: 'markup',
        heading: 'Required markup',
        caption: 'Hover 3D children',
        columns: [
          { key: 'name', label: 'Child', kind: 'name' },
          { key: 'description', label: 'Purpose' },
        ],
        rows: [
          {
            name: 'First child',
            description:
              'The content that tilts: an image, a figure or a card. Keep it non-interactive.',
          },
          {
            name: 'Children 2–9',
            description:
              'Eight empty elements, one per hover zone. Mark them `aria-hidden="true"`.',
          },
        ],
      },
    ],
  },
  accessibility: {
    description:
      'The effect is decoration. It adds no role, focus, listener or motion API, and does nothing for keyboard or touch.',
    features: [
      {
        title: 'Make the wrapper the action',
        body: 'When the card goes somewhere, put the directive on a native link instead of nesting one inside.',
      },
      {
        title: 'Hide the zones',
        body: 'The eight zone elements are empty; aria-hidden keeps them out of the accessibility tree.',
      },
      {
        title: 'Nothing depends on it',
        body: 'Keyboard and touch users never see the tilt, so it must not carry information.',
      },
      {
        title: 'Motion',
        body: 'daisyUI animates the tilt on hover. Add a reduced-motion rule if your content needs it still.',
      },
    ],
  },
  customization: {
    description:
      'Size, radius and content are yours. A reduced-motion rule can switch off the tilt without touching the markup.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.art { inline-size: min(18rem, 70vw); aspect-ratio: 4 / 3; object-fit: cover; border-radius: 1rem; }

@media (prefers-reduced-motion: reduce) {
  .hover-3d > :first-child {
    transform: none;
    scale: 1;
  }
}`,
    },
  },
  ssr: 'The directive only adds a class and the effect is CSS, so the server HTML already works.',
};

export const hover3dCode = `<a zdHover3d routerLink="/components/card" class="tilt">
  <img class="art" src="images/showcase/coast.webp" alt="Explore the coastal landscape card example" width="768" height="432" loading="lazy" />
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
</a>`;

export const figureCode = `<figure zdHover3d class="tilt">
  <div class="member-card">
    <p class="brand">Zordon UI</p>
    <p>Ada Lovelace · member since 2026</p>
  </div>
  <!-- eight empty zones, as above -->
  <div aria-hidden="true"></div>
  …
</figure>`;

export const imageGalleryFiles = [
  {
    label: 'image-gallery.html',
    language: 'html' as const,
    code: `<div class="tilt-gallery">
  <figure zdHover3d class="tilt">
    <img
      src="images/showcase/coast.webp"
      alt="Atlantic coast"
      width="768"
      height="432"
      loading="lazy"
    />
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
  </figure>
  <figure zdHover3d class="tilt">
    <img
      src="images/showcase/lake-morning.webp"
      alt="Mountain lake in the morning"
      width="768"
      height="512"
      loading="lazy"
    />
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
  </figure>
  <figure zdHover3d class="tilt">
    <img
      src="images/showcase/lake-sunset.webp"
      alt="Mountain lake at sunset"
      width="768"
      height="512"
      loading="lazy"
    />
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
  </figure>
</div>`,
  },
  {
    label: 'image-gallery.css',
    language: 'css' as const,
    code: `.tilt-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr)); gap: 1.5rem; inline-size: 100%; }
.tilt-gallery figure { margin: 0; }
.tilt-gallery img { inline-size: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 1rem; }
@media (prefers-reduced-motion: reduce) { .tilt-gallery [zdHover3d] > :first-child { transform: none; scale: 1; transition: none; } }`,
  },
];
