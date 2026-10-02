import { BidiModule } from '@angular/cdk/bidi';
import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ZdTable,
  ZdTableGrid,
  ZdTableRow,
  ZdTableCell,
  ZdTableCellWidget,
} from '@pranxy/zordon-ui/table';

@Component({
  selector: 'docs-table-test-fixture',
  imports: [
    BidiModule,
    CdkTableModule,
    ZdTable,
    ZdTableGrid,
    ZdTableRow,
    ZdTableCell,
    ZdTableCellWidget,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Table interaction fixture</h1>
    <button type="button" (click)="rtl.set(!rtl())">Toggle direction</button>
    <button type="button" (click)="present.set(!present())">Toggle grid</button>
    <button type="button" (click)="gridDisabled.set(!gridDisabled())">Toggle disabled</button>
    <button type="button" (click)="rows.set(rows().slice().reverse())">Reverse rows</button>
    <button
      type="button"
      (click)="
        columns.set(columns().length === 2 ? ['action', 'name', 'value'] : ['name', 'action'])
      "
    >
      Change data columns
    </button>
    <div [dir]="rtl() ? 'rtl' : 'ltr'">
      <button type="button">Before grid</button>
      @if (present()) {
        <table
          zdTable
          zdTableGrid
          [gridDisabled]="gridDisabled()"
          [gridSoftDisabled]="false"
          gridRowWrap="nowrap"
          gridColWrap="nowrap"
          aria-label="Interactive people"
          tabindex="-1"
          (keydown.alt.r)="reverseRows($event)"
        >
          <caption>
            Interactive people
          </caption>
          <thead>
            <tr zdTableRow>
              <th zdTableCell cellId="people-header-name" cellRole="columnheader" scope="col">
                Name
              </th>
              <th zdTableCell cellId="people-header-action" cellRole="columnheader" scope="col">
                Action
              </th>
              <th zdTableCell cellId="people-header-selected" cellRole="columnheader" scope="col">
                Selected
              </th>
              <th zdTableCell cellId="people-header-notes" cellRole="columnheader" scope="col">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows(); track row.id) {
              <tr zdTableRow>
                <th zdTableCell [cellId]="'people-name-' + row.id" cellRole="rowheader" scope="row">
                  <span>{{ row.name }}</span>
                </th>
                <td zdTableCell [cellId]="'people-action-' + row.id" [cellDisabled]="row.id === 2">
                  <button
                    type="button"
                    zdTableCellWidget
                    [widgetId]="'people-action-widget-' + row.id"
                    [widgetDisabled]="row.id === 2 || gridDisabled()"
                    [disabled]="row.id === 2 || gridDisabled()"
                    (click)="action.set(row.name)"
                  >
                    <span>Edit {{ row.name }}</span>
                  </button>
                </td>
                <td zdTableCell [cellId]="'people-selection-' + row.id">
                  <input
                    type="checkbox"
                    zdTableCellWidget
                    [widgetId]="'people-selection-widget-' + row.id"
                    [attr.aria-label]="'Select ' + row.name"
                    [checked]="selected() === row.id"
                    [disabled]="gridDisabled()"
                    [widgetDisabled]="gridDisabled()"
                    (change)="selected.set(selected() === row.id ? null : row.id)"
                  />
                </td>
                <td zdTableCell [cellId]="'people-notes-' + row.id">
                  <input
                    zdTableCellWidget
                    [widgetId]="'people-notes-widget-' + row.id"
                    widgetType="complex"
                    [attr.aria-label]="'Notes for ' + row.name"
                    [disabled]="gridDisabled()"
                    [widgetDisabled]="gridDisabled()"
                    [value]="row.note"
                  />
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
      <button type="button">After grid</button>
    </div>
    <p role="status">{{ action() ? 'Editing ' + action() : 'No action' }}</p>
    <p>Selected ID: {{ selected() ?? 'none' }}</p>
    <table zdTable cdk-table [dataSource]="rows()" [trackBy]="trackRow" aria-label="Data people">
      <caption>
        Data people
      </caption>
      <ng-container cdkColumnDef="name">
        <th cdk-header-cell *cdkHeaderCellDef scope="col">Name</th>
        <td cdk-cell *cdkCellDef="let row">{{ row.name }}</td>
        <td cdk-footer-cell *cdkFooterCellDef>Total people: {{ rows().length }}</td>
      </ng-container>
      <ng-container cdkColumnDef="action">
        <th cdk-header-cell *cdkHeaderCellDef scope="col">Action</th>
        <td cdk-cell *cdkCellDef="let row">
          <button type="button" (click)="action.set(row.name)">Open {{ row.name }}</button>
        </td>
        <td cdk-footer-cell *cdkFooterCellDef></td>
      </ng-container>
      <ng-container cdkColumnDef="value">
        <th cdk-header-cell *cdkHeaderCellDef scope="col">Notes</th>
        <td cdk-cell *cdkCellDef="let row">{{ row.note }}</td>
        <td cdk-footer-cell *cdkFooterCellDef></td>
      </ng-container>
      <tr cdk-header-row *cdkHeaderRowDef="columns()"></tr>
      <tr cdk-row *cdkRowDef="let row; columns: columns()"></tr>
      <tr cdk-footer-row *cdkFooterRowDef="columns()"></tr>
    </table>
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem;
      color: #111;
      background: #fff;
    }
    table {
      border-collapse: collapse;
      margin-block: 1rem;
    }
    th,
    td {
      padding: 0.5rem;
      border: 1px solid #666;
    }
    button,
    input {
      font: inherit;
    }
    :focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
  `,
})
export class TableTestFixtureComponent {
  readonly rtl = signal(false);
  readonly present = signal(true);
  readonly gridDisabled = signal(false);
  readonly rows = signal([
    { id: 1, name: 'Ada', note: 'First' },
    { id: 2, name: 'Grace', note: 'Second' },
  ]);
  readonly columns = signal(['name', 'action']);
  readonly action = signal('');
  readonly selected = signal<number | null>(null);
  readonly trackRow = (_index: number, row: { id: number }) => row.id;

  reverseRows(event: Event): void {
    event.preventDefault();
    this.rows.update(rows => [...rows].reverse());
  }
}
