import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { type ZdSize } from '@pranxy/zordon-ui';
import { ZdPagination, type ZdPaginationChange } from '@pranxy/zordon-ui/pagination';

@Component({
  selector: 'docs-pagination-test-fixture',
  imports: [ZdPagination],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./pagination-daisy-fixture.css', './pagination-fixture.css'],
  template: `<main data-testid="pagination-fixture" [dir]="rtl() ? 'rtl' : 'ltr'">
    <h1>Pagination</h1>
    <p>Native page controls with bounded ranges and optional URL synchronization.</p>
    <div class="controls">
      <button type="button" (click)="accept.set(!accept())">Toggle acceptance</button>
      <button type="button" (click)="loading.set(!loading())">Toggle loading</button>
      <button type="button" (click)="disabled.set(!disabled())">Toggle disabled</button>
      <button type="button" (click)="empty.set(!empty())">Toggle empty results</button>
      <button type="button" (click)="hasNext.set(!hasNext())">Toggle more results</button>
      <button type="button" (click)="rtl.set(!rtl())">Toggle direction</button>
      <label
        >Control size<select (change)="setSize($event)">
          <option>xs</option>
          <option>sm</option>
          <option selected>md</option>
          <option>lg</option>
          <option>xl</option>
        </select></label
      >
    </div>
    <section>
      <h2>Controlled results</h2>
      <zd-pagination
        label="Result pages"
        [page]="page()"
        [pageSize]="pageSize()"
        [total]="empty() ? 0 : 200"
        [pageSizeOptions]="[10, 25, 50]"
        [loading]="loading()"
        [disabled]="disabled()"
        [size]="size()"
        (stateChange)="request($event)"
      />
      <output aria-label="Requested paging">{{ requested() }}</output>
    </section>
    <section>
      <h2>URL destinations</h2>
      <zd-pagination
        label="URL pages"
        [total]="420"
        [query]="{ page: 'page', pageSize: 'limit' }"
        [pageSizeOptions]="[10, 25, 50]"
        [loading]="loading()"
        [disabled]="disabled()"
        [size]="size()"
      />
    </section>
    <section>
      <h2>Unknown total</h2>
      <zd-pagination
        label="Stream pages"
        [page]="streamPage()"
        [hasNext]="hasNext()"
        [size]="size()"
        (pageChange)="streamPage.set($event)"
      />
    </section>
  </main>`,
})
export class PaginationTestFixtureComponent {
  readonly page = signal(5);
  readonly pageSize = signal(10);
  readonly streamPage = signal(3);
  readonly hasNext = signal(false);
  readonly loading = signal(false);
  readonly disabled = signal(false);
  readonly empty = signal(false);
  readonly accept = signal(true);
  readonly rtl = signal(false);
  readonly size = signal<ZdSize>('md');
  readonly requested = signal('None');
  request(value: ZdPaginationChange): void {
    this.requested.set(`${value.page}:${value.pageSize}`);
    if (this.accept()) {
      this.page.set(value.page);
      this.pageSize.set(value.pageSize);
    }
  }
  setSize(event: Event): void {
    this.size.set((event.target as HTMLSelectElement).value as ZdSize);
  }
}
