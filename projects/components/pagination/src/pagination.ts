import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { type ZdSize } from '@pranxy/zordon-ui';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdJoin, ZdJoinItem } from '@pranxy/zordon-ui/join';
import { paginationInteger, zdPaginationRange } from './pagination-range';

export interface ZdPaginationChange {
  readonly page: number;
  readonly pageSize: number;
}
export interface ZdPaginationQuery {
  readonly page: string;
  readonly pageSize: string;
}
export interface ZdPaginationLabels {
  readonly first: string;
  readonly previous: string;
  readonly next: string;
  readonly last: string;
  readonly pageSize: string;
  readonly loading: string;
  readonly page: (page: number) => string;
  readonly status: (page: number, pageCount: number | null, total: number | null) => string;
}
const labels: ZdPaginationLabels = {
  first: 'First page',
  previous: 'Previous page',
  next: 'Next page',
  last: 'Last page',
  pageSize: 'Items per page',
  loading: 'Loading results',
  page: page => `Page ${page}`,
  status: (page, count, total) =>
    total === 0 ? 'No results' : count === null ? `Page ${page}` : `Page ${page} of ${count}`,
};

@Component({
  selector: 'zd-pagination',
  imports: [ZdButton, ZdJoin, ZdJoinItem, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './pagination.css',
  template: `
    <nav [attr.aria-label]="label()" [attr.aria-busy]="loading()">
      <div zdJoin class="zd-pages">
        @for (control of controls(); track control.key) {
          @if (control.page === 0) {
            <span class="zd-ellipsis" aria-hidden="true">…</span>
          } @else if (routing()) {
            <a
              href=""
              zdButton
              zdJoinItem
              [size]="size()"
              [active]="control.numbered && control.page === currentPage()"
              [routerLink]="control.disabled ? null : []"
              [queryParams]="queryValues(control.page, currentPageSize())"
              queryParamsHandling="merge"
              [preserveFragment]="true"
              [zdDisabled]="control.disabled"
              [attr.tabindex]="control.disabled ? -1 : null"
              role="link"
              [attr.aria-label]="control.label"
              [attr.aria-current]="
                control.numbered && control.page === currentPage() ? 'page' : null
              "
              (click)="requestPage(control.page, control.disabled, $event)"
            >
              <span [class.zd-arrow]="!control.numbered" aria-hidden="true">{{
                control.text
              }}</span>
            </a>
          } @else {
            <button
              type="button"
              zdButton
              zdJoinItem
              [size]="size()"
              [active]="control.numbered && control.page === currentPage()"
              [disabled]="control.disabled"
              [attr.aria-label]="control.label"
              [attr.aria-current]="
                control.numbered && control.page === currentPage() ? 'page' : null
              "
              (click)="requestPage(control.page, control.disabled, $event)"
            >
              <span [class.zd-arrow]="!control.numbered" aria-hidden="true">{{
                control.text
              }}</span>
            </button>
          }
        }
      </div>
      @if (sizes().length) {
        <label
          >{{ labels().pageSize }}
          <select [value]="currentPageSize()" [disabled]="blocked()" (change)="requestSize($event)">
            @for (option of sizes(); track option) {
              <option [value]="option" [attr.selected]="option === currentPageSize() ? '' : null">
                {{ option }}
              </option>
            }
          </select>
        </label>
      }
    </nav>
    <p role="status" aria-live="polite" aria-atomic="true">
      {{ loading() ? labels().loading : labels().status(currentPage(), pageCount(), total()) }}
    </p>
  `,
})
export class ZdPagination {
  readonly page = input(1);
  readonly pageSize = input(10);
  readonly total = input<number | null>(null);
  readonly hasNext = input(false, { transform: booleanAttribute });
  readonly siblings = input(1);
  readonly pageSizeOptions = input<readonly number[]>([]);
  readonly size = input<ZdSize>('md');
  readonly label = input('Pagination');
  readonly labels = input<ZdPaginationLabels>(labels);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  /** Null uses controlled buttons; query mode uses Router navigation as the state authority. */
  readonly query = input<ZdPaginationQuery | null>(null);
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();
  readonly stateChange = output<ZdPaginationChange>();
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly router = inject(Router, { optional: true });
  private readonly params = toSignal(this.route?.queryParamMap ?? of(convertToParamMap({})), {
    initialValue: convertToParamMap({}),
  });
  protected readonly routing = computed(() => {
    const query = this.query();
    if (query) {
      if (!this.router || !this.route)
        throw new Error('Pagination query mode requires Router and ActivatedRoute.');
      if (!query.page.trim() || !query.pageSize.trim() || query.page === query.pageSize)
        throw new RangeError('Pagination query parameter names must be nonempty and distinct.');
    }
    return query;
  });
  readonly currentPageSize = computed(() => {
    const fallback = paginationInteger(this.pageSize(), 1);
    const query = this.routing();
    return query ? this.queryInteger(query.pageSize, fallback) : fallback;
  });
  readonly pageCount = computed(() => {
    const total = this.total();
    const size = this.currentPageSize();
    return total === null ? null : Math.ceil(paginationInteger(total, 0) / size);
  });
  readonly currentPage = computed(() => {
    const fallback = paginationInteger(this.page(), 1);
    const query = this.routing();
    const page = query ? this.queryInteger(query.page, fallback) : fallback;
    const count = this.pageCount();
    return count === null ? page : Math.min(page, Math.max(1, count));
  });
  protected readonly blocked = computed(() => this.disabled() || this.loading());
  protected readonly sizes = computed(() => {
    const options = this.pageSizeOptions();
    for (const option of options) paginationInteger(option, 1);
    return options.length
      ? [...new Set([this.currentPageSize(), ...options])].sort((a, b) => a - b)
      : [];
  });
  protected readonly controls = computed(() => {
    const current = this.currentPage();
    const count = this.pageCount();
    const siblings = paginationInteger(this.siblings(), 0);
    if (siblings > 5) throw new RangeError('Pagination supports zero through five siblings.');
    const blocked = this.blocked();
    const names = this.labels();
    const controls = [
      {
        key: 'first',
        page: 1,
        label: names.first,
        text: '«',
        disabled: blocked || current === 1,
        numbered: false,
      },
      {
        key: 'previous',
        page: Math.max(1, current - 1),
        label: names.previous,
        text: '‹',
        disabled: blocked || current === 1,
        numbered: false,
      },
    ];
    for (const token of count === null ? [current] : zdPaginationRange(current, count, siblings)) {
      const number = typeof token === 'number';
      controls.push({
        key: `page-${token}`,
        page: number ? token : 0,
        label: number ? names.page(token) : '',
        text: String(token),
        disabled: blocked,
        numbered: true,
      });
    }
    const next =
      count === null ? this.hasNext() && current < Number.MAX_SAFE_INTEGER : current < count;
    controls.push({
      key: 'next',
      page: Math.min(Number.MAX_SAFE_INTEGER, current + 1),
      label: names.next,
      text: '›',
      disabled: blocked || !next,
      numbered: false,
    });
    if (count !== null)
      controls.push({
        key: 'last',
        page: Math.max(1, count),
        label: names.last,
        text: '»',
        disabled: blocked || current >= count,
        numbered: false,
      });
    return controls;
  });
  protected queryValues(page: number, pageSize: number): Record<string, number> {
    const query = this.routing()!;
    return { [query.page]: page, [query.pageSize]: pageSize };
  }
  protected requestPage(page: number, disabled: boolean, event: MouseEvent): void {
    if (
      disabled ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      page === this.currentPage()
    )
      return;
    this.pageChange.emit(page);
    this.stateChange.emit({ page, pageSize: this.currentPageSize() });
  }
  protected requestSize(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const pageSize = Number(select.value);
    select.value = String(this.currentPageSize());
    if (this.blocked() || pageSize === this.currentPageSize() || !this.sizes().includes(pageSize))
      return;
    this.pageSizeChange.emit(pageSize);
    this.pageChange.emit(1);
    this.stateChange.emit({ page: 1, pageSize });
    if (this.routing())
      void this.router!.navigate([], {
        relativeTo: this.route,
        queryParams: this.queryValues(1, pageSize),
        queryParamsHandling: 'merge',
        preserveFragment: true,
      });
  }
  private queryInteger(key: string, fallback: number): number {
    const value = Number(this.params().get(key));
    return Number.isSafeInteger(value) && value > 0 ? value : fallback;
  }
}
