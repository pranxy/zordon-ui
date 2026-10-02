import { Component, type Signal } from '@angular/core';
import {
  resolveTableSize,
  type ZdTableSize,
  ZdTable,
  ZdTableGrid,
  ZdTableRow,
  ZdTableCell,
  ZdTableCellWidget,
} from '@pranxy/zordon-ui/table';

const size: ZdTableSize = 'xl';
void resolveTableSize(size);

@Component({
  imports: [ZdTable, ZdTableGrid, ZdTableRow, ZdTableCell, ZdTableCellWidget],
  template: `<table zdTable zdTableGrid gridFocusMode="roving" [gridEnableSelection]="true">
    <tr zdTableRow>
      <th zdTableCell cellId="type-header" cellRole="columnheader">Name</th>
    </tr>
    <tr zdTableRow>
      <td zdTableCell cellId="type-cell" [(cellSelected)]="selected">
        <button zdTableCellWidget widgetId="type-widget" widgetType="simple">Edit</button>
      </td>
    </tr>
  </table>`,
})
export class TableConsumer {
  selected = false;
}

declare const widget: ZdTableCellWidget;
const active: Signal<boolean> = widget.active;
const activated: Signal<boolean> = widget.isActivated;
widget.activate();
widget.deactivate();
void active;
void activated;
