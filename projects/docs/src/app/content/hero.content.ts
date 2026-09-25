import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Hero reference content. Mirrors projects/components/hero/src/hero.ts and docs/components/hero.md
 * — update them together.
 */

export const heroReference: DocsReference = {
  eyebrow: 'Layout',
  heading: 'Hero',
  maturity: 'planned',
  description:
    'daisyUI’s large banner layout: a centred content box over an optional background and overlay. Headings, media and actions stay yours.',
  facts: controlFacts('[zdHero]', 'hero', 'hero'),
  notice: plannedNotice,
  install: {
    description: 'Import the directives you use, and register their classes with Tailwind.',
    importCode: `import { ZdHero, ZdHeroContent, ZdHeroOverlay } from '@pranxy/zordon-ui/hero';`,
    stylesCode: tailwindSource('hero hero-content hero-overlay'),
  },
  playgroundDescription:
    'The overlay sits between your background and the content, so text keeps its contrast over an image.',
  api: {
    description: 'Three standalone directives with no inputs.',
    tables: [
      {
        id: 'parts',
        heading: 'Parts',
        caption: 'Hero parts',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          { name: '[zdHero]', description: '`hero`: a grid that centres its layers.' },
          {
            name: '[zdHeroContent]',
            description: '`hero-content`: the padded, centred content box.',
          },
          {
            name: '[zdHeroOverlay]',
            description: '`hero-overlay`: a tinted layer over the background.',
          },
        ],
      },
    ],
  },
  accessibility: {
    description:
      'Hero adds no roles. Use a section named by its heading, and real buttons or links.',
    features: [
      {
        title: 'Name the section',
        body: 'aria-labelledby pointing at the hero heading names the region.',
      },
      {
        title: 'Text over images',
        body: 'Check contrast against the darkest and lightest parts of the background, with the overlay.',
      },
      {
        title: 'Background is decoration',
        body: 'A CSS background has no alternative text; put anything meaningful in the content.',
      },
      {
        title: 'Motion',
        body: 'Background video or animation needs a pause control and a reduced-motion fallback.',
      },
    ],
  },
  customization: {
    description:
      'Height, background and layout inside the content are your classes. The overlay color is a background you can override.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.launch {
  min-block-size: 24rem;
  background: url('/launch.webp') center / cover;
}

.launch .hero-overlay {
  background: color-mix(in oklab, var(--color-neutral) 60%, transparent);
}`,
    },
  },
  ssr: 'The directives only add classes, so the server renders the finished hero.',
};

export const overlayCode = `<section zdHero class="launch" aria-labelledby="launch-title">
  <div zdHeroOverlay></div>
  <div zdHeroContent class="launch-content">
    <div>
      <h2 id="launch-title">Build faster with native Angular</h2>
      <p>Components that keep your markup.</p>
      <a zdButton color="primary" href="/docs/getting-started" routerLink="/docs/getting-started">Get started</a>
    </div>
  </div>
</section>`;

export const sideCode = `<section zdHero aria-labelledby="book-title">
  <div zdHeroContent class="side">
    <div class="cover" role="img" aria-label="Book cover: Field notes"></div>
    <div>
      <h2 id="book-title">Field notes</h2>
      <p>Twelve short essays on building accessible interfaces.</p>
      <button zdButton type="button">Read a sample</button>
    </div>
  </div>
</section>`;
