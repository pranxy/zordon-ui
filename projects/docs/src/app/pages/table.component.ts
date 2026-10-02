import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import {
  ZdTable,
  ZdTableGrid,
  ZdTableRow,
  ZdTableCell,
  ZdTableCellWidget,
} from '@pranxy/zordon-ui/table';

import { flagOf, sizeOf } from '../content/form-controls.content';
import {
  rowHeadersCode,
  interactiveTableFiles,
  dataTableFiles,
  tablePlaygroundControls,
  tablePlaygroundSnippet,
  tableReference,
} from '../content/table.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Table emits, only while this page is in use. */
@Component({
  selector: 'docs-table-daisy-styles',
  template: '',
  styleUrl: './styles/table.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class TableDaisyStylesComponent {}

@Component({
  selector: 'docs-table-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    TableDaisyStylesComponent,
    ZdTable,
    ZdTableGrid,
    ZdTableRow,
    ZdTableCell,
    ZdTableCellWidget,
    CdkTableModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-table-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Table"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="scroller" tabindex="0" role="region" aria-label="Deployments, scrollable">
            <table
              zdTable
              [size]="sizeOf(values)"
              [zebra]="flagOf(values, 'zebra')"
              [pinRows]="flagOf(values, 'pinRows')"
              [pinCols]="flagOf(values, 'pinCols')"
            >
              <caption>
                Monthly deployments
              </caption>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  @for (month of months; track month) {
                    <th scope="col">{{ month }}</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of deployments; track row.service) {
                  <tr>
                    <th scope="row">{{ row.service }}</th>
                    @for (count of row.counts; track $index) {
                      <td>{{ count }}</td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="row-headers"
        level="3"
        heading="Row headers"
        description="Headers in both directions: each value is announced with its plan and its limit."
      >
        <docs-example label="plans.html" [code]="rowHeadersCode">
          <table zdTable class="plans">
            <caption>
              Plan limits
            </caption>
            <thead>
              <tr>
                <td></td>
                <th scope="col">Free</th>
                <th scope="col">Team</th>
              </tr>
            </thead>
            <tbody>
              @for (limit of limits; track limit.name) {
                <tr>
                  <th scope="row">{{ limit.name }}</th>
                  <td>{{ limit.free }}</td>
                  <td>{{ limit.team }}</td>
                </tr>
              }
            </tbody>
          </table>
        </docs-example>
      </docs-section>
      <docs-section
        id="interactive-grid"
        level="3"
        heading="Keyboard grid"
        description="Use Angular Aria cell navigation when people work across rows and controls. You own the rows and columns, so ordinary Angular control flow can change either."
      >
        <docs-example label="Keyboard grid" [files]="interactiveTableFiles">
          <div class="docs-stack table-demo">
            <label class="docs-choice">
              <input
                type="checkbox"
                [checked]="showGridStatus()"
                (change)="showGridStatus.set(!showGridStatus())"
              />
              Show status column
            </label>
            <p id="grid-help">
              Tab into the grid, then use arrow keys to move between cells. For complex controls,
              press Enter to use a cell's controls; Escape returns to cell navigation. Space toggles
              a focused checkbox.
            </p>
            <div class="scroller">
              <table
                zdTable
                zdTableGrid
                gridRowWrap="nowrap"
                gridColWrap="nowrap"
                aria-describedby="grid-help"
              >
                <caption>
                  Service controls
                </caption>
                <thead>
                  <tr zdTableRow>
                    <th
                      zdTableCell
                      cellId="service-controls-header-service"
                      cellRole="columnheader"
                      scope="col"
                    >
                      Service
                    </th>
                    @if (showGridStatus()) {
                      <th
                        zdTableCell
                        cellId="service-controls-header-status"
                        cellRole="columnheader"
                        scope="col"
                      >
                        Status
                      </th>
                    }
                    <th
                      zdTableCell
                      cellId="service-controls-header-alerts"
                      cellRole="columnheader"
                      scope="col"
                    >
                      Alerts
                    </th>
                    <th
                      zdTableCell
                      cellId="service-controls-header-action"
                      cellRole="columnheader"
                      scope="col"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  @for (service of services(); track service.id) {
                    <tr zdTableRow>
                      <th
                        zdTableCell
                        [cellId]="'service-controls-name-' + service.id"
                        cellRole="rowheader"
                        scope="row"
                      >
                        {{ service.name }}
                      </th>
                      @if (showGridStatus()) {
                        <td zdTableCell [cellId]="'service-controls-status-' + service.id">
                          {{ service.status }}
                        </td>
                      }
                      <td zdTableCell [cellId]="'service-controls-alerts-' + service.id">
                        <input
                          zdTableCellWidget
                          [widgetId]="'service-alerts-' + service.id"
                          type="checkbox"
                          [checked]="service.alerts"
                          [attr.aria-label]="'Alerts for ' + service.name"
                          (change)="toggleAlerts(service.id)"
                        />
                      </td>
                      <td zdTableCell [cellId]="'service-controls-action-' + service.id">
                        <button
                          zdTableCellWidget
                          [widgetId]="'service-restart-' + service.id"
                          type="button"
                          class="table-action"
                          (click)="restart(service.name)"
                        >
                          <span>Restart {{ service.name }}</span>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <p class="docs-status" role="status">{{ gridMessage() }}</p>
          </div>
        </docs-example>
      </docs-section>
      <docs-section
        id="data-driven-table"
        level="3"
        heading="Data table with column templates"
        description="Use CDK Table for named column templates, data-driven rows and configurable column order. Native Tab navigation reaches each action."
      >
        <docs-example label="Data table" [files]="dataTableFiles">
          <div class="docs-stack table-demo">
            <div class="docs-cluster">
              <label class="docs-choice">
                <input
                  type="checkbox"
                  [checked]="dataColumns().includes('owner')"
                  (change)="toggleOwner()"
                />
                Show owner column
              </label>
              <button type="button" class="table-action" (click)="reverseColumns()">
                Reverse columns
              </button>
            </div>
            <div
              class="scroller"
              tabindex="0"
              role="region"
              aria-label="Release ownership, scrollable"
            >
              <table zdTable cdk-table [dataSource]="releases" [trackBy]="trackRelease" zebra>
                <caption>
                  Release ownership
                </caption>
                <ng-container cdkColumnDef="service">
                  <th cdk-header-cell *cdkHeaderCellDef scope="col">Service</th>
                  <th cdk-cell *cdkCellDef="let release" scope="row">
                    {{ release.name }}
                  </th>
                  <td cdk-footer-cell *cdkFooterCellDef>{{ releases.length }} services</td>
                </ng-container>
                <ng-container cdkColumnDef="owner">
                  <th cdk-header-cell *cdkHeaderCellDef scope="col">Owner</th>
                  <td cdk-cell *cdkCellDef="let release">
                    {{ release.owner }}
                  </td>
                  <td cdk-footer-cell *cdkFooterCellDef>Platform team</td>
                </ng-container>
                <ng-container cdkColumnDef="action">
                  <th cdk-header-cell *cdkHeaderCellDef scope="col">Action</th>
                  <td cdk-cell *cdkCellDef="let release">
                    <button type="button" class="table-action" (click)="inspect(release.name)">
                      Inspect {{ release.name }}
                    </button>
                  </td>
                  <td cdk-footer-cell *cdkFooterCellDef>Review releases</td>
                </ng-container>
                <tr cdk-header-row *cdkHeaderRowDef="dataColumns()"></tr>
                <tr cdk-row *cdkRowDef="let release; columns: dataColumns()"></tr>
                <tr cdk-footer-row *cdkFooterRowDef="dataColumns()"></tr>
              </table>
            </div>
            <p class="docs-status" role="status">{{ dataMessage() }}</p>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .scroller {
      inline-size: 100%;
      max-block-size: 14rem;
      overflow: auto;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
    }

    .scroller:focus-visible {
      outline: 2px solid var(--docs-accent);
      outline-offset: 2px;
    }

    caption {
      padding-block: var(--docs-space-2);
      font-weight: var(--docs-weight-semibold);
      text-align: start;
      padding-inline: var(--docs-space-4);
    }

    td {
      font-variant-numeric: tabular-nums;
    }

    .table-demo {
      inline-size: 100%;
    }
    .table-action {
      padding: var(--docs-space-2) var(--docs-space-3);
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-md);
      color: var(--docs-text);
      background: var(--docs-surface);
      font: inherit;
      cursor: pointer;
    }
    [zdTableCell]:focus-visible,
    [zdTableCellWidget]:focus-visible,
    .table-action:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--docs-accent);
      outline-offset: 2px;
    }
    @media (forced-colors: active) {
      [zdTableCell]:focus-visible,
      [zdTableCellWidget]:focus-visible {
        outline-color: Highlight;
      }
    }
    .plans {
      inline-size: min(28rem, 100%);
    }
  `,
})
export class TablePageComponent {
  protected readonly interactiveTableFiles = interactiveTableFiles;
  protected readonly dataTableFiles = dataTableFiles;
  readonly showGridStatus = signal(true);
  readonly gridMessage = signal('No restart requested.');
  readonly services = signal([
    { id: 'api', name: 'API', status: 'Healthy', alerts: true },
    { id: 'web', name: 'Web', status: 'Healthy', alerts: false },
  ]);

  toggleAlerts(id: string): void {
    this.services.update(rows =>
      rows.map(row => (row.id === id ? { ...row, alerts: !row.alerts } : row)),
    );
  }

  restart(name: string): void {
    this.gridMessage.set('Restart requested for ' + name + '.');
  }
  readonly releases = [
    { id: 'api', name: 'API', owner: 'Alex' },
    { id: 'web', name: 'Web', owner: 'Sam' },
  ];
  readonly dataColumns = signal<string[]>(['service', 'owner', 'action']);
  readonly dataMessage = signal('Choose a release to inspect.');
  readonly trackRelease = (_index: number, release: { id: string }): string => release.id;

  toggleOwner(): void {
    this.dataColumns.update(columns =>
      columns.includes('owner')
        ? columns.filter(column => column !== 'owner')
        : [...columns, 'owner'],
    );
  }

  reverseColumns(): void {
    this.dataColumns.update(columns => [...columns].reverse());
  }

  inspect(name: string): void {
    this.dataMessage.set('Inspecting ' + name + '.');
  }

  protected readonly reference = tableReference;
  protected readonly controls = tablePlaygroundControls;
  protected readonly snippet = tablePlaygroundSnippet;
  protected readonly rowHeadersCode = rowHeadersCode;
  protected readonly flagOf = flagOf;
  protected readonly sizeOf = sizeOf;

  protected readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] as const;

  protected readonly deployments = [
    { service: 'API', counts: [12, 9, 14, 11, 16, 13, 10, 15] },
    { service: 'Web', counts: [20, 18, 22, 19, 25, 21, 17, 23] },
    { service: 'Search', counts: [4, 6, 5, 3, 7, 5, 6, 4] },
    { service: 'Email', counts: [2, 1, 3, 2, 2, 4, 1, 2] },
    { service: 'Billing', counts: [5, 7, 6, 8, 5, 6, 9, 7] },
    { service: 'Auth', counts: [3, 4, 2, 5, 3, 4, 3, 5] },
  ] as const;

  protected readonly limits = [
    { name: 'Projects', free: '3', team: 'Unlimited' },
    { name: 'Members', free: '1', team: '25' },
    { name: 'Storage', free: '1 GB', team: '100 GB' },
  ] as const;
}
