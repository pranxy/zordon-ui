import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DocsNavLinkDirective } from './nav-link.directive';

export interface DocsNavItem {
  readonly label: string;
  readonly path: string;
  /** Match the path exactly (used for Home). */
  readonly exact?: boolean;
}

/** Desktop header navigation. Hidden below 48rem, where docs-mobile-nav takes over. */
@Component({
  selector: 'docs-primary-nav',
  imports: [DocsNavLinkDirective, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Primary navigation">
      @for (item of items(); track item.path) {
        <a
          docsNavLink="primary"
          [routerLink]="item.path"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
          ariaCurrentWhenActive="page"
          >{{ item.label }}</a
        >
      }
    </nav>
  `,
  styles: `
    nav {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    @media (max-width: 48rem) {
      :host {
        display: none;
      }
    }
  `,
})
export class DocsPrimaryNavComponent {
  readonly items = input.required<readonly DocsNavItem[]>();
}
