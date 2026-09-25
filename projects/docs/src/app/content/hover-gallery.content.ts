import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Hover Gallery reference content. Mirrors projects/components/hover-gallery/src/hover-gallery.ts
 * and docs/components/hover-gallery.md — update them together.
 */

export const hoverGalleryReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Hover Gallery',
  maturity: 'planned',
  description:
    'daisyUI’s hover-to-preview image strip on your own figure. The first image shows; moving the pointer across reveals the others. Pure CSS.',
  facts: controlFacts('[zdHoverGallery]', 'hover-gallery', 'hover-gallery'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the class it adds with Tailwind.',
    importCode: `import { ZdHoverGallery } from '@pranxy/zordon-ui/hover-gallery';`,
    stylesCode: tailwindSource('hover-gallery'),
  },
  playgroundDescription:
    'Move the pointer from left to right across the image. Each slice of the width reveals the next picture.',
  api: {
    description:
      'One standalone directive with no inputs. It adds the `hover-gallery` class; the children are yours.',
    tables: [
      {
        id: 'markup',
        heading: 'Markup',
        caption: 'Hover Gallery children',
        columns: [
          { key: 'name', label: 'Child', kind: 'name' },
          { key: 'description', label: 'Behaviour' },
        ],
        rows: [
          { name: 'First child', description: 'Shown until the pointer enters the gallery.' },
          {
            name: 'Children 2–10',
            description: 'Each takes an equal slice of the width and shows while hovered.',
          },
          { name: 'Children 11+', description: 'Hidden. daisyUI supports up to ten images.' },
        ],
      },
    ],
  },
  accessibility: {
    description:
      'The gallery adds no role, focus, selection or announcements. Every image stays in the page.',
    features: [
      {
        title: 'Every alt is read',
        body: 'Screen readers meet all the images in order, so each needs its own alternative text.',
      },
      {
        title: 'Hover only',
        body: 'Keyboard and touch users see the first image. Put anything essential in it, or add native thumbnails.',
      },
      {
        title: 'Not a carousel',
        body: 'There is no current slide to announce. Use Carousel when people need to step through images.',
      },
      {
        title: 'Caption it',
        body: 'A figcaption explains what the pictures show for everyone.',
      },
    ],
  },
  customization: {
    description:
      'Size, aspect ratio and radius are classes on the figure; loading and fallbacks belong to your images.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.product {
  inline-size: min(24rem, 100%);
  aspect-ratio: 4 / 3;
  border-radius: 1rem;
}`,
    },
  },
  ssr: 'The directive only adds a class and the effect is CSS, so the server HTML already works.',
};

export const galleryCode = `<figure zdHoverGallery class="product">
  <img src="trainer-front.webp" alt="Blue trainer, front view" />
  <img src="trainer-side.webp" alt="Blue trainer, side view" />
  <img src="trainer-sole.webp" alt="Blue trainer, sole" />
  <img src="trainer-back.webp" alt="Blue trainer, heel" />
</figure>`;

export const captionCode = `<figure class="captioned">
  <div zdHoverGallery class="product">
    <img src="lake-dawn.webp" alt="The lake at dawn" />
    <img src="lake-noon.webp" alt="The lake at noon" />
    <img src="lake-dusk.webp" alt="The lake at dusk" />
  </div>
  <figcaption>One view, three times of day. Hover to compare.</figcaption>
</figure>`;
