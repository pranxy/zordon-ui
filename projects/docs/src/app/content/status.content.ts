import type {
  PlaygroundControl,
  PlaygroundElementSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  apiColumns,
  colorAndSizeTypes,
  colorControl,
  colorRow,
  controlFacts,
  modifierClasses,
  plannedNotice,
  sizeControl,
  sizeRow,
  tailwindSource,
} from './form-controls.content';

/**
 * Status reference content. Mirrors projects/components/status/src/status.ts and
 * docs/components/status.md — update them together.
 */

export const statusReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Status',
  maturity: 'planned',
  description:
    'daisyUI’s small state dot in every theme color and size. It is a visual marker only: the words that explain it stay yours.',
  facts: controlFacts('[zdStatus]', 'status', 'status'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdStatus } from '@pranxy/zordon-ui/status';`,
    stylesCode: tailwindSource(modifierClasses('status')),
  },
  playgroundDescription:
    'The dot is decorative here, so the text beside it says the state. Color alone would not.',
  api: {
    description: 'A standalone directive on any element, usually an empty span.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Status inputs',
        columns: apiColumns,
        rows: [colorRow('ZdStatusColor', 'status'), sizeRow('ZdStatusSize', 'status')],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/status',
    typesCode: colorAndSizeTypes('ZdStatus'),
  },
  accessibility: {
    description:
      'Status adds no role, name, live region or animation. Decide whether the dot is decoration or information.',
    features: [
      {
        title: 'Decorative with text',
        body: 'Beside words such as “Online”, hide the dot with aria-hidden="true".',
      },
      {
        title: 'Alone, it needs a name',
        body: 'Without text, give it role="img" and an aria-label that says the state.',
      },
      {
        title: 'Changes are quiet',
        body: 'A color change is not announced. Use your own live region when it matters.',
      },
      {
        title: 'Calm animations',
        body: 'Pulses are your CSS; stop them under prefers-reduced-motion.',
      },
    ],
  },
  customization: {
    description:
      'A pulse is a second dot behind the first, animated with your own CSS and switched off for reduced motion.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.pulse {
  display: inline-grid;
}

.pulse > * {
  grid-area: 1 / 1;
}

@media (prefers-reduced-motion: no-preference) {
  .pulse > :first-child {
    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}`,
    },
  },
  ssr: 'The directive only adds classes, so the server renders the finished dot.',
};

export const statusPlaygroundControls: readonly PlaygroundControl[] = [colorControl, sizeControl];

export const statusPlaygroundSnippet: PlaygroundElementSnippet = {
  element: 'span',
  directive: 'zdStatus aria-hidden="true"',
  content: '',
};

export const textFiles = [
  {
    label: 'services.html',
    language: 'html' as const,
    code: `<li><span zdStatus color="success" aria-hidden="true"></span> API · Operational</li>
<li><span zdStatus color="warning" aria-hidden="true"></span> Search · Degraded</li>
<li><span zdStatus color="error" aria-hidden="true"></span> Email · Down</li>
<!-- No text beside it: name the dot itself -->
<span zdStatus color="success" role="img" aria-label="Online"></span>`,
  },
];

export const pulseCode = `<span class="pulse" aria-hidden="true">
  <span zdStatus color="error"></span>
  <span zdStatus color="error"></span>
</span>
<span>Recording</span>`;
