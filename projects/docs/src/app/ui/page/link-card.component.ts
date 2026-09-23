import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface DocsLinkCard {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly path: string;
}

/** Grid of whole-card links ("Next steps"). */
@Component({
  selector: 'docs-link-cards',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (card of cards(); track card.path + card.title) {
        <li>
          <a [routerLink]="card.path">
            <span class="eyebrow">{{ card.eyebrow }}</span>
            <strong>{{ card.title }}</strong>
            <span class="description">{{ card.description }}</span>
          </a>
        </li>
      }
    </ul>
  `,
  styles: `
    ul {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
      gap: 0.75rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    a {
      display: grid;
      gap: 0.3rem;
      block-size: 100%;
      padding: 1rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      transition: border-color var(--docs-duration) var(--docs-ease);
    }

    a:hover {
      border-color: var(--docs-accent);
      color: inherit;
    }

    .eyebrow {
      color: var(--docs-accent-strong);
      font-family: var(--docs-font-mono);
      font-size: 0.6875rem;
    }

    strong {
      font-size: var(--docs-text-h4);
      font-weight: var(--docs-weight-heading);
    }

    .description {
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
      line-height: 1.5;
    }
  `,
})
export class DocsLinkCardsComponent {
  readonly cards = input.required<readonly DocsLinkCard[]>();
}
