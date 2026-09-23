import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { DocsMaturity } from '../../site-catalog';
import { DocsMaturityBadgeComponent } from './maturity-badge.component';

const LEGEND: readonly { readonly maturity: DocsMaturity; readonly meaning: string }[] = [
  { maturity: 'planned', meaning: 'No usable API yet' },
  { maturity: 'preview', meaning: 'Usable; API may change' },
  { maturity: 'stable', meaning: 'Compatibility committed' },
];

/**
 * Explains the maturity labels, following docs/contributing/component-maturity.md.
 * "Experimental" is reserved for optional integrations, so it is not listed for components.
 */
@Component({
  selector: 'docs-maturity-legend',
  imports: [DocsMaturityBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="docs-eyebrow docs-eyebrow--strong">Maturity</p>
    <dl>
      @for (entry of legend; track entry.maturity) {
        <div>
          <dt><docs-maturity-badge [maturity]="entry.maturity" /></dt>
          <dd>{{ entry.meaning }}</dd>
        </div>
      }
    </dl>
  `,
  styles: `
    :host {
      display: grid;
      gap: 0.5rem;
    }

    dl {
      display: grid;
      gap: 0.4rem;
      margin: 0;
    }

    div {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    dd {
      margin: 0;
      color: var(--docs-muted-text);
      font-size: 0.75rem;
    }
  `,
})
export class DocsMaturityLegendComponent {
  protected readonly legend = LEGEND;
}
