import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Page grid: sidebar · main · table of contents. Collapses to two columns below 64rem and one
 * column below 48rem. Project content with the `docsLayoutSidebar` / `docsLayoutToc` attributes.
 */
@Component({
  selector: 'docs-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.has-sidebar]': 'hasSidebar()',
    '[class.has-toc]': 'hasToc()',
  },
  template: `
    <ng-content select="[docsLayoutSidebar]" />
    <ng-content />
    <ng-content select="[docsLayoutToc]" />
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: clamp(2rem, 4vw, 4rem);
      align-items: start;
      inline-size: min(100%, var(--docs-container));
      margin-inline: auto;
      padding-block: clamp(2rem, 5vw, 3.5rem);
    }

    :host(.has-sidebar) {
      grid-template-columns: var(--docs-sidebar) minmax(0, 1fr);
    }

    :host(.has-toc) {
      grid-template-columns: minmax(0, 1fr) var(--docs-toc);
    }

    :host(.has-sidebar.has-toc) {
      grid-template-columns: var(--docs-sidebar) minmax(0, 1fr) var(--docs-toc);
    }

    @media (max-width: 64rem) {
      :host(.has-toc) {
        grid-template-columns: minmax(0, 1fr);
      }

      :host(.has-sidebar),
      :host(.has-sidebar.has-toc) {
        grid-template-columns: minmax(10rem, 13rem) minmax(0, 1fr);
      }
    }

    @media (max-width: 48rem) {
      :host,
      :host(.has-sidebar),
      :host(.has-sidebar.has-toc) {
        grid-template-columns: minmax(0, 1fr);
        padding-block-start: 1.5rem;
      }
    }
  `,
})
export class DocsLayoutComponent {
  readonly hasSidebar = input(false);
  readonly hasToc = input(false);
}
