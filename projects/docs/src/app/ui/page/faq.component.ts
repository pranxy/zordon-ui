import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface DocsFaqItem {
  readonly question: string;
  readonly answer: string;
}

/** Stack of native disclosures (works without JavaScript). */
@Component({
  selector: 'docs-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items(); track item.question) {
      <details>
        <summary>
          {{ item.question }}
          <span class="icon" aria-hidden="true"></span>
        </summary>
        <p>{{ item.answer }}</p>
      </details>
    }
  `,
  styles: `
    :host {
      display: block;
      overflow: hidden;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
    }

    details + details {
      border-block-start: 1px solid var(--docs-border);
    }

    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.875rem 1rem;
      cursor: pointer;
      font-weight: var(--docs-weight-heading);
    }

    summary:hover {
      background: var(--docs-surface-raised);
    }

    .icon::before {
      content: '+';
      font-family: var(--docs-font-mono);
    }

    details[open] .icon::before {
      content: '−';
    }

    p {
      margin: 0;
      padding: 0 1rem 1rem;
      color: var(--docs-muted-text);
      font-size: var(--docs-text-body);
      line-height: 1.6;
    }
  `,
})
export class DocsFaqComponent {
  readonly items = input.required<readonly DocsFaqItem[]>();
}
