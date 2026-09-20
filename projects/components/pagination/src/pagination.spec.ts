import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { provideZordonUi } from '@pranxy/zordon-ui';
import {
  ZdPagination,
  zdPaginationRange,
  type ZdPaginationChange,
  type ZdPaginationLabels,
} from './public-api';

@Component({ template: '' })
class Destination {}

describe('Pagination', () => {
  afterEach(() => TestBed.resetTestingModule());
  it('bounds range work, fills single gaps and labels both ellipses without enumerating totals', () => {
    expect(zdPaginationRange(1, 0)).toEqual([]);
    expect(zdPaginationRange(1, 1)).toEqual([1]);
    expect(zdPaginationRange(1, 10)).toEqual([1, 2, 'ellipsis-end', 10]);
    expect(zdPaginationRange(5, 10)).toEqual([1, 'ellipsis-start', 4, 5, 6, 'ellipsis-end', 10]);
    expect(zdPaginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(zdPaginationRange(99, 10, 0)).toEqual([1, 'ellipsis-start', 10]);
    expect(zdPaginationRange(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 5)).toHaveLength(8);
    for (const args of [
      [0, 5, 1],
      [1, -1, 1],
      [1, 5, -1],
      [1, 5, 6],
      [NaN, 5, 1],
      [1.5, 5, 1],
      [1, Infinity, 1],
    ])
      expect(() => zdPaginationRange(args[0], args[1], args[2])).toThrow(RangeError);
  });
  it('renders known totals and prefix-aware native controls while leaving accepted page state to the owner', async () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'du-' } })],
    });
    const fixture = TestBed.createComponent(ZdPagination);
    fixture.componentRef.setInput('total', 100);
    fixture.componentRef.setInput('page', 5);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const changes: ZdPaginationChange[] = [];
    fixture.componentInstance.stateChange.subscribe(value => changes.push(value));
    const pages: number[] = [];
    fixture.componentInstance.pageChange.subscribe(value => pages.push(value));
    const next = el.querySelector<HTMLButtonElement>('[aria-label="Next page"]')!;
    expect(el.querySelector('.du-join .du-btn.du-join-item')).not.toBeNull();
    expect(el.querySelectorAll('.zd-ellipsis')).toHaveLength(2);
    expect(el.querySelector('[aria-current]')!.getAttribute('aria-label')).toBe('Page 5');
    next.click();
    await fixture.whenStable();
    expect(changes).toEqual([{ page: 6, pageSize: 10 }]);
    expect(pages).toEqual([6]);
    expect(fixture.componentInstance.currentPage()).toBe(5);
    for (const init of [
      { button: 1 },
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
      { altKey: true },
    ])
      next.dispatchEvent(new MouseEvent('click', init));
    (el.querySelector('[aria-current]') as HTMLButtonElement).click();
    expect(changes).toHaveLength(1);
    fixture.componentRef.setInput('page', 6);
    await fixture.whenStable();
    expect(el.querySelector('[role="status"]')!.textContent!.trim()).toBe('Page 6 of 10');
    fixture.componentRef.setInput('loading', '');
    await fixture.whenStable();
    expect(el.querySelector('nav')!.getAttribute('aria-busy')).toBe('true');
    expect(el.querySelector('[role="status"]')!.textContent!.trim()).toBe('Loading results');
    next.dispatchEvent(new MouseEvent('click'));
    expect(changes).toHaveLength(1);
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect(next.disabled).toBe(true);
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('total', 0);
    await fixture.whenStable();
    expect(fixture.componentInstance.currentPage()).toBe(1);
    expect(el.querySelector('[role="status"]')!.textContent!.trim()).toBe('No results');
    expect(el.querySelector('[aria-current]')).toBeNull();
    expect([...el.querySelectorAll('button')].every(button => button.disabled)).toBe(true);
  });
  it('supports unknown totals, safe upper bounds, localized labels and five sizes', async () => {
    const fixture = TestBed.createComponent(ZdPagination);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[role="status"]')!.textContent!.trim()).toBe('Page 1');
    expect(el.querySelector('[aria-label="Last page"]')).toBeNull();
    expect(el.querySelector<HTMLButtonElement>('[aria-label="Next page"]')!.disabled).toBe(true);
    fixture.componentRef.setInput('hasNext', true);
    fixture.componentRef.setInput('page', 8);
    await fixture.whenStable();
    expect(el.querySelector<HTMLButtonElement>('[aria-label="Next page"]')!.disabled).toBe(false);
    fixture.componentRef.setInput('page', Number.MAX_SAFE_INTEGER);
    await fixture.whenStable();
    expect(el.querySelector<HTMLButtonElement>('[aria-label="Next page"]')!.disabled).toBe(true);
    const localized: ZdPaginationLabels = {
      first: 'Primeira',
      previous: 'Anterior',
      next: 'Seguinte',
      last: 'Última',
      pageSize: 'Por página',
      loading: 'A carregar',
      page: page => `Página ${page}`,
      status: page => `Atual ${page}`,
    };
    fixture.componentRef.setInput('labels', localized);
    fixture.componentRef.setInput('label', 'Resultados');
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl']) {
      fixture.componentRef.setInput('size', size);
      await fixture.whenStable();
      expect(el.querySelector('.btn-' + size)).not.toBeNull();
    }
    expect(el.querySelector('nav')!.getAttribute('aria-label')).toBe('Resultados');
    expect(el.querySelector('[aria-label="Seguinte"]')).not.toBeNull();
    expect(el.querySelector('[role="status"]')!.textContent!.trim()).toContain('Atual');
  });
  it('resets size requests atomically, deduplicates options and restores a rejected native selection', async () => {
    const fixture = TestBed.createComponent(ZdPagination);
    fixture.componentRef.setInput('page', 5);
    fixture.componentRef.setInput('pageSizeOptions', [25, 50, 25]);
    await fixture.whenStable();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect([...select.options].map(option => option.value)).toEqual(['10', '25', '50']);
    const requests: ZdPaginationChange[] = [];
    const pages: number[] = [];
    const sizes: number[] = [];
    fixture.componentInstance.stateChange.subscribe(value => requests.push(value));
    fixture.componentInstance.pageChange.subscribe(value => pages.push(value));
    fixture.componentInstance.pageSizeChange.subscribe(value => sizes.push(value));
    select.value = '25';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(requests).toEqual([{ page: 1, pageSize: 25 }]);
    expect(pages).toEqual([1]);
    expect(sizes).toEqual([25]);
    expect(select.value).toBe('10');
    select.dispatchEvent(new Event('change'));
    select.value = '99';
    select.dispatchEvent(new Event('change'));
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    select.value = '50';
    select.dispatchEvent(new Event('change'));
    expect(requests).toHaveLength(1);
    fixture.componentRef.setInput('pageSize', 25);
    fixture.componentRef.setInput('page', 1);
    await fixture.whenStable();
    expect(select.value).toBe('25');
  });
  it('synchronizes query links and size navigation while preserving unrelated parameters and fragments', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'items', component: Destination }])],
    });
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/items?p=5&limit=25&filter=active#results');
    const fixture = TestBed.createComponent(ZdPagination);
    fixture.componentRef.setInput('query', { page: 'p', pageSize: 'limit' });
    fixture.componentRef.setInput('total', 250);
    fixture.componentRef.setInput('pageSizeOptions', [10, 25, 50]);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(fixture.componentInstance.currentPage()).toBe(5);
    expect(fixture.componentInstance.currentPageSize()).toBe(25);
    expect(el.querySelector('option[value="25"]')!.hasAttribute('selected')).toBe(true);
    const next = el.querySelector<HTMLAnchorElement>('[aria-label="Next page"]')!;
    expect(next.getAttribute('href')).toBe('/items?p=6&limit=25&filter=active#results');
    next.click();
    await fixture.whenStable();
    expect(router.url).toBe('/items?p=6&limit=25&filter=active#results');
    expect(fixture.componentInstance.currentPage()).toBe(6);
    const select = el.querySelector('select')!;
    select.value = '50';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(router.url).toBe('/items?p=1&limit=50&filter=active#results');
    expect(el.querySelector('option[value="50"]')!.hasAttribute('selected')).toBe(true);
    expect(el.querySelector('option[value="25"]')!.hasAttribute('selected')).toBe(false);
    expect(el.querySelector('[aria-label="Previous page"]')!.hasAttribute('href')).toBe(false);
    await router.navigateByUrl('/items?p=999&limit=0');
    await fixture.whenStable();
    expect(fixture.componentInstance.currentPage()).toBe(25);
    expect(fixture.componentInstance.currentPageSize()).toBe(10);
    await router.navigateByUrl('/items?p=bad&limit=1.5');
    await fixture.whenStable();
    expect(fixture.componentInstance.currentPage()).toBe(1);
    await router.navigateByUrl('/items?p=0&limit=9007199254740992');
    await fixture.whenStable();
    expect(fixture.componentInstance.currentPage()).toBe(1);
    expect(fixture.componentInstance.currentPageSize()).toBe(10);
    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();
    expect(next.hasAttribute('href')).toBe(false);
    expect(next.getAttribute('aria-disabled')).toBe('true');
    expect(next.getAttribute('tabindex')).toBe('-1');
    next.click();
    await fixture.whenStable();
    expect(router.url).toContain('p=0');
  });
  it('rejects invalid configuration without weakening numeric or Router contracts', () => {
    for (const [input, value] of [
      ['page', 0],
      ['pageSize', -1],
      ['total', -1],
      ['siblings', 6],
      ['siblings', 1.5],
      ['pageSizeOptions', [0]],
    ]) {
      const fixture = TestBed.createComponent(ZdPagination);
      fixture.componentRef.setInput(input as string, value);
      expect(() => fixture.detectChanges()).toThrow(RangeError);
      fixture.destroy();
    }
    const noRouter = TestBed.createComponent(ZdPagination);
    noRouter.componentRef.setInput('query', { page: 'p', pageSize: 's' });
    expect(() => noRouter.detectChanges()).toThrow(/requires Router/);
    noRouter.destroy();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: null }],
    });
    const noRoute = TestBed.createComponent(ZdPagination);
    noRoute.componentRef.setInput('query', { page: 'p', pageSize: 's' });
    expect(() => noRoute.detectChanges()).toThrow(/requires Router/);
    noRoute.destroy();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    for (const query of [
      { page: '', pageSize: 's' },
      { page: 'p', pageSize: '' },
      { page: 'p', pageSize: 'p' },
    ]) {
      const fixture = TestBed.createComponent(ZdPagination);
      fixture.componentRef.setInput('query', query);
      expect(() => fixture.detectChanges()).toThrow(/nonempty and distinct/);
      fixture.destroy();
    }
  });
});
