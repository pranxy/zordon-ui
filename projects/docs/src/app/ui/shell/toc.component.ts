import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface DocsTocItem {
  readonly id: string;
  readonly label: string;
  /** 2 = nested under the previous level-1 item. */
  readonly level?: 1 | 2;
}

/**
 * "On this page" navigation. `rail` is the sticky right column (hidden below 64rem);
 * `disclosure` is the inline collapsible version shown at narrower widths.
 */
@Component({
  selector: 'docs-toc',
  imports: [NgTemplateOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'variant()' },
  template: `
    @if (variant() === 'rail') {
      <nav aria-label="On this page">
        <p class="docs-eyebrow docs-eyebrow--strong">On this page</p>
        <ng-container *ngTemplateOutlet="links" />
        @if (editUrl(); as url) {
          <a class="edit" [href]="url">Edit this page ↗</a>
        }
      </nav>
    } @else {
      <details>
        <summary>On this page</summary>
        <nav aria-label="On this page">
          <ng-container *ngTemplateOutlet="links" />
        </nav>
      </details>
    }

    <ng-template #links>
      @for (item of items(); track item.id) {
        <a [class.nested]="item.level === 2" [routerLink]="pagePath()" [fragment]="item.id">{{
          item.label
        }}</a>
      }
    </ng-template>
  `,
  styles: `
    :host(.rail) {
      position: sticky;
      inset-block-start: var(--docs-header-offset);
      display: block;
      padding-inline-start: 1rem;
      border-inline-start: 1px solid var(--docs-border);
    }

    nav {
      display: grid;
      gap: 0.125rem;
    }

    .docs-eyebrow {
      margin-block-end: 0.5rem;
    }

    a {
      padding-block: 0.25rem;
      color: var(--docs-muted-text);
      font-size: var(--docs-text-xs);
      line-height: 1.4;
    }

    a.nested {
      padding-inline-start: 0.75rem;
    }

    .edit {
      margin-block-start: 1.25rem;
      color: var(--docs-accent-strong);
      font-weight: var(--docs-weight-bold);
    }

    :host(.disclosure) {
      display: none;
      margin-block-end: 1.5rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface-raised);
    }

    summary {
      padding: 0.875rem 1rem;
      cursor: pointer;
      font-weight: var(--docs-weight-heading);
    }

    details nav {
      padding: 0 1rem 1rem;
    }

    @media (max-width: 64rem) {
      :host(.rail) {
        display: none;
      }

      :host(.disclosure) {
        display: block;
      }
    }
  `,
})
export class DocsTocComponent {
  readonly items = input.required<readonly DocsTocItem[]>();
  /** Current page path; fragments are resolved against it. */
  readonly pagePath = input.required<string>();
  readonly editUrl = input<string>();
  readonly variant = input<'rail' | 'disclosure'>('rail');
}
