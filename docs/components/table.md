# Table

**Component ID:** DSP-17  
**Entry point:** `@pranxy/zordon-ui/table`

`ZdTable` applies daisyUI table, size, zebra and pinned-row/column classes. It preserves the native table contract. Its existing `size`, `zebra`, `pinRows` and `pinCols` inputs are unchanged.

Choose one of two richer compositions:

- Use `ZdTableGrid`, `ZdTableRow`, `ZdTableCell` and `ZdTableCellWidget` for a manually authored interactive table. Angular Aria owns keyboard movement, cell focus and widget activation. Angular control flow owns rows and visible columns.
- Use `ZdTable` with `CdkTableModule` for named column/header/footer templates, a data source, tracked rows and displayed-column order. The result keeps native table semantics; buttons use ordinary Tab navigation.

Do not combine the Aria grid wrappers with CDK's generated row and cell templates. Their template composition does not currently satisfy Angular Aria's row/cell discovery. No private Angular APIs or replacement keyboard model are used.

## Native table

```html
<table zdTable size="sm" zebra>
  <caption>
    Monthly deployments
  </caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">September</th>
      <td>12</td>
    </tr>
  </tbody>
</table>
```

## Interactive grid

Every cell requires `cellId` and every widget requires `widgetId`. Use a table-instance prefix plus stable row/column keys; IDs must be document-unique and identical during server rendering and hydration. The wrappers enforce explicit IDs because the installed Aria defaults use randomized IDs. Cell roles, identity and native spans are also rendered on the server. For runtime RTL changes, import CDK `Dir` or `BidiModule` and bind `[dir]` on an ancestor.

Import all five directives from the table entry point. Header and body rows need `zdTableRow`; all navigable cells need `zdTableCell`. Set `cellRole="columnheader"` or `cellRole="rowheader"` on header cells and keep their native `scope`. The grid's wrapping aliases are `gridRowWrap` and `gridColWrap`.

```html
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
    Tab into the grid, then use arrow keys to move between cells. For complex controls, press Enter
    to use a cell's controls; Escape returns to cell navigation. Space toggles a focused checkbox.
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
```

```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ZdTable,
  ZdTableGrid,
  ZdTableRow,
  ZdTableCell,
  ZdTableCellWidget,
} from '@pranxy/zordon-ui/table';

@Component({
  selector: 'example-keyboard-grid',
  imports: [ZdTable, ZdTableGrid, ZdTableRow, ZdTableCell, ZdTableCellWidget],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './keyboard-grid.html',
  styleUrl: './table-example.css',
})
export class KeyboardGridExample {
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
}
```

Tab enters the grid. Arrow keys navigate its cells; Enter enters control interaction and Escape returns to cell navigation. Use `zdTableCellWidget` on buttons, checkboxes and other controls. `widgetType` defaults to `simple`; `complex` and `editable` are available for controls that consume navigation keys. `widgetFocusTarget` optionally forwards focus to a separate element. For disabled native controls, bind both `[widgetDisabled]` and `[disabled]`.

## Data table with column templates

The CDK owns rendering and keeps its existing API. Supply `dataSource` and `trackBy`, define named columns, and choose column order with the header/body/footer row definitions. Custom actions remain ordinary native buttons.

```html
<div class="docs-stack table-demo">
  <div class="docs-cluster">
    <label class="docs-choice">
      <input type="checkbox" [checked]="dataColumns().includes('owner')" (change)="toggleOwner()" />
      Show owner column
    </label>
    <button type="button" class="table-action" (click)="reverseColumns()">Reverse columns</button>
  </div>
  <div class="scroller" tabindex="0" role="region" aria-label="Release ownership, scrollable">
    <table zdTable cdk-table [dataSource]="releases" [trackBy]="trackRelease" zebra>
      <caption>
        Release ownership
      </caption>
      <ng-container cdkColumnDef="service">
        <th cdk-header-cell *cdkHeaderCellDef scope="col">Service</th>
        <th cdk-cell *cdkCellDef="let release" scope="row">{{ release.name }}</th>
        <td cdk-footer-cell *cdkFooterCellDef>{{ releases.length }} services</td>
      </ng-container>
      <ng-container cdkColumnDef="owner">
        <th cdk-header-cell *cdkHeaderCellDef scope="col">Owner</th>
        <td cdk-cell *cdkCellDef="let release">{{ release.owner }}</td>
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
```

```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { ZdTable } from '@pranxy/zordon-ui/table';

@Component({
  selector: 'example-data-table',
  imports: [CdkTableModule, ZdTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-table.html',
  styleUrl: './table-example.css',
})
export class DataTableExample {
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
}
```

## Focus and overflow

Both examples use the following optional CSS. Configure daisyUI/Tailwind table candidates as documented by the main entry point. In the documentation site, focus colors use the site's theme tokens.

```css
.table-demo {
  inline-size: 100%;
}
.scroller {
  max-inline-size: 100%;
  overflow: auto;
}
[zdTableCell]:focus-visible,
[zdTableCellWidget]:focus-visible,
.table-action:focus-visible,
input:focus-visible,
.scroller:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
.table-action {
  font: inherit;
  cursor: pointer;
}
@media (forced-colors: active) {
  [zdTableCell]:focus-visible,
  [zdTableCellWidget]:focus-visible {
    outline-color: Highlight;
  }
}
```

Name each table with a caption or accessible label. A native table's scroll wrapper needs a name, region role and keyboard focus when scrolling is otherwise inaccessible. Interactive grids should preserve visible focus while navigating into off-screen cells. Keep data and columns deterministic across SSR and hydration.

The table entry point does not implement sorting, filtering, editing, resizing or virtualization. Application data updates remain application-owned. Maturity remains Planned while manual assistive-technology and release gates are outstanding.

## Sources

- [Angular Aria Grid](https://angular.dev/guide/aria/grid)
- [Angular CDK Table](https://material.angular.dev/cdk/table/overview)
- [daisyUI Table](https://daisyui.com/components/table/)
