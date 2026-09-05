import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import { resolveTableSize, type ZdTableSize, ZdTable } from './table';

@Component({
  imports: [ZdTable],
  template: `<table
    zdTable
    [size]="size()"
    [zebra]="zebra()"
    [pinRows]="pinRows()"
    [pinCols]="pinCols()"
    class="consumer"
  >
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
  </table>`,
})
class Host {
  readonly size = signal<ZdTableSize | undefined>('sm');
  readonly zebra = signal(true);
  readonly pinRows = signal(true);
  readonly pinCols = signal(true);
}

describe('ZdTable', () => {
  it('applies documented candidates while preserving native table semantics', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('[zdTable]') as HTMLTableElement;

    for (const token of [
      'table',
      'table-sm',
      'table-zebra',
      'table-pin-rows',
      'table-pin-cols',
      'consumer',
    ]) {
      expect(table.classList.contains(token)).toBe(true);
    }
    expect(table.tagName).toBe('TABLE');
    expect(table.querySelector('caption')?.textContent).toContain('Monthly deployments');
    expect(table.querySelector('th[scope="col"]')?.textContent).toContain('Month');
    expect(table.hasAttribute('role')).toBe(false);
  });

  it('clears stale optional candidates when options are removed', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    fixture.componentInstance.size.set(undefined);
    fixture.componentInstance.zebra.set(false);
    fixture.componentInstance.pinRows.set(false);
    fixture.componentInstance.pinCols.set(false);
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('[zdTable]') as HTMLTableElement;
    expect(table.classList.contains('table')).toBe(true);
    for (const token of ['table-sm', 'table-zebra', 'table-pin-rows', 'table-pin-cols'])
      expect(table.classList.contains(token)).toBe(false);
  });

  it('uses complete configured prefix tokens and rejects unknown sizes', () => {
    TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('[zdTable]') as HTMLTableElement;
    for (const token of [
      'tw:d-table',
      'tw:d-table-sm',
      'tw:d-table-zebra',
      'tw:d-table-pin-rows',
      'tw:d-table-pin-cols',
    ])
      expect(table.classList.contains(token)).toBe(true);
    expect(() => resolveTableSize('wide')).toThrowError(/Table size/);
  });
});
