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
 * Dock reference content. Mirrors projects/components/dock/src/dock.ts and docs/components/dock.md
 * — update them together.
 */

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const dockReference: DocsReference = {
  eyebrow: 'Navigation',
  heading: 'Dock',
  maturity: 'planned',
  description:
    'A bottom navigation bar of native links with icons, labels and badges. It marks the current destination from the Router and reserves its own space when fixed.',
  facts: controlFacts('zd-dock', 'dock', 'dock'),
  notice: plannedNotice,
  install: {
    description:
      'Import the component and pass destinations. Place it after the main content; fixed docks reserve their height.',
    importCode: `import { ZdDock, type ZdDockItem } from '@pranxy/zordon-ui/dock';`,
    stylesCode: tailwindSource(
      modifierClasses('dock', { colors: false, extra: ['dock-active', 'dock-label'] }),
    ),
  },
  playgroundDescription:
    'Static here so it stays in the preview; the default is fixed to the bottom of the viewport.',
  api: {
    description:
      'A standalone component driven by an items array. It has no outputs: links navigate.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Dock inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'items',
            type: 'readonly ZdDockItem[]',
            default: '[]',
            description: 'Destinations, each with a unique id and label.',
          },
          {
            name: 'label',
            type: 'string',
            default: "'Primary navigation'",
            description: 'Name of the navigation landmark.',
          },
          {
            name: 'size',
            type: 'ZdDockSize',
            default: "'md'",
            description: '`xs` to `xl`: 3 to 5rem tall, plus the bottom safe area.',
          },
          {
            name: 'position',
            type: 'ZdDockPosition',
            default: "'fixed'",
            description: '`fixed` to the viewport, `sticky`, or `static` in the flow.',
          },
          {
            name: 'visibility',
            type: 'ZdDockVisibility',
            default: "'always'",
            description: '`mobile` below 48rem, `desktop` from 48rem, or `always`.',
          },
          {
            name: 'labels',
            type: 'ZdDockLabels',
            default: "'always'",
            description: '`compact` hides labels up to 40rem; `hidden` always (names stay).',
          },
          {
            name: 'reserveSpace',
            type: 'boolean',
            default: 'true',
            description: 'A fixed dock keeps a placeholder of its height in the page.',
          },
          {
            name: 'routeExact',
            type: 'boolean',
            default: 'true',
            description: 'Exact Router matching for the current destination.',
          },
          {
            name: 'activeId',
            type: 'string | null | undefined',
            default: 'undefined',
            description: 'Follow the Router, clear with `null`, or pick an id yourself.',
          },
        ],
      },
      {
        id: 'item',
        heading: 'Item fields',
        caption: 'Dock item fields',
        columns: [
          { key: 'name', label: 'Field', kind: 'name' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          { name: 'id / label', description: 'Required. The label stays the name when hidden.' },
          {
            name: 'href / routerLink',
            description:
              'Exactly one for an enabled item; Router items take queryParams and fragment.',
          },
          {
            name: 'disabled',
            description: 'Rendered as unfocusable text with aria-disabled; needs no destination.',
          },
          { name: 'icon', description: 'Decorative TemplateRef; its context is the item.' },
          {
            name: 'badge / badgeLabel',
            description: 'A visible badge, and words appended to the link name ("3 unread").',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/dock',
    typesCode: `export type ZdDockSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdDockPosition = 'fixed' | 'sticky' | 'static';
export type ZdDockVisibility = 'always' | 'mobile' | 'desktop';
export type ZdDockLabels = 'always' | 'compact' | 'hidden';`,
  },
  accessibility: {
    description:
      'A named nav of native links. The current destination has aria-current="page"; there is no roving focus.',
    features: [
      {
        title: 'Names survive hiding',
        body: 'Compact and hidden label modes only change what is shown; each link keeps its full name.',
      },
      {
        title: 'Say what badges mean',
        body: 'A bare "3" is unclear. badgeLabel adds "3 unread messages" to the link’s name.',
      },
      {
        title: 'Disabled is explained',
        body: 'Unavailable items are skipped by Tab but still read, with aria-disabled.',
      },
      {
        title: 'One current page',
        body: 'Loose route matching can mark several items; keep routeExact or set activeId.',
      },
    ],
  },
  customization: {
    description:
      'Override --zd-dock-safe-bottom to change the safe-area padding. Icons, badges and theme colors are yours.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `zd-dock.kiosk {
  --zd-dock-safe-bottom: 0px;
}`,
    },
  },
  ssr: 'The server renders the landmark, links and badges. Router current-page state appears after hydration; pass activeId to render it on the server.',
};

export const dockSizes = controlSizes;

export const dockPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'size',
    options: choices(controlSizes),
    defaultValue: 'md',
    omit: ['md'],
  },
  {
    kind: 'choice',
    key: 'labels',
    options: choices(['always', 'compact', 'hidden']),
    defaultValue: 'always',
    omit: ['always'],
  },
];

export const dockPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes =>
    `<zd-dock [items]="destinations" label="App destinations" position="static"${attributes} />`,
};

export const destinationsFiles = [
  {
    label: 'dock.ts',
    language: 'ts' as const,
    code: `protected readonly destinations: readonly ZdDockItem[] = [
  { id: 'home', label: 'Home', routerLink: '/', icon: this.homeIcon },
  {
    id: 'inbox', label: 'Inbox', routerLink: '/inbox', icon: this.inboxIcon,
    badge: 3, badgeLabel: '3 unread messages',
  },
  { id: 'settings', label: 'Settings unavailable', disabled: true, icon: this.gearIcon },
];`,
  },
  {
    label: 'dock.html',
    language: 'html' as const,
    code: `<main>…</main>
<zd-dock [items]="destinations" label="App destinations" />`,
  },
];

export const activeIdCode = `<!-- Pick the current item yourself instead of Router matching -->
<zd-dock [items]="sections" [activeId]="section()" position="static" label="Report sections" />`;
