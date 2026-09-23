import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface DocsMetaItem {
  readonly label: string;
  readonly value: string;
  /** Small trailing qualifier, e.g. "planned" after "68". */
  readonly suffix?: string;
  readonly href?: string;
  /** Render the value in the monospace face (selectors, versions, file names). */
  readonly mono?: boolean;
}

/**
 * A strip of labelled facts. `facts` = compact (requirements, selector, source);
 * `stats` = large numbers (catalogue hero). Wraps to two columns below 48rem.
 */
@Component({
  selector: 'docs-meta-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'variant()' },
  template: `
    <dl>
      @for (item of items(); track item.label) {
        <div>
          <dt class="docs-eyebrow">{{ item.label }}</dt>
          <dd [class.mono]="item.mono">
            @if (item.href) {
              <a [href]="item.href">{{ item.value }}</a>
            } @else {
              {{ item.value }}
            }
            @if (item.suffix) {
              <small>{{ item.suffix }}</small>
            }
          </dd>
        </div>
      }
    </dl>
  `,
  styles: `
    dl {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 7.5rem), 1fr));
      gap: 1px;
      margin: 0;
      overflow: hidden;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      background: var(--docs-border);
    }

    div {
      display: grid;
      align-content: start;
      gap: 0.3rem;
      padding: 0.875rem 1rem;
      background: var(--docs-surface-raised);
    }

    dd {
      margin: 0;
      font-size: var(--docs-text-sm);
    }

    .mono {
      font-family: var(--docs-font-mono);
      font-size: var(--docs-text-xs);
    }

    a {
      color: var(--docs-accent-strong);
      font-weight: var(--docs-weight-bold);
      text-decoration: underline;
    }

    small {
      margin-inline-start: 0.25rem;
      font-size: 0.75rem;
      font-weight: var(--docs-weight-semibold);
    }

    :host(.stats) dd {
      font-size: 1.5rem;
      font-weight: var(--docs-weight-black);
      letter-spacing: -0.02em;
    }

    @media (max-width: 48rem) {
      dl {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `,
})
export class DocsMetaGridComponent {
  readonly items = input.required<readonly DocsMetaItem[]>();
  readonly variant = input<'facts' | 'stats'>('facts');
}
