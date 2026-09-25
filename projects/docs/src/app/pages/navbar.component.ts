import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdLink } from '@pranxy/zordon-ui/link';
import { ZdNavbar, ZdNavbarContent, ZdNavbarToggle } from '@pranxy/zordon-ui/navbar';

import { flagOf } from '../content/form-controls.content';
import {
  navbarPlaygroundControls,
  navbarPlaygroundSnippet,
  navbarReference,
  responsiveFiles,
  toggleCode,
} from '../content/navbar.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Navbar emits, plus Link's for the example links. */
@Component({
  selector: 'docs-navbar-daisy-styles',
  template: '',
  styleUrls: ['./styles/navbar.daisy.css', './styles/link.daisy.css'],
  encapsulation: ViewEncapsulation.None,
})
class NavbarDaisyStylesComponent {}

@Component({
  selector: 'docs-navbar-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    NavbarDaisyStylesComponent,
    RouterLink,
    ZdButton,
    ZdLink,
    ZdNavbar,
    ZdNavbarContent,
    ZdNavbarToggle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-navbar-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Navbar"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="frame">
            <zd-navbar label="Example site" [transparent]="flagOf(values, 'transparent')">
              <a zdNavbarStart class="brand" routerLink="/">Acme</a>
              <a zdLink routerLink="/components">Pricing</a>
              <a zdLink routerLink="/docs/getting-started">Docs</a>
              <a zdNavbarEnd zdButton size="sm" routerLink="/resources">Sign in</a>
            </zd-navbar>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="responsive"
        level="3"
        heading="Responsive content"
        description="Desktop links sit in the center from 48rem; below that a Menu toggle opens your own panel. Narrow the window to switch."
      >
        <docs-example label="site-nav" [files]="responsiveFiles">
          <div class="frame">
            <zd-navbar label="Responsive example">
              <zd-navbar-content zdNavbarStart>
                <a class="brand" routerLink="/">Acme</a>
                <zd-navbar-content visibility="mobile">
                  <button
                    zdNavbarToggle
                    zdButton
                    size="sm"
                    controls="docs-navbar-mobile-links"
                    [(expanded)]="mobileOpen"
                  >
                    Menu
                  </button>
                </zd-navbar-content>
              </zd-navbar-content>
              <zd-navbar-content zdNavbarCenter visibility="desktop">
                <a zdLink routerLink="/components">Pricing</a>
                <a zdLink routerLink="/docs/getting-started">Docs</a>
              </zd-navbar-content>
            </zd-navbar>
            <zd-navbar-content visibility="mobile">
              <nav
                id="docs-navbar-mobile-links"
                class="panel"
                aria-label="Responsive example, mobile"
                [hidden]="!mobileOpen()"
              >
                <a zdLink routerLink="/components">Pricing</a>
                <a zdLink routerLink="/docs/getting-started">Docs</a>
              </nav>
            </zd-navbar-content>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="toggle"
        level="3"
        heading="Toggle"
        description="The toggle only asks. Two-way binding accepts the request; the button reports aria-expanded and names the panel it controls."
      >
        <docs-example label="filters.html" [code]="toggleCode">
          <div class="docs-stack frame">
            <button
              zdNavbarToggle
              zdButton
              size="sm"
              controls="docs-navbar-filters"
              [(expanded)]="filtersOpen"
            >
              Filters
            </button>
            <section
              id="docs-navbar-filters"
              class="panel"
              aria-label="Filters"
              [hidden]="!filtersOpen()"
            >
              <p>Filter controls go here.</p>
            </section>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .frame {
      inline-size: 100%;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      overflow: hidden;
    }

    .docs-stack.frame {
      justify-items: start;
      padding: var(--docs-space-3);
      border: 0;
    }

    .brand {
      font-weight: var(--docs-weight-bold);
      text-decoration: none;
      color: inherit;
    }

    zd-navbar a[zdLink] {
      margin-inline: var(--docs-space-2);
    }

    .panel {
      display: flex;
      flex-wrap: wrap;
      gap: var(--docs-space-3);
      padding: var(--docs-space-3);
    }

    .panel[hidden] {
      display: none;
    }

    .panel p {
      margin: 0;
    }
  `,
})
export class NavbarPageComponent {
  protected readonly reference = navbarReference;
  protected readonly controls = navbarPlaygroundControls;
  protected readonly snippet = navbarPlaygroundSnippet;
  protected readonly responsiveFiles = responsiveFiles;
  protected readonly toggleCode = toggleCode;
  protected readonly flagOf = flagOf;
  protected readonly mobileOpen = signal(false);
  protected readonly filtersOpen = signal(false);
}
