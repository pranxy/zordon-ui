import type { ZdMenuItem, ZdMenuNode } from '@pranxy/zordon-ui/menu';

import type { DocsFeature } from '../ui/page/feature-grid.component';
import type { DocsMetaItem } from '../ui/page/meta-grid.component';
import type { DocsTableColumn, DocsTableRow } from '../ui/reference/api-table.component';
import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';

/**
 * Menu reference content. Mirrors projects/components/menu/src/menu.ts and
 * docs/components/menu.md — update them together.
 */

export const menuFacts: readonly DocsMetaItem[] = [
  { label: 'Navigation', value: 'zd-menu', mono: true },
  { label: 'Selectable tree', value: 'zd-menu-tree', mono: true },
  { label: 'Entry point', value: '@pranxy/zordon-ui/menu', mono: true },
  {
    label: 'Source',
    value: 'menu.ts',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/projects/components/menu/src/menu.ts',
    mono: true,
  },
];

export const menuImportCode = `import { ZdMenu, ZdMenuTree, type ZdMenuItem, type ZdMenuNode } from '@pranxy/zordon-ui/menu';`;

export const menuSourceCode = `/* daisyUI's menu spacing and the size, title and active modifiers */
@source inline("menu menu-xs menu-sm menu-md menu-lg menu-xl menu-title menu-active");`;

/** Real destinations on this site, so every link in the examples works. */
export const siteDestinations: readonly ZdMenuItem[] = [
  { id: 'docs-title', kind: 'title', label: 'Documentation' },
  { id: 'get-started', label: 'Get started', routerLink: '/docs/getting-started' },
  {
    id: 'components',
    label: 'Components',
    children: [
      { id: 'button', label: 'Button', routerLink: '/components/button' },
      { id: 'dropdown', label: 'Dropdown', routerLink: '/components/dropdown' },
      { id: 'kbd', label: 'Kbd', routerLink: '/components/kbd' },
    ],
  },
  { id: 'separator', kind: 'separator', label: 'Project boundary' },
  { id: 'resources', label: 'Resources', routerLink: '/resources' },
  { id: 'changelog', label: 'Changelog (coming soon)', disabled: true },
];

export const topLevelDestinations: readonly ZdMenuItem[] = [
  { id: 'top-start', label: 'Get started', routerLink: '/docs/getting-started' },
  { id: 'top-components', label: 'Components', routerLink: '/components' },
  { id: 'top-foundations', label: 'Foundations', routerLink: '/foundations/typed-vocabularies' },
  { id: 'top-guides', label: 'Guides', routerLink: '/guides/styling-and-theming' },
];

export const projectFiles: readonly ZdMenuNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'app', label: 'app.ts' },
      { id: 'config', label: 'app.config.ts' },
      { id: 'styles', label: 'styles.css' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [{ id: 'favicon', label: 'favicon.ico' }],
  },
  { id: 'readme', label: 'README.md' },
  { id: 'lock', label: 'package-lock.json', disabled: true },
];

export const decoratedItems: readonly ZdMenuItem[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    routerLink: '/components/menu',
    fragment: 'decorations',
    badge: 3,
    badgeLabel: '3 unread messages',
  },
  {
    id: 'search',
    label: 'Search',
    routerLink: '/components/menu',
    fragment: 'decorations',
    shortcut: '/',
  },
  {
    id: 'drafts',
    label: 'Drafts',
    routerLink: '/components/menu',
    fragment: 'decorations',
    badge: 0,
    badgeLabel: 'no drafts',
  },
];

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const menuPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'size',
    options: choices(['xs', 'sm', 'md', 'lg', 'xl']),
    defaultValue: 'md',
    omit: ['md'],
  },
  {
    kind: 'choice',
    key: 'orientation',
    options: choices(['vertical', 'horizontal']),
    defaultValue: 'vertical',
    omit: ['vertical'],
  },
];

export const menuPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes =>
    `<zd-menu [items]="destinations" label="Documentation"${attributes} [(expandedIds)]="expanded" />`,
};

export const navigationFiles = [
  {
    label: 'nav.html',
    language: 'html' as const,
    code: `<zd-menu [items]="destinations" label="Documentation" [(expandedIds)]="expanded" />`,
  },
  {
    label: 'nav.ts',
    language: 'ts' as const,
    code: `readonly destinations: readonly ZdMenuItem[] = [
  { id: 'docs-title', kind: 'title', label: 'Documentation' },
  { id: 'get-started', label: 'Get started', routerLink: '/docs/getting-started' },
  {
    id: 'components', label: 'Components', children: [
      { id: 'button', label: 'Button', routerLink: '/components/button' },
      { id: 'dropdown', label: 'Dropdown', routerLink: '/components/dropdown' },
    ],
  },
  { id: 'separator', kind: 'separator', label: 'Project boundary' },
  { id: 'resources', label: 'Resources', routerLink: '/resources' },
  { id: 'changelog', label: 'Changelog (coming soon)', disabled: true },
];
readonly expanded = signal<readonly string[]>(['components']);`,
  },
];

export const horizontalCode = `<zd-menu [items]="topLevel" label="Sections" orientation="horizontal" size="sm" />`;

export const treeFiles = [
  {
    label: 'files.html',
    language: 'html' as const,
    code: `<zd-menu-tree
  [items]="files"
  label="Project files"
  [(selectedIds)]="selected"
  [(expandedIds)]="expanded"
/>`,
  },
  {
    label: 'files.ts',
    language: 'ts' as const,
    code: `readonly files: readonly ZdMenuNode[] = [
  { id: 'src', label: 'src', children: [
    { id: 'app', label: 'app.ts' },
    { id: 'config', label: 'app.config.ts' },
  ] },
  { id: 'readme', label: 'README.md' },
  { id: 'lock', label: 'package-lock.json', disabled: true },
];
readonly selected = signal<string[]>([]);
readonly expanded = signal<readonly string[]>(['src']);`,
  },
];

export const decorationsCode = `readonly items: readonly ZdMenuItem[] = [
  { id: 'inbox', label: 'Inbox', routerLink: '/inbox', badge: 3, badgeLabel: '3 unread messages' },
  { id: 'search', label: 'Search', routerLink: '/search', shortcut: '/' },
];`;

const apiColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Input / model', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'default', label: 'Default', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export const menuInputs = {
  columns: apiColumns,
  rows: [
    {
      name: 'items',
      type: 'readonly ZdMenuItem[]',
      default: '[]',
      description: 'Recursive destinations, titles and separators.',
    },
    {
      name: 'label',
      type: 'string',
      default: "'Navigation'",
      description: 'Name of the navigation landmark.',
    },
    { name: 'size', type: 'ZdMenuSize', default: "'md'", description: '`xs` to `xl`.' },
    {
      name: 'orientation',
      type: 'ZdMenuOrientation',
      default: "'vertical'",
      description: '`vertical` or wrapping `horizontal`; groups stay inline.',
    },
    {
      name: 'expandedIds',
      type: 'readonly string[]',
      default: '[]',
      description: 'Two-way model of open group IDs.',
    },
    {
      name: 'activeId',
      type: 'string | null',
      default: 'undefined',
      description: 'Omit to follow the Router; `null` clears markers; a string marks that ID.',
    },
    {
      name: 'routeExact',
      type: 'boolean',
      default: 'true',
      description: 'Exact Router matching for the current-page marker.',
    },
  ] satisfies readonly DocsTableRow[],
};

export const treeInputs = {
  columns: apiColumns,
  rows: [
    {
      name: 'items',
      type: 'readonly ZdMenuNode[]',
      default: '[]',
      description: 'Recursive nodes: IDs, labels, children, decorations; no links.',
    },
    {
      name: 'label',
      type: 'string',
      default: "'Items'",
      description: 'Accessible name of the tree.',
    },
    {
      name: 'size / orientation',
      type: 'ZdMenuSize / …',
      default: "'md' / 'vertical'",
      description: 'As for `zd-menu`; orientation also changes the arrow-key axes.',
    },
    {
      name: 'selectedIds',
      type: 'string[]',
      default: '[]',
      description: 'Two-way selection model.',
    },
    {
      name: 'expandedIds',
      type: 'readonly string[]',
      default: '[]',
      description: 'Two-way expansion model.',
    },
    {
      name: 'multi',
      type: 'boolean',
      default: 'false',
      description: 'Allow several selected nodes.',
    },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the whole tree.' },
    {
      name: 'wrap',
      type: 'boolean',
      default: 'true',
      description: 'Arrow navigation wraps at the ends.',
    },
    {
      name: 'typeaheadDelay',
      type: 'number',
      default: '500',
      description: 'Typeahead buffer timeout in milliseconds.',
    },
  ] satisfies readonly DocsTableRow[],
};

export const menuTypesCode = `export interface ZdMenuNode {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly icon?: TemplateRef<ZdMenuIconContext>;
  readonly badge?: string | number;
  readonly badgeLabel?: string;
  readonly shortcut?: string; // display only; registers nothing
  readonly children?: readonly ZdMenuNode[];
}

export interface ZdMenuItem extends ZdMenuNode {
  readonly kind?: 'item' | 'title' | 'separator';
  readonly href?: string;
  readonly routerLink?: string | unknown[] | UrlTree;
  readonly queryParams?: Params;
  readonly fragment?: string;
  readonly children?: readonly ZdMenuItem[];
}

export type ZdMenuSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdMenuOrientation = 'vertical' | 'horizontal';`;

export const menuAccessibilityNotes: readonly DocsFeature[] = [
  {
    title: 'Navigation stays links',
    body: 'zd-menu renders native links and group buttons inside a nav landmark. Tab moves through them; there is no roving focus.',
  },
  {
    title: 'Trees select, not navigate',
    body: 'zd-menu-tree is an Angular Aria tree: arrows move, Right and Left expand and collapse, Enter and Space select.',
  },
  {
    title: 'Badges need words',
    body: 'Badges and shortcuts are decorative. Put their meaning in badgeLabel so it joins the accessible name.',
  },
  {
    title: 'Commands use Dropdown',
    body: 'For actions rather than destinations, use Dropdown’s menu mode or the Megamenu command bar.',
  },
];

const keyboardColumns: readonly DocsTableColumn[] = [
  { key: 'key', label: 'Key', kind: 'kbd' },
  { key: 'action', label: 'Tree action' },
];

export const treeKeyboard = {
  columns: keyboardColumns,
  rows: [
    { key: '↓ ↑', action: 'Move between visible nodes' },
    { key: '→', action: 'Expand a branch, or move to its first child (mirrored in RTL)' },
    { key: '←', action: 'Collapse a branch, or move to its parent' },
    { key: 'Home', action: 'First node (End: last node)' },
    { key: 'Enter', action: 'Select the focused node (Space too)' },
    { key: 'A–Z', action: 'Typeahead to a matching node' },
  ] satisfies readonly DocsTableRow[],
};
