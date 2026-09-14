import { Dir } from '@angular/cdk/bidi';
import { Grid, GridCell, GridCellWidget, GridRow } from '@angular/aria/grid';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

/** Test-only composition spike. Not a Calendar implementation or public library export. */
@Component({
  selector: 'docs-calendar-grid-probe',
  imports: [Dir, Grid, GridRow, GridCell, GridCellWidget],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-label="Calendar grid integration" data-testid="calendar-grid-probe">
      <button type="button" (click)="rtl.set(!rtl())">Toggle grid direction</button>
      <button type="button" (click)="disabled.set(!disabled())">Toggle grid disabled</button>
      <button type="button" (click)="present.set(!present())">Toggle grid presence</button>
      <button type="button" (click)="selected.set(16)">Select date externally</button>
      @if (present()) {
        <div [dir]="rtl() ? 'rtl' : 'ltr'">
          <table
            ngGrid
            aria-label="September 2026"
            [enableSelection]="true"
            [disabled]="disabled()"
            [softDisabled]="true"
            selectionMode="explicit"
            rowWrap="continuous"
            colWrap="nowrap"
          >
            <tbody>
              @for (week of weeks; track $index) {
                <tr ngGridRow>
                  @for (day of week; track day) {
                    <td
                      ngGridCell
                      role="gridcell"
                      [id]="'calendar-probe-cell-' + day"
                      [attr.id]="'calendar-probe-cell-' + day"
                      [selected]="selected() === day"
                      (selectedChange)="choose(day)"
                      [attr.aria-selected]="selected() === day"
                      [disabled]="day === 15"
                      [attr.aria-disabled]="disabled() || day === 15"
                    >
                      <button
                        ngGridCellWidget
                        type="button"
                        [id]="'calendar-probe-day-' + day"
                        [attr.id]="'calendar-probe-day-' + day"
                        [attr.aria-label]="'September ' + day + ', 2026'"
                        [disabled]="disabled()"
                        [attr.aria-disabled]="disabled() || day === 15"
                      >
                        {{ day }}
                      </button>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
      <output aria-label="Selected probe date">{{ selected() }}</output>
    </section>
  `,
})
export class CalendarGridProbeComponent {
  protected readonly weeks = [
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
  ];
  protected readonly selected = signal(14);
  protected readonly rtl = signal(false);
  protected readonly disabled = signal(false);
  protected readonly present = signal(true);

  protected choose(day: number): void {
    if (!this.disabled() && day !== 15) this.selected.set(day);
  }
}
