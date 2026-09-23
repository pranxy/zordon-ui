import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface DocsFeature {
  readonly title: string;
  readonly body: string;
}

/** Joined, bordered grid of short statements (principles, accessibility guarantees). */
@Component({
  selector: 'docs-feature-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul [style.--columns]="columns()">
      @for (item of items(); track item.title; let index = $index) {
        <li>
          @if (numbered()) {
            <span class="index" aria-hidden="true">{{
              (index + 1).toString().padStart(2, '0')
            }}</span>
          }
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </li>
      }
    </ul>
  `,
  styles: `
    ul {
      display: grid;
      grid-template-columns: repeat(var(--columns, 2), minmax(0, 1fr));
      gap: 1px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-border);
      list-style: none;
    }

    li {
      display: grid;
      align-content: start;
      gap: 0.4rem;
      padding: 1.125rem 1.25rem;
      background: var(--docs-surface);
    }

    .index {
      color: var(--docs-accent-strong);
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
    }

    h3 {
      margin: 0;
      font-size: var(--docs-text-h4);
      font-weight: var(--docs-weight-heading);
    }

    p {
      margin: 0;
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
      line-height: 1.55;
    }

    @media (max-width: 48rem) {
      ul {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `,
})
export class DocsFeatureGridComponent {
  readonly items = input.required<readonly DocsFeature[]>();
  readonly columns = input(2);
  /** Prefix each item with 01, 02, … */
  readonly numbered = input(false);
}
