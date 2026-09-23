import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DocsNavLinkDirective } from './nav-link.directive';
import type { DocsNavItem } from './primary-nav.component';

/** Compact disclosure menu shown below 48rem. Works without JavaScript (native details). */
@Component({
  selector: 'docs-mobile-nav',
  imports: [DocsNavLinkDirective, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <details #disclosure>
      <summary>Navigation menu</summary>
      <nav aria-label="Mobile navigation">
        @for (item of items(); track item.path) {
          <a
            docsNavLink="menu"
            [routerLink]="item.path"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
            ariaCurrentWhenActive="page"
            (click)="close()"
            >{{ item.label }}</a
          >
        }
      </nav>
    </details>
  `,
  styles: `
    :host {
      display: none;
    }

    details {
      position: relative;
    }

    summary {
      display: flex;
      align-items: center;
      min-block-size: 2.75rem;
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      cursor: pointer;
      font-weight: var(--docs-weight-semibold);
    }

    nav {
      position: absolute;
      inset-block-start: calc(100% + 0.5rem);
      inset-inline-end: 0;
      z-index: 20;
      display: grid;
      min-inline-size: 14rem;
      padding: 0.5rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface);
      box-shadow: var(--docs-shadow);
    }

    @media (max-width: 48rem) {
      :host {
        display: block;
      }
    }
  `,
})
export class DocsMobileNavComponent {
  readonly items = input.required<readonly DocsNavItem[]>();
  private readonly disclosure = viewChild.required<ElementRef<HTMLDetailsElement>>('disclosure');

  protected close(): void {
    this.disclosure().nativeElement.open = false;
  }
}
