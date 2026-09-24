import type { DocsFeature } from '../ui/page/feature-grid.component';
import type { DocsMetaItem } from '../ui/page/meta-grid.component';
import type { DocsTableColumn, DocsTableRow } from '../ui/reference/api-table.component';
import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';

/**
 * Megamenu reference content. Mirrors projects/components/megamenu/src/megamenu.ts and
 * docs/components/megamenu.md — update them together.
 */

export const megamenuFacts: readonly DocsMetaItem[] = [
  { label: 'Root', value: '[zdMegamenu]', mono: true },
  { label: 'Panel', value: 'zd-megamenu-panel', mono: true },
  { label: 'Entry point', value: '@pranxy/zordon-ui/megamenu', mono: true },
  {
    label: 'Source',
    value: 'megamenu.ts',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/projects/components/megamenu/src/megamenu.ts',
    mono: true,
  },
];

export const megamenuImportCode = `import { ZdMegamenu, ZdMegamenuBar, ZdMegamenuPanel } from '@pranxy/zordon-ui/megamenu';
import { ZdDropdownPanel, ZdDropdownTrigger } from '@pranxy/zordon-ui/dropdown';`;

export const megamenuStylesCode = `/* Structural overlay styles from Angular CDK */
@import '@angular/cdk/overlay-prebuilt.css';

/* Only if you use the command bar with dropdown menus */
@source inline("megamenu menu");`;

export interface MegamenuLink {
  readonly label: string;
  readonly path: string;
}

export interface MegamenuGroup {
  readonly heading: string;
  readonly links: readonly MegamenuLink[];
}

/** Real destinations on this site, grouped the way the catalogue groups them. */
export const componentGroups: readonly MegamenuGroup[] = [
  {
    heading: 'Actions',
    links: [
      { label: 'Button', path: '/components/button' },
      { label: 'Dropdown', path: '/components/dropdown' },
      { label: 'Swap', path: '/components/swap' },
    ],
  },
  {
    heading: 'Data display',
    links: [
      { label: 'Carousel', path: '/components/carousel' },
      { label: 'Collapse', path: '/components/collapse' },
      { label: 'Kbd', path: '/components/kbd' },
    ],
  },
  {
    heading: 'Navigation',
    links: [
      { label: 'Megamenu', path: '/components/megamenu' },
      { label: 'Menu', path: '/components/menu' },
    ],
  },
  {
    heading: 'Data input',
    links: [{ label: 'Calendar', path: '/components/calendar' }],
  },
];

export const learnGroups: readonly MegamenuGroup[] = [
  {
    heading: 'Start',
    links: [
      { label: 'Get started', path: '/docs/getting-started' },
      { label: 'Component catalogue', path: '/components' },
    ],
  },
  {
    heading: 'Foundations',
    links: [{ label: 'Typed vocabularies', path: '/foundations/typed-vocabularies' }],
  },
  {
    heading: 'Guides',
    links: [{ label: 'Styling and theming', path: '/guides/styling-and-theming' }],
  },
  {
    heading: 'Project',
    links: [{ label: 'Resources', path: '/resources' }],
  },
];

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const megamenuPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'columns',
    options: choices(['1', '2', '3', '4']),
    defaultValue: '3',
    omit: ['3'],
  },
  {
    kind: 'choice',
    key: 'width',
    options: choices(['anchored', 'full']),
    defaultValue: 'anchored',
    omit: ['anchored'],
  },
  {
    kind: 'choice',
    key: 'trigger',
    options: choices(['click', 'hover']),
    defaultValue: 'click',
    omit: ['click'],
  },
];

/** Panel inputs go on zd-megamenu-panel, the trigger on the root. */
export const megamenuPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => {
    const trigger = attributes.match(/ trigger="[^"]*"/)?.[0] ?? '';
    const panel = attributes.replace(trigger, '').replace(/ columns="(\d)"/, ' [columns]="$1"');
    return `<div zdMegamenu${trigger}>
  <button zdButton zdDropdownTrigger>Components ▾</button>
  <ng-template zdDropdownPanel>
    <zd-megamenu-panel${panel} role="region" aria-label="Components">
      <section>
        <h2>Actions</h2>
        <a routerLink="/components/button">Button</a>
      </section>
      …
    </zd-megamenu-panel>
  </ng-template>
</div>`;
  },
};

export const siteNavigationCode = `<nav aria-label="Site">
  <a routerLink="/">Home</a>
  <div zdMegamenu>
    <button zdButton zdDropdownTrigger>Components ▾</button>
    <ng-template zdDropdownPanel>
      <zd-megamenu-panel [columns]="2" role="region" aria-label="Components">
        @for (group of groups; track group.heading) {
          <section>
            <h2>{{ group.heading }}</h2>
            @for (link of group.links; track link.path) {
              <a [routerLink]="link.path" routerLinkActive="current" ariaCurrentWhenActive="page">
                {{ link.label }}
              </a>
            }
          </section>
        }
      </zd-megamenu-panel>
    </ng-template>
  </div>
  <a routerLink="/resources">Resources</a>
</nav>`;

export const fullWidthCode = `<div zdMegamenu trigger="hover">
  <button zdButton zdDropdownTrigger>Learn ▾</button>
  <ng-template zdDropdownPanel>
    <zd-megamenu-panel width="full" [columns]="4" role="region" aria-label="Learn">
      …
    </zd-megamenu-panel>
  </ng-template>
</div>`;

export const commandBarCode = `<zd-megamenu-bar aria-label="Editor commands">
  <div zdMegamenu mode="menu" (selected)="run($event)">
    <button zdDropdownTrigger zdDropdownItem value="file">File</button>
    <ng-template zdDropdownPanel>
      <zd-dropdown-menu aria-label="File">
        <button zdDropdownItem value="new">New document</button>
        <button zdDropdownItem value="export">Export</button>
      </zd-dropdown-menu>
    </ng-template>
  </div>
  <div zdMegamenu mode="menu" (selected)="run($event)">
    <button zdDropdownTrigger zdDropdownItem value="edit">Edit</button>
    …
  </div>
</zd-megamenu-bar>`;

const declarationColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Declaration', kind: 'name' },
  { key: 'description', label: 'Role' },
];

export const megamenuDeclarations = {
  columns: declarationColumns,
  rows: [
    {
      name: '[zdMegamenu]',
      description:
        'Root. Composes Dropdown, so every Dropdown input and output applies. Exported as `zdMegamenu`.',
    },
    {
      name: 'zd-megamenu-panel',
      description: 'Responsive grid surface for links, headings and forms. One column below 48rem.',
    },
    {
      name: 'zd-megamenu-bar',
      description:
        'Opt-in Angular Aria menu bar for application commands. Emits the daisyUI `megamenu` class.',
    },
    {
      name: 'Trigger and panel',
      description:
        '`zdDropdownTrigger` and `ng-template[zdDropdownPanel]` from Dropdown, re-exported by this entry.',
    },
  ] satisfies readonly DocsTableRow[],
};

const apiColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Input', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'default', label: 'Default', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export const megamenuInputs = {
  columns: apiColumns,
  rows: [
    {
      name: 'closeOnNavigation',
      type: 'boolean',
      default: 'true',
      description: 'Close with reason `navigation` after a successful Router navigation.',
    },
    {
      name: 'trigger / mode / side / align …',
      type: 'Dropdown inputs',
      default: "'click' / 'content' / …",
      description: 'Inherited from Dropdown: placement, hover delay and close policies.',
    },
    {
      name: 'columns',
      type: '1 | 2 | 3 | 4',
      default: '3',
      description: 'Panel grid columns at 48rem and wider.',
    },
    {
      name: 'width',
      type: "'anchored' | 'full'",
      default: "'anchored'",
      description: 'Anchored is at most 48rem; full is the viewport minus 32px.',
    },
    {
      name: 'wrap / typeaheadDelay / disabled',
      type: 'boolean / number / boolean',
      default: 'true / 500 / false',
      description:
        'Command bar only: Angular Aria MenuBar inputs. `itemSelected` reports bar items.',
    },
  ] satisfies readonly DocsTableRow[],
};

export const megamenuTypesCode = `// Re-exported from @pranxy/zordon-ui/dropdown
export type ZdDropdownSide = 'top' | 'bottom' | 'start' | 'end';
export type ZdDropdownAlign = 'start' | 'center' | 'end';
export type ZdDropdownCloseReason =
  | 'trigger' | 'selection' | 'backdrop' | 'outside-pointer' | 'escape'
  | 'programmatic' | 'navigation' | 'destroy' | 'focus' | 'hover';`;

export const megamenuAccessibilityNotes: readonly DocsFeature[] = [
  {
    title: 'Navigation stays native',
    body: 'Panels hold ordinary links, headings and forms in normal tab order. No menu roles or focus trap are added.',
  },
  {
    title: 'Name the panel',
    body: 'Give each zd-megamenu-panel a role and label, such as role="region" with aria-label, so the region is announced.',
  },
  {
    title: 'Commands get a bar',
    body: 'zd-megamenu-bar is for application commands only. Aria owns roving focus, arrows and typeahead across the bar.',
  },
  {
    title: 'Critical links outside',
    body: 'Panels render after hydration. Keep essential destinations as ordinary links so they work without JavaScript.',
  },
];

const keyboardColumns: readonly DocsTableColumn[] = [
  { key: 'key', label: 'Key', kind: 'kbd' },
  { key: 'where', label: 'Where' },
  { key: 'action', label: 'Action' },
];

export const megamenuKeyboard = {
  columns: keyboardColumns,
  rows: [
    { key: 'Enter', where: 'Trigger', action: 'Opens or closes the panel (Space too)' },
    { key: 'Tab', where: 'Panel', action: 'Moves through links and fields in order' },
    { key: 'Esc', where: 'Panel', action: 'Closes and returns focus to the trigger' },
    {
      key: '← →',
      where: 'Command bar',
      action: 'Moves between top-level commands (mirrored in RTL)',
    },
    { key: '↓', where: 'Command bar', action: 'Opens the focused command’s menu' },
  ] satisfies readonly DocsTableRow[],
};

export const megamenuCustomizationCode = `/* The panel is in the CDK overlay container, so style its content globally */
.site-megamenu h2 {
  font-size: 0.75rem;
  text-transform: uppercase;
}

.site-megamenu a[aria-current='page'] {
  font-weight: 600;
}`;
