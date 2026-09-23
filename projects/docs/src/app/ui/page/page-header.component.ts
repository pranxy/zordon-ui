import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { DocsMaturity } from '../../site-catalog';
import { DocsMaturityBadgeComponent } from '../catalogue/maturity-badge.component';

/** Eyebrow + optional maturity + the page's only h1 + lead. Project a meta grid after it. */
@Component({
  selector: 'docs-page-header',
  imports: [DocsMaturityBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <div class="kicker">
        <p class="docs-eyebrow docs-eyebrow--accent">{{ eyebrow() }}</p>
        @if (maturity(); as status) {
          <docs-maturity-badge [maturity]="status" />
        }
      </div>
      <h1 id="page-title">{{ heading() }}</h1>
      <p class="lead">
        {{ description() }}
        <ng-content select="[docsPageHeaderLead]" />
      </p>
      <ng-content />
    </header>
  `,
  styles: `
    header {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1rem;
    }

    .kicker {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.625rem;
    }

    .docs-eyebrow {
      font-size: 0.8125rem;
    }

    h1 {
      margin: 0;
      font-size: var(--docs-text-h1);
      font-weight: var(--docs-weight-black);
      line-height: 1;
      letter-spacing: -0.035em;
    }

    .lead {
      margin: 0;
      max-inline-size: var(--docs-measure);
      color: var(--docs-muted-text);
      font-size: var(--docs-text-lead);
      line-height: 1.6;
    }
  `,
})
export class DocsPageHeaderComponent {
  readonly eyebrow = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly maturity = input<DocsMaturity>();
}
