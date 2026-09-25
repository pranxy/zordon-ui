import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Navbar reference content. Mirrors projects/components/navbar/src/navbar.ts and
 * docs/components/navbar.md — update them together.
 */

export const navbarReference: DocsReference = {
  eyebrow: 'Navigation',
  heading: 'Navbar',
  maturity: 'planned',
  description:
    'A named navigation bar with start, center and end regions, responsive content wrappers and a native toggle button for a panel you control.',
  facts: controlFacts('zd-navbar', 'navbar', 'navbar'),
  notice: plannedNotice,
  install: {
    description:
      'Import the bar, the content wrapper and the toggle. Links and buttons inside are yours to style.',
    importCode: `import { ZdNavbar, ZdNavbarContent, ZdNavbarToggle } from '@pranxy/zordon-ui/navbar';`,
    stylesCode: tailwindSource('navbar navbar-start navbar-center navbar-end'),
  },
  playgroundDescription:
    'Mark children with zdNavbarStart, zdNavbarCenter or zdNavbarEnd; unmarked content goes to the center.',
  api: {
    description:
      'Three standalone pieces. Region markers are projection attributes, not directives to import.',
    tables: [
      {
        id: 'navbar',
        heading: 'Navbar and content',
        caption: 'Navbar and content inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'label',
            type: 'string',
            default: "'Primary navigation'",
            description: 'zd-navbar: name of the navigation landmark.',
          },
          {
            name: 'position',
            type: 'ZdNavbarPosition',
            default: "'static'",
            description: 'zd-navbar: `static`, `sticky` or `fixed` (reserve the space yourself).',
          },
          {
            name: 'transparent',
            type: 'boolean',
            default: 'false',
            description: 'zd-navbar: no background; check contrast on what is underneath.',
          },
          {
            name: 'visibility',
            type: 'ZdNavbarVisibility',
            default: "'always'",
            description: 'zd-navbar-content: `desktop` from 48rem, `mobile` below, or `always`.',
          },
        ],
      },
      {
        id: 'toggle',
        heading: 'Toggle',
        caption: 'Navbar toggle inputs and outputs',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'controls',
            type: 'string',
            description: 'Required: the id of the panel you show and hide.',
          },
          {
            name: 'expanded',
            type: 'boolean',
            description: 'Your accepted state, reflected to aria-expanded.',
          },
          {
            name: 'expandedChange',
            type: 'boolean',
            description: 'Requests the opposite state; use `[(expanded)]` to accept.',
          },
          { name: 'disabled', type: 'boolean', description: 'The native disabled button.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/navbar',
    typesCode: `export type ZdNavbarPosition = 'static' | 'sticky' | 'fixed';
export type ZdNavbarVisibility = 'always' | 'desktop' | 'mobile';`,
  },
  accessibility: {
    description:
      'A named nav of native links and buttons. Links are not turned into menu items and keys are not intercepted.',
    features: [
      {
        title: 'Distinct names',
        body: 'Give each navigation landmark its own label; wrap it in a header if it is the banner.',
      },
      {
        title: 'Toggle reports state',
        body: 'The toggle sets aria-expanded and aria-controls; you decide what opening means.',
      },
      {
        title: 'Hidden means hidden',
        body: 'Responsive content uses display: none, so hidden links leave the tab order.',
      },
      {
        title: 'Focus is yours',
        body: 'Closing a panel that holds focus should move focus back to the toggle.',
      },
    ],
  },
  customization: {
    description:
      '--zd-navbar-top offsets sticky and fixed bars; --zd-navbar-z-index controls stacking. Style links with Link or Button.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `zd-navbar.below-banner {
  --zd-navbar-top: 3rem;
  --zd-navbar-z-index: 30;
}`,
    },
  },
  ssr: 'The server renders the same landmark, regions and links; they work without JavaScript. The toggle needs hydration, so render a mobile panel open if its links are essential.',
};

export const navbarPlaygroundControls: readonly PlaygroundControl[] = [
  { kind: 'boolean', key: 'transparent', defaultValue: false },
];

export const navbarPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-navbar label="Site"${attributes}>
  <a zdNavbarStart routerLink="/">Acme</a>
  <a zdLink routerLink="/pricing">Pricing</a>
  <a zdLink routerLink="/docs">Docs</a>
  <a zdNavbarEnd zdButton href="/signin" routerLink="/signin" size="sm">Sign in</a>
</zd-navbar>`,
};

export const responsiveFiles = [
  {
    label: 'site-nav.html',
    language: 'html' as const,
    code: `<zd-navbar label="Site">
  <zd-navbar-content zdNavbarStart>
    <a routerLink="/">Acme</a>
    <zd-navbar-content visibility="mobile">
      <button zdNavbarToggle controls="mobile-links" [(expanded)]="open">Menu</button>
    </zd-navbar-content>
  </zd-navbar-content>
  <zd-navbar-content zdNavbarCenter visibility="desktop">
    <a routerLink="/pricing">Pricing</a>
    <a routerLink="/docs">Docs</a>
  </zd-navbar-content>
</zd-navbar>
<nav id="mobile-links" aria-label="Site, mobile" [hidden]="!open()">…</nav>`,
  },
  {
    label: 'site-nav.ts',
    language: 'ts' as const,
    code: `protected readonly open = signal(false);`,
  },
];

export const toggleCode = `<button zdNavbarToggle controls="filters" [(expanded)]="filtersOpen">Filters</button>
<section id="filters" aria-label="Filters" [hidden]="!filtersOpen()">…</section>`;
