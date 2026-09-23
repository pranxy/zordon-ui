import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Highlighted aside.
 * - `accent`: tinted panel (e.g. a fast path)
 * - `note`: accent bar on the inline-start edge (policy notes)
 * - `empty`: dashed outline for "nothing here" statements
 * - `result`: raised panel labelled "Result" that holds a live outcome
 */
@Component({
  selector: 'docs-callout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'variant()' },
  template: `
    @if (label()) {
      <p class="docs-eyebrow">{{ label() }}</p>
    }
    @if (heading()) {
      <h3>{{ heading() }}</h3>
    }
    <div class="body"><ng-content /></div>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.5rem;
      padding: 1rem 1.125rem;
      border-radius: var(--docs-radius-lg);
      font-size: var(--docs-text-body);
      line-height: 1.6;
    }

    h3 {
      margin: 0;
      font-size: var(--docs-text-h3);
      font-weight: var(--docs-weight-heading);
    }

    .body {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.75rem;
      min-inline-size: 0;
    }

    :host(.accent) {
      border: 1px solid color-mix(in srgb, var(--docs-accent) 35%, var(--docs-border));
      background: var(--docs-subtle);
    }

    :host(.note) {
      border-inline-start: 0.25rem solid var(--docs-accent);
      border-radius: 0;
      background: var(--docs-subtle);
    }

    :host(.empty) {
      max-inline-size: 34rem;
      border: 1px dashed var(--docs-border-strong);
      color: var(--docs-muted-text);
    }

    :host(.result) {
      border: 1px solid var(--docs-border);
      background: var(--docs-surface-raised);
    }

    :host(.result) .body {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
    }
  `,
})
export class DocsCalloutComponent {
  readonly variant = input<'accent' | 'note' | 'empty' | 'result'>('note');
  readonly heading = input<string>();
  readonly label = input<string>();
}
