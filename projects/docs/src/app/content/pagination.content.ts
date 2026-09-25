import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, controlSizes, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Pagination reference content. Mirrors projects/components/pagination/src/pagination.ts and
 * docs/components/pagination.md — update them together.
 */

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const paginationReference: DocsReference = {
  eyebrow: 'Navigation',
  heading: 'Pagination',
  maturity: 'planned',
  description:
    'Page controls in a named navigation landmark: controlled buttons, or real links that keep the page in the URL. It handles ranges, unknown totals and page sizes.',
  facts: controlFacts('zd-pagination', 'join btn', 'pagination'),
  notice: plannedNotice,
  install: {
    description:
      'Import the component. It composes Button and Join, so register their classes. Query mode needs the Router.',
    importCode: `import { ZdPagination, type ZdPaginationChange } from '@pranxy/zordon-ui/pagination';`,
    stylesCode: tailwindSource('btn btn-xs btn-sm btn-lg btn-xl join join-item'),
  },
  playgroundDescription:
    'Controlled mode: the buttons ask, and this page accepts by updating page. The status line announces accepted changes.',
  api: {
    description:
      'A standalone component. Without query it only requests changes; with query the URL is the state.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Pagination inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          { name: 'page', type: 'number', default: '1', description: 'One-based page.' },
          { name: 'pageSize', type: 'number', default: '10', description: 'Items per page.' },
          {
            name: 'total',
            type: 'number | null',
            default: 'null',
            description: 'Item count (not page count); `null` when unknown.',
          },
          {
            name: 'hasNext',
            type: 'boolean',
            default: 'false',
            description: 'With an unknown total, whether Next is available.',
          },
          {
            name: 'siblings',
            type: 'number',
            default: '1',
            description: 'Pages shown on each side of the current one (0–5).',
          },
          {
            name: 'pageSizeOptions',
            type: 'readonly number[]',
            default: '[]',
            description: 'Adds a page-size select; empty hides it.',
          },
          {
            name: 'size',
            type: 'ZdSize',
            default: "'md'",
            description: 'Button size, `xs` to `xl`.',
          },
          {
            name: 'label / labels',
            type: 'string / ZdPaginationLabels',
            default: "'Pagination'",
            description: 'Landmark name, and every control name and status message.',
          },
          {
            name: 'disabled / loading',
            type: 'boolean',
            default: 'false',
            description: 'Disable every control; loading also sets aria-busy and announces it.',
          },
          {
            name: 'query',
            type: 'ZdPaginationQuery | null',
            default: 'null',
            description: 'Query parameter names; page controls become Router links.',
          },
        ],
      },
      {
        id: 'outputs',
        heading: 'Outputs and state',
        caption: 'Pagination outputs and signals',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'stateChange',
            description: '`{ page, pageSize }` for one request. Prefer it: one fetch per change.',
          },
          { name: 'pageChange / pageSizeChange', description: 'The separate requests.' },
          {
            name: 'currentPage() / currentPageSize()',
            description: 'The accepted values, including URL state in query mode.',
          },
          { name: 'pageCount()', description: 'Pages for a known total; `null` when unknown.' },
          {
            name: 'zdPaginationRange()',
            description: 'The exported range function: pages and ellipsis tokens.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/pagination',
    typesCode: `export type ZdPaginationToken = number | 'ellipsis-start' | 'ellipsis-end';
export interface ZdPaginationChange {
  readonly page: number;
  readonly pageSize: number;
}
export interface ZdPaginationQuery {
  readonly page: string;     // query parameter name
  readonly pageSize: string;
}
export function zdPaginationRange(
  page: number, pageCount: number, siblings?: number,
): readonly ZdPaginationToken[];`,
  },
  accessibility: {
    description:
      'A named nav of native buttons or links. The current page has aria-current="page"; a polite status announces accepted changes.',
    features: [
      {
        title: 'Native keys',
        body: 'Tab moves between controls; there is no roving focus or arrow-key handling.',
      },
      {
        title: 'Ellipses are silent',
        body: 'Gaps are decorative and hidden; First, Previous, Next and Last have full names.',
      },
      {
        title: 'Localize everything',
        body: 'labels replaces every name and the status formatter, including for unknown totals.',
      },
      {
        title: 'Results are yours',
        body: 'Pagination doesn’t move focus or mark your results busy; you decide what follows.',
      },
    ],
  },
  customization: {
    description:
      'Sizes pass through to Button. The current page is marked with an underline and weight, with a forced-colors outline.',
    code: {
      label: 'labels.ts',
      language: 'ts',
      code: `protected readonly portuguese: ZdPaginationLabels = {
  first: 'Primeira página', previous: 'Anterior', next: 'Seguinte', last: 'Última página',
  pageSize: 'Itens por página', loading: 'A carregar',
  page: page => \`Página \${page}\`,
  status: (page, count) => (count === null ? \`Página \${page}\` : \`Página \${page} de \${count}\`),
};`,
    },
  },
  ssr: 'The server renders the controls, current-page marker and status. Query links navigate without JavaScript; buttons and the size select need hydration.',
};

export const paginationPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'size',
    options: choices(controlSizes),
    defaultValue: 'md',
    omit: ['md'],
  },
  {
    kind: 'choice',
    key: '[siblings]',
    options: choices(['0', '1', '2']),
    defaultValue: '1',
    omit: ['1'],
  },
  { kind: 'boolean', key: 'loading', defaultValue: false },
];

export const paginationPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-pagination
  label="Result pages"
  [page]="page()"
  [total]="420"${attributes.replace(/ (?=\S)/g, '\n  ')}
  (pageChange)="page.set($event)"
/>`,
};

export const pageSizeFiles = [
  {
    label: 'results.html',
    language: 'html' as const,
    code: `<zd-pagination
  label="Order pages"
  [page]="paging().page"
  [pageSize]="paging().pageSize"
  [total]="1284"
  [pageSizeOptions]="[10, 25, 50]"
  (stateChange)="paging.set($event)"
/>`,
  },
  {
    label: 'results.ts',
    language: 'ts' as const,
    code: `protected readonly paging = signal<ZdPaginationChange>({ page: 1, pageSize: 25 });`,
  },
];

export const unknownFiles = [
  {
    label: 'feed.html',
    language: 'html' as const,
    code: `<!-- No total: First, Previous, the current page and Next -->
<zd-pagination label="Feed pages" [page]="page()" [hasNext]="page() < 4"
               (pageChange)="page.set($event)" />`,
  },
];

export const queryCode = `<!-- Links that write ?page=&limit= and keep other query parameters -->
<zd-pagination
  label="Catalog pages"
  [total]="420"
  [query]="{ page: 'page', pageSize: 'limit' }"
  [pageSizeOptions]="[10, 25, 50]"
/>`;
