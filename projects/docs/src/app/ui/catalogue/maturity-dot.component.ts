import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { DocsMaturity } from '../../site-catalog';

/** Small maturity indicator for dense lists; the label is exposed to assistive technology. */
@Component({
  selector: 'docs-maturity-dot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-maturity]': 'maturity()' },
  template: `<span class="docs-visually-hidden">({{ maturity() }})</span>`,
  styles: `
    :host {
      flex: none;
      display: inline-block;
      inline-size: 0.4rem;
      block-size: 0.4rem;
      border: 1px solid var(--docs-maturity-planned-border);
      border-radius: 50%;
    }

    :host([data-maturity='experimental']) {
      border-color: var(--docs-maturity-experimental-border);
      background: var(--docs-maturity-experimental-border);
    }

    :host([data-maturity='preview']) {
      border-color: var(--docs-maturity-preview-border);
      background: var(--docs-maturity-preview-border);
    }

    :host([data-maturity='stable']) {
      border-color: var(--docs-maturity-stable-border);
      background: var(--docs-maturity-stable-border);
    }
  `,
})
export class DocsMaturityDotComponent {
  readonly maturity = input.required<DocsMaturity>();
}
