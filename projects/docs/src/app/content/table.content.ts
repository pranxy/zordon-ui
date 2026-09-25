import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  apiColumns,
  controlFacts,
  modifierClasses,
  plannedNotice,
  sizeControl,
  sizeRow,
  tailwindSource,
} from './form-controls.content';

/**
 * Table reference content. Mirrors projects/components/table/src/table.ts and
 * docs/components/table.md — update them together.
 */

export const tableReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Table',
  maturity: 'planned',
  description:
    'daisyUI’s table styling on a native table: sizes, zebra rows and pinned headers or columns. Captions, headers and scope stay native.',
  facts: controlFacts('table[zdTable]', 'table', 'table'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdTable } from '@pranxy/zordon-ui/table';`,
    stylesCode: tailwindSource(
      modifierClasses('table', {
        colors: false,
        extra: ['table-zebra', 'table-pin-rows', 'table-pin-cols'],
      }),
    ),
  },
  playgroundDescription:
    'Pinned rows and columns stick while the table scrolls inside its wrapper; scroll the preview to see them.',
  api: {
    description: 'A standalone directive on `<table>` that adds classes only.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Table inputs',
        columns: apiColumns,
        rows: [
          sizeRow('ZdTableSize', 'table'),
          {
            name: 'zebra',
            type: 'boolean',
            default: 'false',
            description: 'Adds `table-zebra`: alternate row backgrounds.',
          },
          {
            name: 'pinRows',
            type: 'boolean',
            default: 'false',
            description: 'Adds `table-pin-rows`: `thead` and `tfoot` rows stick while scrolling.',
          },
          {
            name: 'pinCols',
            type: 'boolean',
            default: 'false',
            description: 'Adds `table-pin-cols`: `th` cells in body rows stick horizontally.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/table',
    typesCode: `export type ZdTableSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';`,
  },
  accessibility: {
    description:
      'It stays a native data table, so screen readers announce headers as people move between cells.',
    features: [
      {
        title: 'Caption it',
        body: 'A caption names the table; you can hide it visually and keep it for assistive technology.',
      },
      {
        title: 'Scope your headers',
        body: 'Use th with scope="col" for columns and scope="row" for each row’s key cell.',
      },
      {
        title: 'Scrollable wrapper',
        body: 'A scroll container needs tabindex="0", a role and a name so keyboard users can scroll it.',
      },
      {
        title: 'Not a grid',
        body: 'There is no cell focus, sorting or selection. An interactive grid needs a different contract.',
      },
    ],
  },
  customization: {
    description:
      'Overflow, column widths and alignment are yours; wrap the table to let it scroll on small screens.',
    code: {
      label: 'deployments.html',
      language: 'html',
      code: `<div class="scroller" tabindex="0" role="region" aria-label="Deployments, scrollable">
  <table zdTable pinRows pinCols>…</table>
</div>`,
    },
  },
  ssr: 'The directive only adds classes, so the server renders the finished table.',
};

export const tablePlaygroundControls: readonly PlaygroundControl[] = [
  sizeControl,
  { kind: 'boolean', key: 'zebra', defaultValue: true },
  { kind: 'boolean', key: 'pinRows', defaultValue: false },
  { kind: 'boolean', key: 'pinCols', defaultValue: false },
];

export const tablePlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<div class="scroller" tabindex="0" role="region" aria-label="Deployments">
  <table zdTable${attributes}>
    <caption>Monthly deployments</caption>
    <thead>
      <tr><th scope="col">Service</th><th scope="col">Jan</th><th scope="col">Feb</th>…</tr>
    </thead>
    <tbody>
      <tr><th scope="row">API</th><td>12</td><td>9</td>…</tr>
    </tbody>
  </table>
</div>`,
};

export const rowHeadersCode = `<table zdTable>
  <caption>Plan limits</caption>
  <thead>
    <tr>
      <td></td>
      <th scope="col">Free</th>
      <th scope="col">Team</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Projects</th>
      <td>3</td>
      <td>Unlimited</td>
    </tr>
  </tbody>
</table>`;
