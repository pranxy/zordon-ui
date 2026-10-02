import { BidiModule } from '@angular/cdk/bidi';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ZdTable } from './table';
import { ZdTableCell, ZdTableCellWidget, ZdTableGrid, ZdTableRow } from './table-grid';

@Component({
  imports: [BidiModule, ZdTable, ZdTableGrid, ZdTableRow, ZdTableCell, ZdTableCellWidget],
  template: `
    <div [dir]="direction()">
      @if (visible()) {
        <table
          zdTable
          zdTableGrid
          [gridDisabled]="disabled()"
          [gridSoftDisabled]="false"
          [gridEnableSelection]="selection()"
          gridSelectionMode="explicit"
        >
          <caption>
            People
          </caption>
          <thead>
            <tr zdTableRow>
              @for (column of columns(); track column) {
                <th
                  zdTableCell
                  [cellId]="'test-header-' + column"
                  cellRole="columnheader"
                  scope="col"
                >
                  {{ column }}
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of rows(); track row.name) {
              <tr zdTableRow>
                @for (column of columns(); track column) {
                  <td
                    zdTableCell
                    [cellId]="'test-' + row.name + '-' + column"
                    [cellDisabled]="column === 'name' && cellDisabled()"
                    [cellSelected]="selected() === row.name && column === 'name'"
                    (cellSelectedChange)="select(row.name, column, $event)"
                  >
                    @if (column === 'name') {
                      <span>{{ row.name }}</span>
                    } @else {
                      <button
                        zdTableCellWidget
                        [widgetId]="'test-widget-' + row.name"
                        [disabled]="widgetDisabled()"
                        [widgetDisabled]="widgetDisabled()"
                        [widgetType]="widgetType()"
                      >
                        <span>{{ row.action }}</span>
                      </button>
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
class Host {
  readonly visible = signal(true);
  readonly rows = signal([
    { name: 'Ada', action: 'Edit Ada' },
    { name: 'Grace', action: 'Edit Grace' },
  ]);
  readonly columns = signal(['name', 'action']);
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly disabled = signal(false);
  readonly cellDisabled = signal(false);
  readonly widgetDisabled = signal(false);
  readonly widgetType = signal<'simple' | 'complex'>('simple');
  readonly selection = signal(false);
  readonly selected = signal('');
  select(name: string, column: string, selected: boolean): void {
    if (column === 'name') this.selected.set(selected ? name : '');
  }
}

async function setup() {
  TestBed.configureTestingModule({ imports: [Host] });
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const root: HTMLElement = fixture.nativeElement;
  const cell = (name: string): HTMLElement => {
    const match = Array.from(root.querySelectorAll<HTMLElement>('[zdTableCell]')).find(
      element => element.textContent?.trim() === name,
    );
    if (!match) throw new Error(`Missing cell ${name}`);
    return match;
  };
  const key = async (key: string) => {
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    await fixture.whenStable();
  };
  return { fixture, root, cell, key };
}

describe('Aria Table composition', () => {
  it('preserves native caption, styling and header scope while exposing grid roles', async () => {
    const { root, cell } = await setup();
    expect(root.querySelector('table')?.getAttribute('role')).toBe('grid');
    expect(root.querySelector('table')?.classList.contains('table')).toBe(true);
    expect(root.querySelector('caption')?.textContent?.trim()).toBe('People');
    expect(cell('name').getAttribute('role')).toBe('columnheader');
    expect(cell('name').getAttribute('scope')).toBe('col');
    expect(cell('Ada').getAttribute('role')).toBe('gridcell');
    expect(cell('Ada').closest('tr')?.getAttribute('role')).toBe('row');
  });

  it('navigates horizontally into widgets and vertically between data rows', async () => {
    const { cell, key } = await setup();
    cell('Ada').focus();
    await key('ArrowRight');
    expect(document.activeElement).toBe(cell('Edit Ada').querySelector('button'));
    await key('ArrowDown');
    expect(document.activeElement).toBe(cell('Edit Grace').querySelector('button'));
  });

  it('resolves pointer targets nested inside cells and widgets', async () => {
    const { fixture, cell } = await setup();
    cell('Ada').focus();
    cell('Grace')
      .querySelector('span')!
      .dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(cell('Grace'));
    cell('Edit Ada')
      .querySelector('span')!
      .dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(cell('Edit Ada').querySelector('button'));
  });

  it('navigates after rows are replaced and columns reordered', async () => {
    const { fixture, root, cell, key } = await setup();
    fixture.componentInstance.rows.set([{ name: 'Lin', action: 'Edit Lin' }]);
    fixture.componentInstance.columns.set(['action', 'name']);
    await fixture.whenStable();
    expect(
      Array.from(root.querySelectorAll('td')).map(element => element.textContent?.trim()),
    ).toEqual(['Edit Lin', 'Lin']);
    cell('Edit Lin').querySelector('button')!.focus();
    await key('ArrowRight');
    expect(document.activeElement).toBe(cell('Lin'));
  });

  it('respects RTL navigation and hard-disabled cells', async () => {
    const { fixture, cell, key } = await setup();
    fixture.componentInstance.direction.set('rtl');
    await fixture.whenStable();
    cell('Ada').focus();
    await key('ArrowLeft');
    expect(document.activeElement).toBe(cell('Edit Ada').querySelector('button'));
    fixture.componentInstance.cellDisabled.set(true);
    await fixture.whenStable();
    await key('ArrowRight');
    expect(document.activeElement).toBe(cell('Edit Ada').querySelector('button'));
    expect(cell('Ada').getAttribute('aria-disabled')).toBe('true');
  });

  it('emits controlled cell selection changes and prevents navigation when grid is disabled', async () => {
    const { fixture, cell, key } = await setup();
    fixture.componentInstance.selection.set(true);
    await fixture.whenStable();
    cell('Ada').focus();
    await key(' ');
    expect(fixture.componentInstance.selected()).toBe('Ada');
    expect(cell('Ada').getAttribute('aria-selected')).toBe('true');
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    cell('Ada').focus();
    await key('ArrowRight');
    expect(document.activeElement).toBe(cell('Ada'));
  });

  it('preserves consumer native widget disabling and tears down a focused grid', async () => {
    const { fixture, root, cell } = await setup();
    fixture.componentInstance.widgetDisabled.set(true);
    await fixture.whenStable();
    expect(cell('Edit Ada').querySelector('button')!.disabled).toBe(true);
    cell('Ada').focus();
    fixture.componentInstance.visible.set(false);
    await fixture.whenStable();
    expect(root.contains(document.activeElement)).toBe(false);
    expect(document.querySelector('table[zdTableGrid]')).toBeNull();
  });

  it('exposes widget focus and activation without exposing Aria objects', async () => {
    const { fixture, cell } = await setup();
    fixture.componentInstance.widgetType.set('complex');
    await fixture.whenStable();
    const widget = fixture.debugElement
      .query(By.directive(ZdTableCellWidget))
      .injector.get(ZdTableCellWidget);
    cell('Edit Ada').querySelector('button')!.focus();
    await fixture.whenStable();
    expect(widget.active()).toBe(true);
    widget.activate();
    await fixture.whenStable();
    expect(widget.isActivated()).toBe(true);
    widget.deactivate();
    await fixture.whenStable();
    expect(widget.isActivated()).toBe(false);
  });
});
