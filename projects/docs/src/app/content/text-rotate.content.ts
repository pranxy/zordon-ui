import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Text Rotate reference content. Mirrors projects/components/text-rotate/src/text-rotate.ts and
 * docs/components/text-rotate.md — update them together.
 */

export const textRotateReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Text Rotate',
  maturity: 'planned',
  description:
    'daisyUI’s rotating words: up to six lines that cycle in place, pausing on hover. Pure CSS; the words and their fallback stay yours.',
  facts: controlFacts('[zdTextRotate]', 'text-rotate', 'text-rotate'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the class it adds with Tailwind.',
    importCode: `import { ZdTextRotate } from '@pranxy/zordon-ui/text-rotate';`,
    stylesCode: tailwindSource('text-rotate'),
  },
  playgroundDescription:
    'The words cycle every ten seconds and pause while hovered. Screen readers get the whole sentence from hidden text instead.',
  api: {
    description: 'One standalone directive with no inputs. It adds the `text-rotate` class only.',
    tables: [
      {
        id: 'markup',
        heading: 'Required markup',
        caption: 'Text Rotate structure',
        columns: [
          { key: 'name', label: 'Element', kind: 'name' },
          { key: 'description', label: 'Purpose' },
        ],
        rows: [
          { name: '[zdTextRotate]', description: 'The one-line window that clips the words.' },
          { name: 'One child', description: 'A wrapper that moves; it holds every line.' },
          { name: 'Lines', description: 'Two to six elements, one word or phrase each.' },
        ],
      },
    ],
  },
  accessibility: {
    description:
      'Every word stays in the DOM, so a screen reader would read them all as one run. Give it a proper sentence instead.',
    features: [
      {
        title: 'Hide the animation',
        body: 'Mark the rotating element aria-hidden and put the full sentence in visually hidden text.',
      },
      {
        title: 'No announcements',
        body: 'Changes are not announced, and should not be: it is decoration, not status.',
      },
      {
        title: 'Reduced motion',
        body: 'daisyUI stops the sliding under prefers-reduced-motion; with three or more lines the first one stays.',
      },
      {
        title: 'Hover pauses',
        body: 'Pointer users can stop it by hovering. Keep essential content out of later lines.',
      },
    ],
  },
  customization: {
    description:
      'Set the cycle length with the `--duration` variable; color, weight and alignment are ordinary CSS.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.headline {
  --duration: 6s;
  color: var(--color-primary);
}`,
    },
  },
  ssr: 'The directive only adds a class and the animation is CSS, so it starts before hydration.',
};

export const rotateCode = `<p class="headline">
  <span class="visually-hidden">Design, build and ship.</span>
  <span aria-hidden="true">
    <span zdTextRotate>
      <span><span>Design</span><span>Build</span><span>Ship</span></span>
    </span>
  </span>
</p>`;

export const sentenceCode = `<p>
  <span class="visually-hidden">Made for designers, developers and writers.</span>
  <span aria-hidden="true">
    Made for
    <span zdTextRotate class="fast">
      <span><span>designers</span><span>developers</span><span>writers</span></span>
    </span>
  </span>
</p>`;
