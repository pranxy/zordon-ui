import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { ZdCollapse, ZdCollapseContent, ZdCollapseTitle } from '@pranxy/zordon-ui/collapse';

export interface DocsFaqItem {
  readonly question: string;
  readonly answer: string;
}

/** Loads daisyUI's collapse classes, shared with the Collapse and Accordion pages. */
@Component({
  selector: 'docs-faq-daisy-styles',
  template: '',
  styleUrl: '../../pages/styles/collapse.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class DocsFaqDaisyStylesComponent {}

/** Stack of native disclosures styled by Zordon's Collapse (works without JavaScript). */
@Component({
  selector: 'docs-faq',
  imports: [DocsFaqDaisyStylesComponent, ZdCollapse, ZdCollapseContent, ZdCollapseTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-faq-daisy-styles />
    @for (item of items(); track item.question) {
      <details zdCollapse indicator="plus">
        <summary zdCollapseTitle>{{ item.question }}</summary>
        <div zdCollapseContent>
          <p>{{ item.answer }}</p>
        </div>
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

    details {
      border-radius: 0;
    }

    details + details {
      border-block-start: 1px solid var(--docs-border);
    }

    summary {
      font-weight: var(--docs-weight-heading);
    }

    summary:hover {
      background: var(--docs-surface-raised);
    }

    p {
      margin: 0;
      color: var(--docs-muted-text);
      font-size: var(--docs-text-body);
      line-height: 1.6;
    }
  `,
})
export class DocsFaqComponent {
  readonly items = input.required<readonly DocsFaqItem[]>();
}
