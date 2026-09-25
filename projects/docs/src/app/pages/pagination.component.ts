import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { ZdPagination, type ZdPaginationChange, type ZdSize } from '@pranxy/zordon-ui/pagination';

import { flagOf } from '../content/form-controls.content';
import {
  pageSizeFiles,
  paginationPlaygroundControls,
  paginationPlaygroundSnippet,
  paginationReference,
  queryCode,
  unknownFiles,
} from '../content/pagination.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads daisyUI's join classes (buttons and sizes are global), only while this page is in use. */
@Component({
  selector: 'docs-pagination-daisy-styles',
  template: '',
  styleUrl: './styles/join.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class PaginationDaisyStylesComponent {}

@Component({
  selector: 'docs-pagination-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    PaginationDaisyStylesComponent,
    ZdPagination,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-pagination-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Pagination"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <zd-pagination
            label="Result pages"
            [page]="page()"
            [total]="420"
            [size]="sizeOf(values)"
            [siblings]="siblingsOf(values)"
            [loading]="flagOf(values, 'loading')"
            (pageChange)="page.set($event)"
          />
        </ng-template>
      </docs-playground>

      <docs-section
        id="page-size"
        level="3"
        heading="Page size"
        description="A size request resets to page one; stateChange carries both values so you fetch once."
      >
        <docs-example label="results" [files]="pageSizeFiles">
          <div class="docs-stack">
            <zd-pagination
              label="Order pages"
              [page]="paging().page"
              [pageSize]="paging().pageSize"
              [total]="1284"
              [pageSizeOptions]="[10, 25, 50]"
              (stateChange)="paging.set($event)"
            />
            <p class="docs-status">Showing orders {{ first() }}–{{ last() }} of 1,284</p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="unknown-total"
        level="3"
        heading="Unknown total"
        description="Without a total there is no last page to show. hasNext from your data source enables Next."
      >
        <docs-example label="feed" [files]="unknownFiles">
          <zd-pagination
            label="Feed pages"
            [page]="feedPage()"
            [hasNext]="feedPage() < 4"
            (pageChange)="feedPage.set($event)"
          />
        </docs-example>
      </docs-section>

      <docs-section
        id="query"
        level="3"
        heading="Query parameters"
        description="With query, each page is a real link: this page’s URL changes, Back and Forward work, and links open in new tabs."
      >
        <docs-example label="catalog.html" [code]="queryCode">
          <zd-pagination
            label="Catalog pages"
            size="sm"
            [total]="420"
            [query]="{ page: 'page', pageSize: 'limit' }"
            [pageSizeOptions]="[10, 25, 50]"
          />
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
})
export class PaginationPageComponent {
  protected readonly reference = paginationReference;
  protected readonly controls = paginationPlaygroundControls;
  protected readonly snippet = paginationPlaygroundSnippet;
  protected readonly pageSizeFiles = pageSizeFiles;
  protected readonly unknownFiles = unknownFiles;
  protected readonly queryCode = queryCode;
  protected readonly flagOf = flagOf;

  protected readonly page = signal(5);
  protected readonly paging = signal<ZdPaginationChange>({ page: 1, pageSize: 25 });
  protected readonly feedPage = signal(1);

  protected first(): number {
    const { page, pageSize } = this.paging();
    return (page - 1) * pageSize + 1;
  }

  protected last(): number {
    const { page, pageSize } = this.paging();
    return Math.min(page * pageSize, 1284);
  }

  protected sizeOf(values: PlaygroundValues): ZdSize {
    return values['size'] as ZdSize;
  }

  protected siblingsOf(values: PlaygroundValues): number {
    return Number(values['[siblings]']);
  }
}
