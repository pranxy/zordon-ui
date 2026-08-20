import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { DocsMaturity } from '../../site-catalog';

@Component({
  selector: 'docs-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="docs-page-header">
      <div class="docs-page-kicker">
        <span>{{ eyebrow() }}</span>
        @if (maturity(); as status) {
          <span class="docs-maturity" [attr.data-maturity]="status">{{ status }}</span>
        }
      </div>
      <h1 id="page-title">{{ heading() }}</h1>
      <p>{{ description() }}</p>
      @if (sourceUrl(); as url) {
        <a [href]="url">View source</a>
      }
    </header>
  `,
})
export class DocsPageHeaderComponent {
  readonly eyebrow = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly maturity = input<DocsMaturity>();
  readonly sourceUrl = input<string>();
}
