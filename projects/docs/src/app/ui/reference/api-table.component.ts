import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ZdKbd } from '@pranxy/zordon-ui/kbd';

import { DocsInlineCodeComponent } from '../page/inline-code.component';

export interface DocsTableColumn {
  readonly key: string;
  readonly label: string;
  /**
   * - `name`: accent monospace (first column, rendered as the row header)
   * - `code`: monospace
   * - `kbd`: keyboard key
   * - `text` (default): prose with `backtick` inline code
   */
  readonly kind?: 'name' | 'code' | 'kbd' | 'text';
}

export type DocsTableRow = Readonly<Record<string, string>> & {
  /** Optional small note under the first cell, e.g. "<a> only". */
  readonly note?: string;
};

/**
 * Reference table (inputs, CSS variables, keyboard). The first column is the row header.
 * Scrolls horizontally inside its own frame on narrow screens.
 */
@Component({
  selector: 'docs-api-table',
  imports: [DocsInlineCodeComponent, NgTemplateOutlet, ZdKbd],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="frame" tabindex="0" role="region" [attr.aria-label]="caption()">
      <table>
        <caption class="docs-visually-hidden">
          {{
            caption()
          }}
        </caption>
        <thead>
          <tr>
            @for (column of columns(); track column.key) {
              <th scope="col">{{ column.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track $index) {
            <tr>
              @for (column of columns(); track column.key; let first = $first) {
                @if (first) {
                  <th scope="row" [class]="'cell-' + (column.kind ?? 'text')">
                    <ng-container
                      [ngTemplateOutlet]="cell"
                      [ngTemplateOutletContext]="{ column, value: row[column.key] }"
                    />
                    @if (row.note) {
                      <small><docs-inline-code [text]="row.note" /></small>
                    }
                  </th>
                } @else {
                  <td [class]="'cell-' + (column.kind ?? 'text')">
                    <ng-container
                      [ngTemplateOutlet]="cell"
                      [ngTemplateOutletContext]="{ column, value: row[column.key] }"
                    />
                  </td>
                }
              }
            </tr>
          }
        </tbody>
      </table>
    </div>

    <ng-template #cell let-column="column" let-value="value">
      @switch (column.kind) {
        @case ('kbd') {
          <kbd zdKbd size="sm">{{ value }}</kbd>
        }
        @case ('text') {
          <docs-inline-code [text]="value ?? ''" />
        }
        @case (undefined) {
          <docs-inline-code [text]="value ?? ''" />
        }
        @default {
          <code>{{ value }}</code>
        }
      }
    </ng-template>
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }

    .frame {
      max-inline-size: 100%;
      overflow-x: auto;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
    }

    table {
      inline-size: 100%;
      border-collapse: collapse;
      font-size: var(--docs-text-sm);
    }

    thead th {
      padding: 0.75rem 1rem;
      border-block-end: 1px solid var(--docs-border);
      background: var(--docs-surface-raised);
      color: var(--docs-muted-text);
      font-size: var(--docs-text-eyebrow);
      font-weight: var(--docs-weight-black);
      letter-spacing: 0.1em;
      text-align: start;
      text-transform: uppercase;
    }

    tbody th,
    td {
      padding: 0.75rem 1rem;
      border-block-end: 1px solid var(--docs-border);
      color: var(--docs-muted-text);
      font-weight: var(--docs-weight-regular);
      text-align: start;
      vertical-align: top;
    }

    tbody tr:last-child > * {
      border-block-end: 0;
    }

    code {
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
      color: var(--docs-text);
    }

    tbody .cell-name,
    tbody .cell-name code {
      color: var(--docs-accent-strong);
    }

    small {
      display: block;
      margin-block-start: 0.2rem;
      color: var(--docs-muted-text);
      font-size: 0.6875rem;
    }

    kbd {
      font-family: var(--docs-font-mono);
    }
  `,
})
export class DocsApiTableComponent {
  readonly caption = input.required<string>();
  readonly columns = input.required<readonly DocsTableColumn[]>();
  readonly rows = input.required<readonly DocsTableRow[]>();
}
