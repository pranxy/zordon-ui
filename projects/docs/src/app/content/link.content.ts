import type {
  PlaygroundControl,
  PlaygroundElementSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  apiColumns,
  colorControl,
  controlFacts,
  modifierClasses,
  plannedNotice,
  tailwindSource,
} from './form-controls.content';

/**
 * Link reference content. Mirrors projects/components/link/src/link.ts and docs/components/link.md
 * — update them together.
 */

export const linkReference: DocsReference = {
  eyebrow: 'Navigation',
  heading: 'Link',
  maturity: 'planned',
  description:
    'daisyUI’s underlined link style on a real anchor. Navigation stays native or Router-owned; Link adds color, hover-only underlines and an unavailable state.',
  facts: controlFacts('a[zdLink]', 'link', 'link'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdLink } from '@pranxy/zordon-ui/link';`,
    stylesCode: tailwindSource(modifierClasses('link', { sizes: false, extra: ['link-hover'] })),
  },
  playgroundDescription:
    'Link colors must keep contrast on your surface; the inherited color is the safe default.',
  api: {
    description:
      'A standalone directive on `<a>`. It never writes aria-current or wraps the Router.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Link inputs',
        columns: apiColumns,
        rows: [
          {
            name: 'color',
            type: 'ZdColor',
            default: 'undefined',
            description: 'Adds `link-<color>`. Omit to inherit the text color.',
          },
          {
            name: 'hover',
            type: 'boolean',
            default: 'false',
            description: 'Adds `link-hover`: underline only while a pointer hovers.',
          },
          {
            name: 'zdDisabled',
            type: 'boolean',
            default: 'false',
            description:
              'Sets `aria-disabled` and blocks native href navigation; the link stays focusable. It does not stop RouterLink.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/link',
    typesCode: `export interface ZdLinkDefaults {
  readonly color?: ZdColor;
  readonly hover?: boolean;
}
// provideZordonUi({}, withLinkDefaults({ color: 'primary', hover: true }))`,
  },
  accessibility: {
    description: 'It stays a native link: Enter follows it, and the browser’s link menu works.',
    features: [
      {
        title: 'Links go places',
        body: 'Use a Button for in-page actions. Link belongs on anchors with a destination.',
      },
      {
        title: 'Current page is Router’s',
        body: 'Pair with routerLinkActive and ariaCurrentWhenActive="page" for current-page state.',
      },
      {
        title: 'Say it opens a window',
        body: 'target="_blank" is yours: add visible or hidden text, and choose rel.',
      },
      {
        title: 'Hover-only underlines',
        body: 'With hover, color alone marks the link until hovered. Keep that for menus and lists.',
      },
    ],
  },
  customization: {
    description:
      'Your classes, target, rel, download and Router directives all stay on the anchor. Set app-wide defaults with withLinkDefaults.',
    code: {
      label: 'app.config.ts',
      language: 'ts',
      code: `import { provideZordonUi } from '@pranxy/zordon-ui';
import { withLinkDefaults } from '@pranxy/zordon-ui/link';

export const appConfig = {
  providers: [provideZordonUi({}, withLinkDefaults({ hover: true }))],
};`,
    },
  },
  ssr: 'The directive only adds classes and aria-disabled, so the server renders the finished link. It works before hydration; the disabled guard applies after it.',
};

export const linkPlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  { kind: 'boolean', key: 'hover', defaultValue: false },
  { kind: 'boolean', key: 'zdDisabled', defaultValue: false },
];

export const linkPlaygroundSnippet: PlaygroundElementSnippet = {
  element: 'a',
  directive: 'zdLink routerLink="/components"',
  content: 'Browse the components',
};

export const routerCode = `<a zdLink routerLink="/components/link" routerLinkActive="current"
   ariaCurrentWhenActive="page">Link</a>
<a zdLink routerLink="/components/button">Button</a>`;

export const disabledFiles = [
  {
    label: 'billing.html',
    language: 'html' as const,
    code: `<a zdLink href="/components/modal" [zdDisabled]="!paid()">Billing history</a>`,
  },
  {
    label: 'billing.ts',
    language: 'ts' as const,
    code: `protected readonly paid = signal(false);`,
  },
];

export const externalCode = `<a zdLink href="https://daisyui.com/components/link/" target="_blank" rel="noopener">
  daisyUI Link <span class="docs-visually-hidden">(opens in a new tab)</span>
</a>`;
