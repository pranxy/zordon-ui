import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { DocsMaturity } from '../../site-catalog';

/**
 * Maturity pill. Colours come from the --docs-maturity-* tokens, which are derived from the
 * active daisyUI theme; only Stable is filled, and Experimental alone uses a dashed border.
 */
@Component({
  selector: 'docs-maturity-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-maturity]': 'maturity()' },
  template: `{{ maturity() }}`,
  styles: `
    :host {
      --bg: var(--docs-maturity-planned-bg);
      --bd: var(--docs-maturity-planned-border);
      --fg: var(--docs-maturity-planned-fg);
      --style: var(--docs-maturity-planned-style);
      display: inline-flex;
      align-items: center;
      padding: 0.15rem 0.45rem;
      border: 1px var(--style) var(--bd);
      border-radius: var(--docs-radius-pill);
      background: var(--bg);
      color: var(--fg);
      font-size: var(--docs-text-badge);
      font-weight: var(--docs-weight-bold);
      letter-spacing: 0.04em;
      line-height: 1.2;
      white-space: nowrap;
    }

    :host([data-maturity='experimental']) {
      --bg: var(--docs-maturity-experimental-bg);
      --bd: var(--docs-maturity-experimental-border);
      --fg: var(--docs-maturity-experimental-fg);
      --style: var(--docs-maturity-experimental-style);
    }

    :host([data-maturity='preview']) {
      --bg: var(--docs-maturity-preview-bg);
      --bd: var(--docs-maturity-preview-border);
      --fg: var(--docs-maturity-preview-fg);
      --style: var(--docs-maturity-preview-style);
    }

    :host([data-maturity='stable']) {
      --bg: var(--docs-maturity-stable-bg);
      --bd: var(--docs-maturity-stable-border);
      --fg: var(--docs-maturity-stable-fg);
      --style: var(--docs-maturity-stable-style);
    }
  `,
})
export class DocsMaturityBadgeComponent {
  readonly maturity = input.required<DocsMaturity>();
}
