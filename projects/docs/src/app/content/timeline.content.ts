import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { apiColumns, controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Timeline reference content. Mirrors projects/components/timeline/src/timeline.ts and
 * docs/components/timeline.md — update them together.
 */

export const timelineReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Timeline',
  maturity: 'planned',
  description:
    'daisyUI’s event layout on a native list: start, middle and end slots per item, joined by your own connectors. Horizontal, vertical or compact.',
  facts: controlFacts('[zdTimeline]', 'timeline', 'timeline'),
  notice: plannedNotice,
  install: {
    description: 'Import the parts your template uses, and register their classes with Tailwind.',
    importCode: `import {
  ZdTimeline,
  ZdTimelineBox,
  ZdTimelineEnd,
  ZdTimelineMiddle,
  ZdTimelineSnapIcon,
  ZdTimelineStart,
} from '@pranxy/zordon-ui/timeline';`,
    stylesCode: tailwindSource(
      'timeline timeline-horizontal timeline-vertical timeline-compact timeline-start timeline-middle timeline-end timeline-box timeline-snap-icon',
    ),
  },
  playgroundDescription:
    'The hr elements are the connecting lines; color the completed ones yourself. Compact puts every item on one side.',
  api: {
    description:
      'A list directive with two inputs, and five part directives that add their class only.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Timeline inputs',
        columns: apiColumns,
        rows: [
          {
            name: 'orientation',
            type: 'ZdTimelineOrientation',
            default: 'undefined',
            description:
              '`horizontal` or `vertical` adds `timeline-<orientation>`. Omit it for daisyUI’s horizontal default.',
          },
          {
            name: 'compact',
            type: 'boolean',
            default: 'false',
            description: 'Adds `timeline-compact`: all content on the end side.',
          },
        ],
      },
      {
        id: 'parts',
        heading: 'Parts',
        caption: 'Timeline parts',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          { name: '[zdTimelineStart]', description: '`timeline-start`: before the marker.' },
          { name: '[zdTimelineMiddle]', description: '`timeline-middle`: the marker or icon.' },
          { name: '[zdTimelineEnd]', description: '`timeline-end`: after the marker.' },
          { name: '[zdTimelineBox]', description: '`timeline-box`: a bordered card for a slot.' },
          {
            name: '[zdTimelineSnapIcon]',
            description:
              '`timeline-snap-icon`: on the list, aligns markers to the top of the content.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/timeline',
    typesCode: `export type ZdTimelineOrientation = 'horizontal' | 'vertical';`,
  },
  accessibility: {
    description:
      'It stays a native list, so screen readers announce the number of events. No roles or focus are added.',
    features: [
      {
        title: 'Ordered when it matters',
        body: 'Use ol for a sequence, and label the list, such as “Release history”.',
      },
      {
        title: 'Real dates',
        body: 'Wrap dates in time elements with a datetime attribute.',
      },
      {
        title: 'State in words',
        body: 'A colored connector is decoration; say “Done” or “Next” in the text too.',
      },
      {
        title: 'Hide decoration',
        body: 'Icons and hr connectors are decorative; mark icons aria-hidden.',
      },
    ],
  },
  customization: {
    description:
      'Connector color, icon and box styles are your CSS. A responsive class switches direction at a breakpoint.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.done hr {
  background: var(--color-primary);
}

.done .marker {
  color: var(--color-primary);
}`,
    },
  },
  ssr: 'The directives only add classes, so the server renders the finished timeline.',
};

export const timelinePlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'orientation',
    options: ['horizontal', 'vertical'].map(value => ({ value, label: value })),
    defaultValue: 'vertical',
  },
  { kind: 'boolean', key: 'compact', defaultValue: false },
];

export const timelinePlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<ol zdTimeline${attributes} aria-label="Release history">
  <li class="done">
    <div zdTimelineStart><time datetime="2026-03">March 2026</time></div>
    <div zdTimelineMiddle aria-hidden="true">●</div>
    <div zdTimelineEnd zdTimelineBox>Preview · done</div>
    <hr />
  </li>
  <li>
    <hr />
    <div zdTimelineStart><time datetime="2026-09">September 2026</time></div>
    <div zdTimelineMiddle aria-hidden="true">○</div>
    <div zdTimelineEnd zdTimelineBox>Stable · next</div>
  </li>
</ol>`,
};

export const snapCode = `<ol zdTimeline zdTimelineSnapIcon orientation="vertical" compact aria-label="Order 1042">
  <li class="done">
    <div zdTimelineMiddle aria-hidden="true">✓</div>
    <div zdTimelineEnd>
      <time datetime="2026-09-21T09:12">21 Sep, 09:12</time>
      <p>Order placed</p>
      <p class="detail">Paid by card ending 4242.</p>
    </div>
    <hr />
  </li>
  …
</ol>`;
