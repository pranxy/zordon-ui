import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { CatalogueEntry } from '../../content/component-catalogue';
import { componentSummaries } from '../../content/component-summaries';
import { DocsComponentPreviewComponent } from './component-preview.component';
import { DocsMaturityBadgeComponent } from './maturity-badge.component';

/** Catalogue card: sketch, category, maturity, name, summary. The name link covers the card. */
@Component({
  selector: 'docs-component-card',
  imports: [DocsComponentPreviewComponent, DocsMaturityBadgeComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.linked]': '!!entry().path' },
  template: `
    <docs-component-preview [id]="entry().id" [name]="entry().name" />
    <div class="body">
      <div class="meta">
        <span class="docs-eyebrow">{{ entry().category }}</span>
        <docs-maturity-badge [maturity]="entry().maturity" />
      </div>
      <h4>
        @if (entry().path; as path) {
          <a [routerLink]="path">{{ entry().name }}</a>
        } @else {
          {{ entry().name }}
        }
      </h4>
      <p>{{ summaries[entry().id] }}</p>
    </div>
  `,
  styles: `
    :host {
      position: relative;
      display: grid;
      grid-template-rows: auto 1fr;
      overflow: hidden;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface);
      transition: border-color var(--docs-duration) var(--docs-ease);
    }

    :host(.linked:hover),
    :host(.linked:focus-within) {
      border-color: var(--docs-accent);
    }

    .body {
      display: grid;
      align-content: start;
      gap: 0.4rem;
      padding: 0.875rem 1rem 1rem;
    }

    .meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    h4 {
      margin: 0;
      font-size: var(--docs-text-h4);
      font-weight: var(--docs-weight-heading);
    }

    a::after {
      content: '';
      position: absolute;
      inset: 0;
    }

    a:focus-visible {
      outline: none;
    }

    :host(.linked:has(a:focus-visible)) {
      outline: 3px solid var(--docs-accent);
      outline-offset: 3px;
    }

    p {
      margin: 0;
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
      line-height: 1.5;
    }
  `,
})
export class DocsComponentCardComponent {
  readonly entry = input.required<CatalogueEntry>();
  protected readonly summaries = componentSummaries;
}
