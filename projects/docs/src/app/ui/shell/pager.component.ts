import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface DocsPagerLink {
  readonly label: string;
  readonly path: string;
}

/** Previous/next page cards at the end of an article. */
@Component({
  selector: 'docs-pager',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Page navigation">
      @if (previous(); as link) {
        <a class="previous" [routerLink]="link.path">
          <span>← Previous</span>
          {{ link.label }}
        </a>
      }
      @if (next(); as link) {
        <a class="next" [routerLink]="link.path">
          <span>Next →</span>
          {{ link.label }}
        </a>
      }
    </nav>
  `,
  styles: `
    nav {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      margin-block-start: 3rem;
      padding-block-start: 1.5rem;
      border-block-start: 1px solid var(--docs-border);
    }

    a {
      display: grid;
      gap: 0.25rem;
      padding: 0.875rem 1rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      color: var(--docs-text);
      font-weight: var(--docs-weight-heading);
      transition: border-color var(--docs-duration) var(--docs-ease);
    }

    a:hover {
      border-color: var(--docs-accent);
    }

    span {
      color: var(--docs-muted-text);
      font-size: 0.75rem;
      font-weight: var(--docs-weight-regular);
    }

    .next {
      grid-column: 2;
      text-align: end;
    }

    @media (max-width: 48rem) {
      nav {
        grid-template-columns: minmax(0, 1fr);
      }

      .next {
        grid-column: 1;
      }
    }
  `,
})
export class DocsPagerComponent {
  readonly previous = input<DocsPagerLink>();
  readonly next = input<DocsPagerLink>();
}
