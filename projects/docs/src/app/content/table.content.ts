import type { DocsCodeFile } from '../ui/code/code-tabs.component';
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
    'Style native tables, add Angular Aria keyboard navigation, or combine the styling with CDK Table column templates and data-driven rows.',
  facts: controlFacts('table[zdTable]', 'table', 'table'),
  notice: plannedNotice,
  install: {
    description:
      'Import ZdTable for styling and the interactive directives when building a keyboard grid. Import CdkTableModule from @angular/cdk/table for the data table example. Register the emitted classes with Tailwind.',
    importCode: `import { ZdTable, ZdTableGrid, ZdTableRow, ZdTableCell, ZdTableCellWidget } from '@pranxy/zordon-ui/table';`,
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
    description:
      'ZdTable owns styling. ZdTableGrid, ZdTableRow, ZdTableCell and ZdTableCellWidget compose Angular Aria interaction. CDK Table retains its own column, row and data-source API.',
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
      {
        id: 'grid-inputs',
        heading: 'Interactive grid inputs',
        caption: 'Angular Aria composition',
        columns: apiColumns,
        rows: [
          {
            name: 'zdTableGrid',
            type: 'directive',
            default: '—',
            description:
              'Adds a grid role and Angular Aria cell navigation to the table. Provide a caption or accessible name.',
          },
          {
            name: 'gridRowWrap / gridColWrap',
            type: "'loop' | 'continuous' | 'nowrap'",
            default: "'loop'",
            description: 'Controls row and column edge navigation. The example uses nowrap.',
          },
          {
            name: 'gridDisabled / gridSoftDisabled',
            type: 'boolean',
            default: 'false / true',
            description: 'Disables grid interaction; soft-disabled cells remain focusable.',
          },
          {
            name: 'gridFocusMode',
            type: "'roving' | 'activedescendant'",
            default: "'roving'",
            description: 'Selects the Angular Aria focus strategy.',
          },
          {
            name: 'gridEnableSelection / gridMulti / gridEnableRangeSelection',
            type: 'boolean',
            default: 'false',
            description:
              'Opt into cell selection, multiple selection or range selection. Application checkbox state is separate.',
          },
          {
            name: 'gridSelectionMode',
            type: "'follow' | 'explicit'",
            default: "'follow'",
            description:
              'Controls whether enabled cell selection follows focus or requires activation.',
          },
          {
            name: 'zdTableRow',
            type: 'directive',
            default: '—',
            description: 'Marks each header, body or footer row in a manually authored grid.',
          },
          {
            name: 'tableRowIndex',
            type: 'number | undefined',
            default: 'undefined',
            description: 'Optional row index on zdTableRow.',
          },
          {
            name: 'cellRole',
            type: "'gridcell' | 'columnheader' | 'rowheader'",
            default: "'gridcell'",
            description:
              'On zdTableCell. Use columnheader or rowheader for header cells and retain native scope.',
          },
          {
            name: 'cellId',
            type: 'string',
            default: 'required',
            description:
              'A document-unique ID, identical on the server and client, used for accessible focus references.',
          },
          {
            name: 'cellDisabled / cellSelected / cellSelectable',
            type: 'boolean',
            default: 'false / false / true',
            description:
              'Controls cell interaction and selection eligibility. cellSelected supports two-way binding through cellSelectedChange.',
          },
          {
            name: 'cellRowSpan / cellColSpan',
            type: 'number',
            default: '1',
            description: 'Sets the logical cell span and corresponding native/ARIA attributes.',
          },
          {
            name: 'cellRowIndex / cellColIndex',
            type: 'number | undefined',
            default: 'undefined',
            description: 'Optional explicit cell position.',
          },
          {
            name: 'cellOrientation / cellWrap',
            type: "'horizontal' | 'vertical' / boolean",
            default: "'horizontal' / true",
            description: 'Controls navigation among multiple widgets in the same cell.',
          },
          {
            name: 'zdTableCellWidget',
            type: 'directive',
            default: '—',
            description:
              'Registers a control within a grid cell for Angular Aria focus and activation.',
          },
          {
            name: 'widgetId',
            type: 'string',
            default: 'required',
            description: 'A document-unique ID, identical on the server and client.',
          },
          {
            name: 'widgetType',
            type: "'simple' | 'complex' | 'editable'",
            default: "'simple'",
            description: 'Identifies the control interaction. Buttons and checkboxes use simple.',
          },
          {
            name: 'widgetDisabled',
            type: 'boolean',
            default: 'false',
            description:
              'Marks a widget disabled for grid navigation. Also bind disabled on native controls.',
          },
          {
            name: 'widgetFocusTarget',
            type: 'HTMLElement | ElementRef | undefined',
            default: 'undefined',
            description:
              'Optional focus target for a widget with a separately rendered focusable element.',
          },
          {
            name: 'widgetActivated / widgetDeactivated',
            type: 'FocusEvent | KeyboardEvent | undefined',
            default: 'output',
            description: 'Emits when the widget enters or leaves control interaction.',
          },
          {
            name: 'active / isActivated',
            type: 'Signal<boolean>',
            default: 'read-only',
            description: 'State on the exported zdTableCellWidget directive instance.',
          },
          {
            name: 'activate() / deactivate()',
            type: 'void',
            default: 'method',
            description:
              'Enters or leaves widget interaction through its exported directive instance.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/table',
    typesCode: `export type ZdTableSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';`,
  },
  accessibility: {
    description:
      'Native and CDK tables retain table semantics and normal Tab navigation. Adding zdTableGrid explicitly enables the interactive grid pattern.',
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
        title: 'Choose the interaction',
        body: 'Use the keyboard grid for cell navigation, and the CDK data table for column templates. Keep each mode complete; the examples do not combine their row renderers.',
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
  ssr: 'Native table markup and data rows render on the server. Angular Aria enhances the interactive example with managed focus after rendering. Keep initial rows and columns deterministic for hydration.',
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

export const interactiveTableFiles: readonly DocsCodeFile[] = [
  {
    label: 'keyboard-grid.html',
    language: 'html',
    code: '<div class="docs-stack table-demo">\n  <label class="docs-choice">\n    <input\n      type="checkbox"\n      [checked]="showGridStatus()"\n      (change)="showGridStatus.set(!showGridStatus())"\n    />\n    Show status column\n  </label>\n  <p id="grid-help">\n    Tab into the grid, then use arrow keys to move between cells. For complex controls, press Enter to use\n    a cell\'s controls; Escape returns to cell navigation. Space toggles a focused\n    checkbox.\n  </p>\n  <div class="scroller">\n    <table\n      zdTable\n      zdTableGrid\n      gridRowWrap="nowrap"\n      gridColWrap="nowrap"\n      aria-describedby="grid-help"\n    >\n      <caption>\n        Service controls\n      </caption>\n      <thead>\n        <tr zdTableRow>\n          <th\n            zdTableCell\n            cellId="service-controls-header-service"\n            cellRole="columnheader"\n            scope="col"\n          >\n            Service\n          </th>\n          @if (showGridStatus()) {\n            <th\n              zdTableCell\n              cellId="service-controls-header-status"\n              cellRole="columnheader"\n              scope="col"\n            >\n              Status\n            </th>\n          }\n          <th\n            zdTableCell\n            cellId="service-controls-header-alerts"\n            cellRole="columnheader"\n            scope="col"\n          >\n            Alerts\n          </th>\n          <th\n            zdTableCell\n            cellId="service-controls-header-action"\n            cellRole="columnheader"\n            scope="col"\n          >\n            Action\n          </th>\n        </tr>\n      </thead>\n      <tbody>\n        @for (service of services(); track service.id) {\n          <tr zdTableRow>\n            <th\n              zdTableCell\n              [cellId]="\'service-controls-name-\' + service.id"\n              cellRole="rowheader"\n              scope="row"\n            >\n              {{ service.name }}\n            </th>\n            @if (showGridStatus()) {\n              <td zdTableCell [cellId]="\'service-controls-status-\' + service.id">\n                {{ service.status }}\n              </td>\n            }\n            <td zdTableCell [cellId]="\'service-controls-alerts-\' + service.id">\n              <input\n                zdTableCellWidget\n                [widgetId]="\'service-alerts-\' + service.id"\n                type="checkbox"\n                [checked]="service.alerts"\n                [attr.aria-label]="\'Alerts for \' + service.name"\n                (change)="toggleAlerts(service.id)"\n              />\n            </td>\n            <td zdTableCell [cellId]="\'service-controls-action-\' + service.id">\n              <button\n                zdTableCellWidget\n                [widgetId]="\'service-restart-\' + service.id"\n                type="button"\n                class="table-action"\n                (click)="restart(service.name)"\n              >\n                <span>Restart {{ service.name }}</span>\n              </button>\n            </td>\n          </tr>\n        }\n      </tbody>\n    </table>\n  </div>\n  <p class="docs-status" role="status">{{ gridMessage() }}</p>\n</div>',
  },
  {
    label: 'keyboard-grid.ts',
    language: 'ts',
    code: "import { ChangeDetectionStrategy, Component, signal } from '@angular/core';\nimport { ZdTable, ZdTableGrid, ZdTableRow, ZdTableCell, ZdTableCellWidget } from '@pranxy/zordon-ui/table';\n\n@Component({\n  selector: 'example-keyboard-grid',\n  imports: [ZdTable, ZdTableGrid, ZdTableRow, ZdTableCell, ZdTableCellWidget],\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  templateUrl: './keyboard-grid.html',\n  styleUrl: './table-example.css',\n})\nexport class KeyboardGridExample {\n  readonly showGridStatus = signal(true);\n  readonly gridMessage = signal('No restart requested.');\n  readonly services = signal([\n    { id: 'api', name: 'API', status: 'Healthy', alerts: true },\n    { id: 'web', name: 'Web', status: 'Healthy', alerts: false },\n  ]);\n\n  toggleAlerts(id: string): void {\n    this.services.update(rows => rows.map(row => row.id === id ? { ...row, alerts: !row.alerts } : row));\n  }\n\n  restart(name: string): void {\n    this.gridMessage.set('Restart requested for ' + name + '.');\n  }\n}",
  },
  {
    label: 'table-example.css',
    language: 'css',
    code: '.table-demo { inline-size: 100%; }\n.scroller { max-inline-size: 100%; overflow: auto; }\n[zdTableCell]:focus-visible, [zdTableCellWidget]:focus-visible,\n.table-action:focus-visible, input:focus-visible, .scroller:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n.table-action { font: inherit; cursor: pointer; }\n@media (forced-colors: active) {\n  [zdTableCell]:focus-visible, [zdTableCellWidget]:focus-visible { outline-color: Highlight; }\n}',
  },
];

export const dataTableFiles: readonly DocsCodeFile[] = [
  {
    label: 'data-table.html',
    language: 'html',
    code: '<div class="docs-stack table-demo">\n  <div class="docs-cluster">\n    <label class="docs-choice">\n      <input\n        type="checkbox"\n        [checked]="dataColumns().includes(\'owner\')"\n        (change)="toggleOwner()"\n      />\n      Show owner column\n    </label>\n    <button type="button" class="table-action" (click)="reverseColumns()">\n      Reverse columns\n    </button>\n  </div>\n  <div\n    class="scroller"\n    tabindex="0"\n    role="region"\n    aria-label="Release ownership, scrollable"\n  >\n    <table zdTable cdk-table [dataSource]="releases" [trackBy]="trackRelease" zebra>\n      <caption>\n        Release ownership\n      </caption>\n      <ng-container cdkColumnDef="service">\n        <th cdk-header-cell *cdkHeaderCellDef scope="col">Service</th>\n        <th cdk-cell *cdkCellDef="let release" scope="row">\n          {{ release.name }}\n        </th>\n        <td cdk-footer-cell *cdkFooterCellDef>{{ releases.length }} services</td>\n      </ng-container>\n      <ng-container cdkColumnDef="owner">\n        <th cdk-header-cell *cdkHeaderCellDef scope="col">Owner</th>\n        <td cdk-cell *cdkCellDef="let release">\n          {{ release.owner }}\n        </td>\n        <td cdk-footer-cell *cdkFooterCellDef>Platform team</td>\n      </ng-container>\n      <ng-container cdkColumnDef="action">\n        <th cdk-header-cell *cdkHeaderCellDef scope="col">Action</th>\n        <td cdk-cell *cdkCellDef="let release">\n          <button type="button" class="table-action" (click)="inspect(release.name)">\n            Inspect {{ release.name }}\n          </button>\n        </td>\n        <td cdk-footer-cell *cdkFooterCellDef>Review releases</td>\n      </ng-container>\n      <tr cdk-header-row *cdkHeaderRowDef="dataColumns()"></tr>\n      <tr cdk-row *cdkRowDef="let release; columns: dataColumns()"></tr>\n      <tr cdk-footer-row *cdkFooterRowDef="dataColumns()"></tr>\n    </table>\n  </div>\n  <p class="docs-status" role="status">{{ dataMessage() }}</p>\n</div>',
  },
  {
    label: 'data-table.ts',
    language: 'ts',
    code: "import { ChangeDetectionStrategy, Component, signal } from '@angular/core';\nimport { CdkTableModule } from '@angular/cdk/table';\nimport { ZdTable } from '@pranxy/zordon-ui/table';\n\n@Component({\n  selector: 'example-data-table',\n  imports: [CdkTableModule, ZdTable],\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  templateUrl: './data-table.html',\n  styleUrl: './table-example.css',\n})\nexport class DataTableExample {\n  readonly releases = [\n    { id: 'api', name: 'API', owner: 'Alex' },\n    { id: 'web', name: 'Web', owner: 'Sam' },\n  ];\n  readonly dataColumns = signal<string[]>(['service', 'owner', 'action']);\n  readonly dataMessage = signal('Choose a release to inspect.');\n  readonly trackRelease = (_index: number, release: { id: string }): string => release.id;\n\n  toggleOwner(): void {\n    this.dataColumns.update(columns => columns.includes('owner')\n      ? columns.filter(column => column !== 'owner')\n      : [...columns, 'owner']);\n  }\n\n  reverseColumns(): void {\n    this.dataColumns.update(columns => [...columns].reverse());\n  }\n\n  inspect(name: string): void {\n    this.dataMessage.set('Inspecting ' + name + '.');\n  }\n}",
  },
  {
    label: 'table-example.css',
    language: 'css',
    code: '.table-demo { inline-size: 100%; }\n.scroller { max-inline-size: 100%; overflow: auto; }\n[zdTableCell]:focus-visible, [zdTableCellWidget]:focus-visible,\n.table-action:focus-visible, input:focus-visible, .scroller:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n.table-action { font: inherit; cursor: pointer; }\n@media (forced-colors: active) {\n  [zdTableCell]:focus-visible, [zdTableCellWidget]:focus-visible { outline-color: Highlight; }\n}',
  },
];
