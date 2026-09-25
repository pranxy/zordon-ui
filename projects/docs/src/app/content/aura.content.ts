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
 * Aura reference content. Mirrors projects/components/aura/src/aura.ts and docs/components/aura.md
 * — update them together.
 */

export const auraVariants = ['dual', 'rainbow', 'holo', 'gold', 'silver', 'glow'] as const;

export const auraReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Aura',
  maturity: 'planned',
  description:
    'daisyUI’s decorative moving light around a wrapper. Purely visual: it adds no role, focus or events, and stops moving for reduced motion.',
  facts: controlFacts('[zdAura]', 'aura', 'aura'),
  notice: plannedNotice,
  install: {
    description:
      'Import the directive, register its classes, and load the motion stylesheet after daisyUI.',
    importCode: `import { ZdAura } from '@pranxy/zordon-ui/aura';`,
    stylesCode: `/* Stops the animation for prefers-reduced-motion */
@import '@pranxy/zordon-ui/aura/aura-motion.css';

${tailwindSource(
  modifierClasses('aura', { colors: false, extra: auraVariants.map(variant => `aura-${variant}`) }),
)}`,
  },
  playgroundDescription:
    'The wrapper needs a direct child; daisyUI matches the child’s radius. The base light follows the text color.',
  api: {
    description: 'A standalone directive that adds classes only.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Aura inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'variant',
            type: 'ZdAuraVariant',
            default: 'undefined',
            description: '`dual`, `rainbow`, `holo`, `gold`, `silver` or `glow`.',
          },
          {
            name: 'size',
            type: 'ZdAuraSize',
            default: 'undefined',
            description: 'Thickness, `xs` to `xl`. Omit for daisyUI’s medium.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/aura',
    typesCode: `export type ZdAuraSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdAuraVariant = 'dual' | 'rainbow' | 'holo' | 'gold' | 'silver' | 'glow';`,
  },
  accessibility: {
    description: 'Aura is decoration. The content inside keeps its own semantics.',
    features: [
      {
        title: 'Motion off when asked',
        body: 'aura-motion.css stops the animation under reduced motion and keeps a static border.',
      },
      {
        title: 'Put actions inside',
        body: 'Place a native button or link inside the wrapper; don’t make the wrapper clickable.',
      },
      {
        title: 'Don’t signal state',
        body: 'An aura draws attention; it can’t tell anyone why. Say it in text.',
      },
      {
        title: 'Check contrast',
        body: 'Bright variants sit around your content; the content itself must keep its contrast.',
      },
    ],
  },
  customization: {
    description:
      'Set the base light with a text color on the wrapper. Radius and padding come from the child and daisyUI’s variables.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `/* <div zdAura variant="dual" class="promo-light"> */
.promo-light {
  color: var(--color-secondary);
}`,
    },
  },
  ssr: 'Classes are rendered on the server; the animation is pure CSS and needs no hydration.',
};

export const auraPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'variant',
    options: ['default', ...auraVariants].map(value => ({ value, label: value })),
    defaultValue: 'rainbow',
    omit: ['default'],
  },
  {
    kind: 'choice',
    key: 'size',
    options: controlSizes.map(value => ({ value, label: value })),
    defaultValue: 'md',
    omit: ['md'],
  },
];

export const auraPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<div zdAura${attributes}>
  <button zdButton type="button">Start free trial</button>
</div>`,
};

export const variantsCode = auraVariants
  .map(variant => `<div zdAura variant="${variant}"><div class="tile">${variant}</div></div>`)
  .join('\n');

export const cardCode = `<div zdAura size="lg" class="brand-light">
  <article zdCard class="plan">
    <div zdCardBody>
      <h3 zdCardTitle>Pro plan</h3>
      <p>Everything in Team, plus audit logs.</p>
    </div>
  </article>
</div>`;
