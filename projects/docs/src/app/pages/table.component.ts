import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdTable } from '@pranxy/zordon-ui/table';

import { flagOf, sizeOf } from '../content/form-controls.content';
import {
  rowHeadersCode,
  tablePlaygroundControls,
  tablePlaygroundSnippet,
  tableReference,
} from '../content/table.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Table emits, only while this page is in use. */
@Component({
  selector: 'docs-table-daisy-styles',
  template: '',
  styleUrl: './styles/table.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class TableDaisyStylesComponent {}

@Component({
  selector: 'docs-table-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    TableDaisyStylesComponent,
    ZdTable,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-table-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Table"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="scroller" tabindex="0" role="region" aria-label="Deployments, scrollable">
            <table
              zdTable
              [size]="sizeOf(values)"
              [zebra]="flagOf(values, 'zebra')"
              [pinRows]="flagOf(values, 'pinRows')"
              [pinCols]="flagOf(values, 'pinCols')"
            >
              <caption>
                Monthly deployments
              </caption>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  @for (month of months; track month) {
                    <th scope="col">{{ month }}</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of deployments; track row.service) {
                  <tr>
                    <th scope="row">{{ row.service }}</th>
                    @for (count of row.counts; track $index) {
                      <td>{{ count }}</td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="row-headers"
        level="3"
        heading="Row headers"
        description="Headers in both directions: each value is announced with its plan and its limit."
      >
        <docs-example label="plans.html" [code]="rowHeadersCode">
          <table zdTable class="plans">
            <caption>
              Plan limits
            </caption>
            <thead>
              <tr>
                <td></td>
                <th scope="col">Free</th>
                <th scope="col">Team</th>
              </tr>
            </thead>
            <tbody>
              @for (limit of limits; track limit.name) {
                <tr>
                  <th scope="row">{{ limit.name }}</th>
                  <td>{{ limit.free }}</td>
                  <td>{{ limit.team }}</td>
                </tr>
              }
            </tbody>
          </table>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .scroller {
      inline-size: 100%;
      max-block-size: 14rem;
      overflow: auto;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
    }

    .scroller:focus-visible {
      outline: 2px solid var(--docs-accent);
      outline-offset: 2px;
    }

    caption {
      padding-block: var(--docs-space-2);
      font-weight: var(--docs-weight-semibold);
      text-align: start;
      padding-inline: var(--docs-space-4);
    }

    td {
      font-variant-numeric: tabular-nums;
    }

    .plans {
      inline-size: min(28rem, 100%);
    }
  `,
})
export class TablePageComponent {
  protected readonly reference = tableReference;
  protected readonly controls = tablePlaygroundControls;
  protected readonly snippet = tablePlaygroundSnippet;
  protected readonly rowHeadersCode = rowHeadersCode;
  protected readonly flagOf = flagOf;
  protected readonly sizeOf = sizeOf;

  protected readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] as const;

  protected readonly deployments = [
    { service: 'API', counts: [12, 9, 14, 11, 16, 13, 10, 15] },
    { service: 'Web', counts: [20, 18, 22, 19, 25, 21, 17, 23] },
    { service: 'Search', counts: [4, 6, 5, 3, 7, 5, 6, 4] },
    { service: 'Email', counts: [2, 1, 3, 2, 2, 4, 1, 2] },
    { service: 'Billing', counts: [5, 7, 6, 8, 5, 6, 9, 7] },
    { service: 'Auth', counts: [3, 4, 2, 5, 3, 4, 3, 5] },
  ] as const;

  protected readonly limits = [
    { name: 'Projects', free: '3', team: 'Unlimited' },
    { name: 'Members', free: '1', team: '25' },
    { name: 'Storage', free: '1 GB', team: '100 GB' },
  ] as const;
}
