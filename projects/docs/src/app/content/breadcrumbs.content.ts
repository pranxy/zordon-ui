import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Breadcrumbs reference content. Mirrors projects/components/breadcrumbs/src/breadcrumbs.ts and
 * docs/components/breadcrumbs.md — update them together.
 */

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const breadcrumbsReference: DocsReference = {
  eyebrow: 'Navigation',
  heading: 'Breadcrumbs',
  maturity: 'planned',
  description:
    'A named navigation landmark with an ordered list of ordinary links, ending at the current page. Long trails collapse their middle into a native disclosure.',
  facts: controlFacts('zd-breadcrumbs', 'breadcrumbs', 'breadcrumbs'),
  notice: plannedNotice,
  install: {
    description:
      'Import the component and pass an items array. Router items need the Angular Router; href and plain-text trails don’t.',
    importCode: `import { ZdBreadcrumbs, type ZdBreadcrumbItem } from '@pranxy/zordon-ui/breadcrumbs';`,
    stylesCode: tailwindSource('breadcrumbs'),
  },
  playgroundDescription:
    'Five levels with maxItems 4: the middle collapses into a disclosure. Scroll mode keeps every item in one scrollable row.',
  api: {
    description:
      'A standalone component driven by an items array; the last item is the current page.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Breadcrumbs inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'items',
            type: 'readonly ZdBreadcrumbItem[]',
            default: '[]',
            description: 'Ancestors first, current page last.',
          },
          {
            name: 'label',
            type: 'string',
            default: "'Breadcrumb'",
            description: 'Name of the navigation landmark.',
          },
          {
            name: 'overflow',
            type: 'ZdBreadcrumbOverflow',
            default: "'collapse'",
            description: '`collapse` the middle, or `scroll` the whole trail.',
          },
          {
            name: 'maxItems',
            type: 'number',
            default: '4',
            description: 'Visible slots in collapse mode, including the disclosure (3 or more).',
          },
          {
            name: 'overflowLabel',
            type: 'string',
            default: "'Show hidden breadcrumbs'",
            description: 'Name of the disclosure summary.',
          },
          {
            name: 'separator',
            type: 'string',
            default: "'›'",
            description: 'Decorative text between items.',
          },
          {
            name: 'linkCurrent',
            type: 'boolean',
            default: 'false',
            description: 'Renders the current page as a link when it has a destination.',
          },
          {
            name: 'structuredData',
            type: 'boolean',
            default: 'false',
            description: 'Adds Schema.org BreadcrumbList microdata from each canonicalUrl.',
          },
        ],
      },
      {
        id: 'item',
        heading: 'Item fields',
        caption: 'Breadcrumb item fields',
        columns: [
          { key: 'name', label: 'Field', kind: 'name' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          { name: 'id / label', description: 'Required: a unique id and the full name.' },
          {
            name: 'shortLabel',
            description: 'Shown instead of label up to 40rem wide; the full label stays the name.',
          },
          {
            name: 'href / routerLink',
            description:
              'One destination, or neither for plain text. Router items take queryParams and fragment.',
          },
          { name: 'icon', description: 'Decorative TemplateRef; its context is the item.' },
          { name: 'canonicalUrl', description: 'Absolute URL for structured data.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/breadcrumbs',
    typesCode: `export type ZdBreadcrumbOverflow = 'collapse' | 'scroll';
export interface ZdBreadcrumbItem {
  readonly id: string;
  readonly label: string;
  readonly shortLabel?: string;
  readonly href?: string;
  readonly routerLink?: string | unknown[] | UrlTree;
  readonly queryParams?: Params;
  readonly fragment?: string;
  readonly icon?: TemplateRef<ZdBreadcrumbIconContext>;
  readonly canonicalUrl?: string;
}`,
  },
  accessibility: {
    description:
      'A labelled nav, an ordered list and native links: no menu roles or arrow-key handling.',
    features: [
      {
        title: 'Current page marked',
        body: 'The last item always has aria-current="page", as text or as a link.',
      },
      {
        title: 'Native disclosure',
        body: 'Hidden levels sit in details/summary, so they open without JavaScript; Escape closes it after hydration.',
      },
      {
        title: 'Full names kept',
        body: 'shortLabel only changes what is shown; the complete label is still what is read.',
      },
      {
        title: 'Name each trail',
        body: 'Give the landmark a label that differs from other navigation on the page.',
      },
    ],
  },
  customization: {
    description:
      'The separator is text you choose. Colors follow the surrounding theme; icons are your templates.',
    code: {
      label: 'trail.html',
      language: 'html',
      code: `<zd-breadcrumbs [items]="path" separator="/" overflow="scroll" label="Folder path" />`,
    },
  },
  ssr: 'The server renders every link, the current-page marker, the closed disclosure and any structured data. Links work before hydration.',
};

export const breadcrumbsPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'overflow',
    options: choices(['collapse', 'scroll']),
    defaultValue: 'collapse',
    omit: ['collapse'],
  },
  {
    kind: 'choice',
    key: 'separator',
    options: choices(['›', '/', '·']),
    defaultValue: '›',
    omit: ['›'],
  },
];

export const breadcrumbsPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-breadcrumbs [items]="path" label="Page path"${attributes} />`,
};

export const routerFiles = [
  {
    label: 'trail.ts',
    language: 'ts' as const,
    code: `protected readonly path: readonly ZdBreadcrumbItem[] = [
  { id: 'home', label: 'Home', routerLink: '/' },
  { id: 'components', label: 'Components', routerLink: '/components' },
  { id: 'breadcrumbs', label: 'Breadcrumbs' }, // current page: no destination
];`,
  },
  {
    label: 'trail.html',
    language: 'html' as const,
    code: `<zd-breadcrumbs [items]="path" label="Documentation path" />`,
  },
];

export const shortLabelsCode = `{
  id: 'report',
  label: 'Quarterly performance report, third quarter 2026',
  shortLabel: 'Q3 report', // shown up to 40rem wide
}`;

export const iconsFiles = [
  {
    label: 'icons.html',
    language: 'html' as const,
    code: `<ng-template #folder let-item><span aria-hidden="true">🗀</span></ng-template>
<zd-breadcrumbs [items]="folders(folder)" label="Folder path" />`,
  },
  {
    label: 'icons.ts',
    language: 'ts' as const,
    code: `protected folders(icon: TemplateRef<ZdBreadcrumbIconContext>): readonly ZdBreadcrumbItem[] {
  return [
    { id: 'drive', label: 'Drive', href: '#drive', icon },
    { id: 'design', label: 'Design', href: '#design', icon },
    { id: 'logos', label: 'Logos', icon },
  ];
}`,
  },
];
