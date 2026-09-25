import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Skeleton reference content. Mirrors projects/components/skeleton/src/skeleton.ts and
 * docs/components/skeleton.md — update them together.
 */

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const skeletonReference: DocsReference = {
  eyebrow: 'Feedback',
  heading: 'Skeleton',
  maturity: 'planned',
  description:
    'Decorative placeholders in the shape of the content that is loading. Skeleton draws the shapes; a separate region directive marks the real content busy.',
  facts: controlFacts('zd-skeleton', 'skeleton', 'skeleton'),
  notice: plannedNotice,
  install: {
    description: 'Import the component and the region directive, and register daisyUI’s class.',
    importCode: `import { ZdSkeleton, ZdSkeletonRegion } from '@pranxy/zordon-ui/skeleton';`,
    stylesCode: tailwindSource('skeleton'),
  },
  playgroundDescription:
    'Presets draw common layouts; shape applies when preset is none. Reduced motion stops the shimmer.',
  api: {
    description:
      'A standalone component for the artwork and a directive for the region it stands in for. Lengths are CSS strings.',
    tables: [
      {
        id: 'inputs',
        heading: 'Skeleton inputs',
        caption: 'Skeleton inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'active',
            type: 'boolean',
            default: 'true',
            description: '`false` hides the placeholder.',
          },
          {
            name: 'preset',
            type: 'ZdSkeletonPreset',
            default: "'none'",
            description: '`paragraph`, `avatar-text` or `card`. Wins over shape.',
          },
          {
            name: 'shape',
            type: 'ZdSkeletonShape',
            default: "'rectangle'",
            description: '`text`, `rectangle`, `circle`, or `custom` with clipPath.',
          },
          {
            name: 'width / height',
            type: 'string',
            default: "'100%' / '8rem'",
            description: 'Circles default to 3rem; text height is per line.',
          },
          {
            name: 'radius',
            type: 'string',
            default: 'daisyUI radius',
            description: 'Corner radius of the shape or lines.',
          },
          {
            name: 'clipPath',
            type: 'string',
            default: "'none'",
            description: 'A CSS clip path, for custom shapes.',
          },
          {
            name: 'lines',
            type: 'number',
            default: '3',
            description: 'Lines for text and presets, 1–100.',
          },
          {
            name: 'lastLineWidth',
            type: 'string',
            default: "'60%'",
            description: 'Width of the last line, so a paragraph looks ragged.',
          },
          {
            name: 'animation',
            type: 'ZdSkeletonAnimation',
            default: "'shimmer'",
            description: '`shimmer`, `pulse` or `none`.',
          },
          {
            name: 'speed',
            type: 'number',
            default: '1800',
            description: 'Milliseconds per cycle; larger is slower.',
          },
        ],
      },
      {
        id: 'region',
        heading: 'Region directive',
        caption: 'Skeleton region input',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'zdSkeletonRegion',
            type: 'boolean',
            default: 'false',
            description:
              'Binds `aria-busy` on the real region. A bare attribute means busy; bind `false` to clear it.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/skeleton',
    typesCode: `export type ZdSkeletonShape = 'text' | 'rectangle' | 'circle' | 'custom';
export type ZdSkeletonPreset = 'none' | 'paragraph' | 'avatar-text' | 'card';
export type ZdSkeletonAnimation = 'shimmer' | 'pulse' | 'none';`,
  },
  accessibility: {
    description:
      'Skeletons are always aria-hidden and inert. Loading state is said in text and in aria-busy, not by the artwork.',
    features: [
      {
        title: 'Say it in a status',
        body: 'Put a short status message ("Loading profile") outside the busy region.',
      },
      {
        title: 'Busy the real region',
        body: 'zdSkeletonRegion sets aria-busy on the section being filled; pass it the same state.',
      },
      {
        title: 'Shapes only',
        body: 'Never put text, controls or names inside a skeleton. It has none of its own.',
      },
      {
        title: 'Motion off when asked',
        body: 'Reduced motion and forced colors remove the animation; forced colors outline each shape.',
      },
    ],
  },
  customization: {
    description:
      'Compose individual skeletons in your own layout for anything the presets don’t cover. Widths are capped at the available space.',
    code: {
      label: 'row.html',
      language: 'html',
      code: `<div class="row">
  <zd-skeleton shape="circle" width="2.5rem" height="2.5rem" />
  <zd-skeleton shape="text" [lines]="1" lastLineWidth="12rem" />
  <zd-skeleton width="5rem" height="2rem" radius="999px" />
</div>`,
    },
  },
  ssr: 'Skeletons render entirely from their inputs, with no timers or browser reads. Hydrate with the same loading state the server used.',
};

export const skeletonPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'preset',
    options: choices(['none', 'paragraph', 'avatar-text', 'card']),
    defaultValue: 'avatar-text',
    omit: ['none'],
  },
  {
    kind: 'choice',
    key: 'shape',
    options: choices(['rectangle', 'text', 'circle']),
    defaultValue: 'rectangle',
    omit: ['rectangle'],
  },
  {
    kind: 'choice',
    key: 'animation',
    options: choices(['shimmer', 'pulse', 'none']),
    defaultValue: 'shimmer',
    omit: ['shimmer'],
  },
];

export const skeletonPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-skeleton${attributes} />`,
};

export const regionFiles = [
  {
    label: 'profile.html',
    language: 'html' as const,
    code: `<p role="status">{{ loading() ? 'Loading profile' : 'Profile ready' }}</p>
<section aria-label="Profile" [zdSkeletonRegion]="loading()">
  <zd-skeleton preset="avatar-text" [lines]="2" [active]="loading()" />
  @if (!loading()) {
    <h3>Ada Lovelace</h3>
    <p>Analyst, London</p>
  }
</section>`,
  },
  {
    label: 'profile.ts',
    language: 'ts' as const,
    code: `protected readonly loading = signal(true);`,
  },
];

export const shapesCode = `<zd-skeleton shape="circle" width="4rem" height="4rem" />
<zd-skeleton width="8rem" height="4rem" radius="1rem" />
<zd-skeleton
  shape="custom"
  width="5rem"
  height="4rem"
  clipPath="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
/>
<zd-skeleton shape="text" [lines]="3" lastLineWidth="40%" width="12rem" />`;

export const presetsCode = `<zd-skeleton preset="paragraph" [lines]="4" lastLineWidth="80%" />
<zd-skeleton preset="card" animation="pulse" [speed]="2400" />`;
