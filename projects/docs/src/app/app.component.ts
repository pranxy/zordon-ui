import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import {
  breadcrumbItems,
  mobileNavItems,
  pagerLinks,
  primaryNavItems,
  searchEntries,
  sideNavigation,
} from './navigation';
import { findSitePage, notFoundPage } from './site-catalog';
import { DocsMetadataService } from './site-metadata.service';
import { DocsMaturityLegendComponent } from './ui/catalogue/maturity-legend.component';
import { DocsBrandComponent } from './ui/shell/brand.component';
import { DocsBreadcrumbsComponent } from './ui/shell/breadcrumbs.component';
import { DocsFooterComponent } from './ui/shell/footer.component';
import { DocsLayoutComponent } from './ui/shell/layout.component';
import { DocsMobileNavComponent } from './ui/shell/mobile-nav.component';
import { DocsPagerComponent } from './ui/shell/pager.component';
import { DocsPrimaryNavComponent } from './ui/shell/primary-nav.component';
import { DocsSearchDialogComponent } from './ui/shell/search-dialog.component';
import { DocsSideNavComponent } from './ui/shell/side-nav.component';
import { DocsTocComponent } from './ui/shell/toc.component';
import { DocsUtilityBarComponent } from './ui/shell/utility-bar.component';

/**
 * Site shell. Composition only: every region is a `docs-*` component and every list it shows is
 * derived from the page and component catalogues (see navigation.ts).
 */
@Component({
  selector: 'docs-root',
  imports: [
    DocsBrandComponent,
    DocsBreadcrumbsComponent,
    DocsFooterComponent,
    DocsLayoutComponent,
    DocsMaturityLegendComponent,
    DocsMobileNavComponent,
    DocsPagerComponent,
    DocsPrimaryNavComponent,
    DocsSearchDialogComponent,
    DocsSideNavComponent,
    DocsTocComponent,
    DocsUtilityBarComponent,
    RouterOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main-content">Skip to content</a>

    <header class="site-header">
      <div class="container">
        <docs-utility-bar (searchRequested)="openSearch($event)" />
        <div class="primary-header">
          <docs-brand />
          <docs-primary-nav [items]="primaryNav" />
          <docs-mobile-nav [items]="mobileNav" />
        </div>
      </div>
    </header>

    <div class="page-frame">
      @if (!isLanding()) {
        <docs-breadcrumbs class="container" [items]="breadcrumbs()" />
      }

      <docs-layout [hasSidebar]="!!sideNav()" [hasToc]="hasToc()">
        @if (sideNav(); as nav) {
          <docs-side-nav
            docsLayoutSidebar
            [label]="nav.label"
            [groups]="nav.groups"
            [backLink]="nav.backLink"
          >
            @if (nav.legend) {
              <docs-maturity-legend />
            }
          </docs-side-nav>
        }

        <main id="main-content" tabindex="-1">
          @if (hasToc()) {
            <docs-toc
              variant="disclosure"
              [items]="currentPage().tableOfContents ?? []"
              [pagePath]="currentPage().path"
            />
          }
          <router-outlet />
          @if (pager().previous || pager().next) {
            <docs-pager [previous]="pager().previous" [next]="pager().next" />
          }
        </main>

        @if (hasToc()) {
          <docs-toc
            docsLayoutToc
            [items]="currentPage().tableOfContents ?? []"
            [pagePath]="currentPage().path"
            [editUrl]="currentPage().sourceUrl"
          />
        }
      </docs-layout>
    </div>

    <docs-footer />
    @defer (on idle) {
      <docs-search-dialog #search [entries]="searchEntries" />
    }
  `,
  styles: `
    :host {
      display: grid;
      grid-template-rows: auto 1fr auto;
      min-block-size: 100vh;
    }

    .site-header {
      position: sticky;
      inset-block-start: 0;
      z-index: 10;
      padding-inline: var(--docs-gutter);
      border-block-end: 1px solid var(--docs-border);
      background: color-mix(in srgb, var(--docs-surface) 94%, transparent);
      backdrop-filter: blur(14px);
    }

    .container {
      display: block;
      inline-size: min(100%, var(--docs-container));
      margin-inline: auto;
    }

    .primary-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      min-block-size: 4.5rem;
    }

    .page-frame {
      inline-size: 100%;
      padding-inline: var(--docs-gutter);
    }

    main {
      min-inline-size: 0;
    }

    main:focus {
      outline: none;
    }

    .skip-link {
      position: fixed;
      inset-block-start: 0.5rem;
      inset-inline-start: 0.5rem;
      z-index: 100;
      padding: 0.75rem 1rem;
      border-radius: var(--docs-radius-md);
      background: var(--docs-text);
      color: var(--docs-surface);
      font-weight: var(--docs-weight-bold);
      transform: translateY(-150%);
    }

    .skip-link:focus {
      transform: translateY(0);
    }
  `,
  host: { '(document:keydown)': 'onDocumentKeydown($event)' },
})
export class DocsAppComponent {
  private readonly document = inject(DOCUMENT);
  private readonly metadata = inject(DocsMetadataService);
  private readonly router = inject(Router);
  private enhanced = false;
  private readonly routePath = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => normalizeRoutePath(event.urlAfterRedirects)),
    ),
    { initialValue: normalizeRoutePath(this.router.url) },
  );

  /** Loaded after the page is idle; it is never needed for server rendering. */
  private readonly search = viewChild<DocsSearchDialogComponent>('search');
  protected readonly primaryNav = primaryNavItems();
  protected readonly mobileNav = mobileNavItems();
  protected readonly searchEntries = searchEntries();
  protected readonly currentPage = computed(() => findSitePage(this.routePath()) ?? notFoundPage);
  protected readonly isLanding = computed(() => this.currentPage().path === '/');
  protected readonly breadcrumbs = computed(() => breadcrumbItems(this.currentPage()));
  protected readonly sideNav = computed(() => sideNavigation(this.currentPage()));
  protected readonly pager = computed(() => pagerLinks(this.currentPage()));
  protected readonly hasToc = computed(() => (this.currentPage().tableOfContents?.length ?? 0) > 0);

  constructor() {
    this.metadata.initialize();
    afterNextRender(() => (this.enhanced = true));
  }

  /** "/" opens search from anywhere except text fields. */
  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.enhanced || event.key !== '/' || event.defaultPrevented) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
    event.preventDefault();
    this.openSearch(this.document.activeElement);
  }

  protected openSearch(invoker: EventTarget | null): void {
    this.search()?.open(invoker);
  }
}

function normalizeRoutePath(url: string): string {
  return url.split(/[?#]/, 1)[0] ?? url;
}
