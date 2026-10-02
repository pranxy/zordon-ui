import { Grid, GridCell, GridCellWidget, GridRow } from '@angular/aria/grid';
import { Directive, inject, input, type Signal } from '@angular/core';

/** Opt-in keyboard interaction for native tables. Do not use with CDK cell templates. */
@Directive({
  selector: 'table[zdTableGrid]',
  exportAs: 'zdTableGrid',
  hostDirectives: [
    {
      directive: Grid,
      inputs: [
        'disabled: gridDisabled',
        'softDisabled: gridSoftDisabled',
        'focusMode: gridFocusMode',
        'rowWrap: gridRowWrap',
        'colWrap: gridColWrap',
        'enableSelection: gridEnableSelection',
        'multi: gridMulti',
        'selectionMode: gridSelectionMode',
        'enableRangeSelection: gridEnableRangeSelection',
      ],
    },
  ],
})
export class ZdTableGrid {}

/** A native row whose cells participate in its parent table grid. */
@Directive({
  selector: 'tr[zdTableRow]',
  exportAs: 'zdTableRow',
  hostDirectives: [{ directive: GridRow, inputs: ['rowIndex: tableRowIndex'] }],
})
export class ZdTableRow {}

/** A grid cell. Set cellRole explicitly for column and row headers. */
@Directive({
  selector: 'th[zdTableCell], td[zdTableCell]',
  exportAs: 'zdTableCell',
  // Aria 21.2 writes cell attributes after render, which does not run on the server.
  // Mirror semantic inputs so the initial HTML already has its roles and identity.
  host: {
    'ngGridCell': '',
    '[attr.role]': 'semanticRole()',
    '[attr.id]': 'semanticId()',
    '[attr.rowspan]': 'semanticRowSpan()',
    '[attr.colspan]': 'semanticColSpan()',
  },
  hostDirectives: [
    {
      directive: GridCell,
      inputs: [
        'id: cellId',
        'role: cellRole',
        'disabled: cellDisabled',
        'selected: cellSelected',
        'selectable: cellSelectable',
        'rowSpan: cellRowSpan',
        'colSpan: cellColSpan',
        'rowIndex: cellRowIndex',
        'colIndex: cellColIndex',
        'orientation: cellOrientation',
        'wrap: cellWrap',
      ],
      outputs: ['selectedChange: cellSelectedChange'],
    },
  ],
})
export class ZdTableCell {
  /** Stable and document-unique across server and client. Also forwarded to Aria. */
  readonly cellId = input.required<string>();
  private readonly cell = inject(GridCell);
  protected readonly semanticRole: Signal<'gridcell' | 'columnheader' | 'rowheader'> =
    this.cell.role;
  protected readonly semanticId: Signal<string> = this.cell.id;
  protected readonly semanticRowSpan: Signal<number> = this.cell.rowSpan;
  protected readonly semanticColSpan: Signal<number> = this.cell.colSpan;
}

/** A focusable control inside a grid cell; consumers still own native disabled state. */
@Directive({
  selector: '[zdTableCellWidget]',
  exportAs: 'zdTableCellWidget',
  host: { ngGridCellWidget: '' },
  hostDirectives: [
    {
      directive: GridCellWidget,
      inputs: [
        'id: widgetId',
        'widgetType',
        'disabled: widgetDisabled',
        'focusTarget: widgetFocusTarget',
      ],
      outputs: ['activated: widgetActivated', 'deactivated: widgetDeactivated'],
    },
  ],
})
export class ZdTableCellWidget {
  /** Stable and document-unique across server and client. Also forwarded to Aria. */
  readonly widgetId = input.required<string>();
  private readonly widget = inject(GridCellWidget);
  readonly active: Signal<boolean> = this.widget.active;
  readonly isActivated: Signal<boolean> = this.widget.isActivated;

  activate(): void {
    this.widget.activate();
  }
  deactivate(): void {
    this.widget.deactivate();
  }
}
