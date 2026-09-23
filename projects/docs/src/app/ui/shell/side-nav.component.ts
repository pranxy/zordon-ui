import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import type { DocsMaturity } from '../../site-catalog';
import { DocsMaturityDotComponent } from '../catalogue/maturity-dot.component';
import { DocsNavLinkDirective } from './nav-link.directive';

export interface DocsSideNavItem {
  readonly label: string;
  /** Omit for catalogue entries that have no reference page yet; they render as plain text. */
  readonly path?: string;
  readonly queryParams?: Readonly<Record<string, string>>;
  readonly maturity?: DocsMaturity;
  readonly count?: number;
}

export interface DocsSideNavGroup {
  readonly label: string;
  readonly items: readonly DocsSideNavItem[];
  /** Compact groups use smaller type (e.g. "Other groups" with counts). */
  readonly compact?: boolean;
}

/** Left-hand section navigation. Hidden below 48rem, where the mobile menu is used. */
@Component({
  selector: 'docs-side-nav',
  imports: [
    DocsMaturityDotComponent,
    DocsNavLinkDirective,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [attr.aria-label]="label()">
      @if (backLink(); as back) {
        <a class="back" [routerLink]="back.path">← {{ back.label }}</a>
      }
      @for (group of groups(); track group.label) {
        <div class="group" [class.compact]="group.compact">
          <p class="docs-eyebrow docs-eyebrow--strong">{{ group.label }}</p>
          @for (item of group.items; track item.label) {
            @if (item.path) {
              <a
                docsNavLink
                [routerLink]="item.path"
                [queryParams]="item.queryParams"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                ariaCurrentWhenActive="page"
              >
                <span>{{ item.label }}</span>
                <ng-container
                  [ngTemplateOutlet]="meta"
                  [ngTemplateOutletContext]="{ $implicit: item }"
                />
              </a>
            } @else {
              <span class="docs-nav-link docs-nav-link--side unlinked">
                <span>{{ item.label }}</span>
                <ng-container
                  [ngTemplateOutlet]="meta"
                  [ngTemplateOutletContext]="{ $implicit: item }"
                />
              </span>
            }
          }
        </div>
      }
      <ng-content />
    </nav>

    <ng-template #meta let-item>
      @if (item.maturity) {
        <docs-maturity-dot [maturity]="item.maturity" />
      } @else if (item.count !== undefined) {
        <span class="count">{{ item.count }}</span>
      }
    </ng-template>
  `,
  styles: `
    :host {
      position: sticky;
      inset-block-start: var(--docs-header-offset);
      display: block;
      max-block-size: calc(100vh - var(--docs-scroll-margin));
      overflow-y: auto;
    }

    nav,
    .group {
      display: grid;
      gap: 0.125rem;
    }

    nav {
      gap: 1.5rem;
    }

    .group > .docs-eyebrow {
      margin-block-end: 0.5rem;
    }

    .back {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
      font-weight: var(--docs-weight-semibold);
    }

    .back:hover {
      border-color: var(--docs-accent);
    }

    .unlinked:hover {
      background: transparent;
      color: var(--docs-muted-text);
    }

    .compact .docs-nav-link {
      justify-content: flex-start;
      padding-block: 0.3rem;
      font-size: var(--docs-text-sm);
      font-weight: var(--docs-weight-regular);
    }

    .count {
      color: var(--docs-muted-text);
      font-size: 0.6875rem;
    }

    @media (max-width: 48rem) {
      :host {
        display: none;
      }
    }
  `,
})
export class DocsSideNavComponent {
  readonly label = input('Documentation sections');
  readonly groups = input.required<readonly DocsSideNavGroup[]>();
  readonly backLink = input<{ readonly label: string; readonly path: string }>();
}
