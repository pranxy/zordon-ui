import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import {
  breadcrumbsForPage,
  findSitePage,
  findSitePageById,
  indexableSitePages,
  notFoundPage,
  primaryNavigationPages,
} from './site-catalog';
import { DocsMetadataService } from './site-metadata.service';

type DocsTheme = 'dark' | 'light';

@Component({
  selector: 'docs-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main-content">Skip to content</a>

    <header class="site-header">
      <div class="utility-bar">
        <p>Angular 21 · daisyUI 5</p>
        <div class="utility-actions">
          <a href="https://github.com/pranxy/zordon-ui">GitHub</a>
          <button type="button" (click)="openSearch($event)">Search documentation</button>
          <button
            type="button"
            [attr.aria-label]="
              theme() === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
            "
            [attr.aria-pressed]="theme() === 'dark'"
            (click)="toggleTheme()"
          >
            {{ theme() === 'light' ? 'Dark' : 'Light' }} theme
          </button>
        </div>
      </div>

      <div class="primary-header">
        <a aria-label="Zordon UI home" class="brand" routerLink="/">
          <span class="brand-mark" aria-hidden="true">Z</span>
          <span>Zordon UI</span>
        </a>

        <nav class="desktop-navigation" aria-label="Primary navigation">
          @for (page of primaryNavigation; track page.id) {
            <a
              [routerLink]="page.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: false }"
              ariaCurrentWhenActive="page"
            >
              {{ page.navigationLabel }}
            </a>
          }
        </nav>

        <details class="mobile-navigation" #mobileNavigation>
          <summary>Navigation menu</summary>
          <nav aria-label="Mobile navigation">
            <a
              routerLink="/"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              ariaCurrentWhenActive="page"
              (click)="closeMobileNavigation(mobileNavigation)"
              >Home</a
            >
            @for (page of primaryNavigation; track page.id) {
              <a
                [routerLink]="page.path"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: false }"
                ariaCurrentWhenActive="page"
                (click)="closeMobileNavigation(mobileNavigation)"
              >
                {{ page.navigationLabel }}
              </a>
            }
          </nav>
        </details>
      </div>
    </header>

    <div class="page-frame">
      @if (currentPage().path !== '/') {
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol>
            @for (page of breadcrumbs(); track page.id; let last = $last) {
              <li>
                @if (last) {
                  <span aria-current="page">{{
                    page.breadcrumbLabel ?? page.navigationLabel ?? page.title
                  }}</span>
                } @else {
                  <a [routerLink]="page.path">{{
                    page.id === 'home'
                      ? 'Home'
                      : (page.breadcrumbLabel ?? page.navigationLabel ?? page.title)
                  }}</a>
                }
              </li>
            }
          </ol>
        </nav>
      }

      <div class="documentation-grid" [class.landing-grid]="currentPage().path === '/'">
        @if (showDocumentationNavigation()) {
          <aside class="section-navigation">
            <nav aria-label="Documentation sections">
              <p>Documentation</p>
              @for (page of primaryNavigation; track page.id) {
                <a
                  [routerLink]="page.path"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: false }"
                  ariaCurrentWhenActive="page"
                >
                  {{ page.navigationLabel }}
                </a>
              }
            </nav>
          </aside>
        }

        <main id="main-content" tabindex="-1">
          @if (currentPage().tableOfContents?.length) {
            <details class="mobile-table-of-contents">
              <summary>On this page</summary>
              <nav aria-label="On this page">
                @for (item of currentPage().tableOfContents; track item.id) {
                  <a [routerLink]="currentPage().path" [fragment]="item.id">{{ item.label }}</a>
                }
              </nav>
            </details>
          }
          <router-outlet />
          @if (previousPage() || nextPage()) {
            <nav class="page-pagination" aria-label="Page navigation">
              @if (previousPage(); as previous) {
                <a [routerLink]="previous.path">
                  <span>Previous</span>
                  {{ previous.navigationLabel ?? previous.title }}
                </a>
              }
              @if (nextPage(); as next) {
                <a class="next-page" [routerLink]="next.path">
                  <span>Next</span>
                  {{ next.navigationLabel ?? next.title }}
                </a>
              }
            </nav>
          }
        </main>

        @if (currentPage().tableOfContents?.length) {
          <aside class="table-of-contents">
            <nav aria-label="On this page">
              <p>On this page</p>
              @for (item of currentPage().tableOfContents; track item.id) {
                <a [routerLink]="currentPage().path" [fragment]="item.id">{{ item.label }}</a>
              }
            </nav>
          </aside>
        }
      </div>
    </div>

    <footer class="site-footer">
      <div>
        <a class="brand footer-brand" routerLink="/">Zordon UI</a>
        <p>Accessible Angular components, styled by daisyUI.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a routerLink="/docs/getting-started">Get started</a>
        <a href="https://github.com/pranxy/zordon-ui">Source</a>
      </nav>
    </footer>

    <dialog
      #searchDialog
      aria-label="Search documentation"
      (cancel)="cancelSearch($event)"
      (close)="searchQuery.set('')"
    >
      <div class="dialog-heading">
        <div>
          <p class="eyebrow">Quick find</p>
          <h2>Search documentation</h2>
        </div>
        <form method="dialog">
          <button type="submit" aria-label="Close search">Close</button>
        </form>
      </div>
      <label for="docs-search">Search documentation</label>
      <input
        id="docs-search"
        type="search"
        autocomplete="off"
        autofocus
        [value]="searchQuery()"
        (input)="updateSearchQuery($event)"
        (keydown.escape)="cancelSearch($event)"
      />
      <nav aria-label="Search results">
        @for (page of searchResults(); track page.id) {
          <a [routerLink]="page.path" (click)="closeSearch()">
            <strong>{{ page.navigationLabel ?? page.title }}</strong>
            <span>{{ page.description }}</span>
          </a>
        } @empty {
          <p>No documentation pages match that search.</p>
        }
      </nav>
    </dialog>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-rows: auto 1fr auto;
      min-block-size: 100vh;
    }

    .site-header,
    .site-footer,
    .page-frame {
      padding-inline: var(--docs-gutter);
    }

    .site-header {
      position: sticky;
      inset-block-start: 0;
      z-index: 10;
      border-block-end: 1px solid var(--docs-border);
      background: color-mix(in srgb, var(--docs-surface) 94%, transparent);
      backdrop-filter: blur(14px);
    }

    .utility-bar,
    .primary-header,
    .site-footer {
      inline-size: min(100%, 90rem);
      margin-inline: auto;
    }

    .utility-bar,
    .primary-header,
    .utility-actions,
    .site-footer,
    .site-footer nav {
      display: flex;
      align-items: center;
    }

    .utility-bar {
      min-block-size: 2.5rem;
      justify-content: space-between;
      gap: 1rem;
      border-block-end: 1px solid var(--docs-border);
      color: var(--docs-muted-text);
      font-size: 0.8125rem;
    }

    .utility-bar p,
    .site-footer p {
      margin: 0;
    }

    .utility-actions {
      gap: 0.25rem;
    }

    .utility-actions a,
    .utility-actions button {
      min-block-size: 2rem;
      padding-inline: 0.625rem;
      border: 0;
      border-radius: 0.375rem;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }

    .utility-actions a {
      display: grid;
      place-items: center;
      text-decoration: none;
    }

    .utility-actions :is(a, button):hover {
      background: var(--docs-subtle);
      color: var(--docs-text);
    }

    .primary-header {
      min-block-size: 4.5rem;
      justify-content: space-between;
      gap: 2rem;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--docs-text);
      font-weight: 750;
      letter-spacing: -0.02em;
      text-decoration: none;
    }

    .brand-mark {
      display: grid;
      inline-size: 2rem;
      block-size: 2rem;
      place-items: center;
      border-radius: 0.5rem;
      background: var(--docs-accent);
      color: var(--docs-accent-text);
      font-size: 0.875rem;
      font-weight: 800;
    }

    .desktop-navigation {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .desktop-navigation a,
    .section-navigation a {
      border-radius: 0.5rem;
      color: var(--docs-muted-text);
      font-size: 0.9375rem;
      font-weight: 600;
      text-decoration: none;
    }

    .desktop-navigation a {
      padding: 0.625rem 0.875rem;
    }

    .desktop-navigation a:hover,
    .desktop-navigation a.active,
    .section-navigation a:hover,
    .section-navigation a.active {
      background: var(--docs-subtle);
      color: var(--docs-accent-strong);
    }

    .mobile-navigation {
      display: none;
      position: relative;
    }

    .mobile-navigation summary {
      min-block-size: 2.75rem;
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--docs-border);
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 650;
      list-style: none;
    }

    .mobile-navigation summary::-webkit-details-marker {
      display: none;
    }

    .mobile-navigation nav {
      position: absolute;
      inset-block-start: calc(100% + 0.5rem);
      inset-inline-end: 0;
      display: grid;
      min-inline-size: 14rem;
      padding: 0.5rem;
      border: 1px solid var(--docs-border);
      border-radius: 0.75rem;
      background: var(--docs-surface);
      box-shadow: var(--docs-shadow);
    }

    .mobile-navigation a {
      padding: 0.75rem;
      border-radius: 0.5rem;
      text-decoration: none;
    }

    .mobile-navigation a:hover {
      background: var(--docs-subtle);
    }

    .mobile-navigation a.active {
      background: var(--docs-subtle);
      color: var(--docs-accent-strong);
      font-weight: 700;
    }

    .page-frame {
      inline-size: 100%;
    }

    .breadcrumb,
    .documentation-grid {
      inline-size: min(100%, 90rem);
      margin-inline: auto;
    }

    .breadcrumb {
      padding-block: 1.25rem;
      border-block-end: 1px solid var(--docs-border);
      color: var(--docs-muted-text);
      font-size: 0.875rem;
    }

    .breadcrumb ol {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .breadcrumb li + li::before {
      content: '/';
      margin-inline-end: 0.5rem;
      color: var(--docs-border-strong);
    }

    .breadcrumb a {
      color: inherit;
      text-decoration: none;
    }

    .breadcrumb a:hover {
      color: var(--docs-accent-strong);
    }

    .documentation-grid {
      display: grid;
      grid-template-columns: minmax(11rem, 14rem) minmax(0, 1fr) minmax(9rem, 12rem);
      gap: clamp(2rem, 4vw, 4rem);
      align-items: start;
      padding-block: clamp(2rem, 5vw, 4.5rem);
    }

    .documentation-grid.landing-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    main {
      min-inline-size: 0;
    }

    .mobile-table-of-contents {
      display: none;
      margin-block-end: 1.5rem;
      border: 1px solid var(--docs-border);
      border-radius: 0.75rem;
      background: var(--docs-surface-raised);
    }

    .mobile-table-of-contents summary {
      padding: 0.875rem 1rem;
      cursor: pointer;
      font-weight: 750;
    }

    .mobile-table-of-contents nav {
      display: grid;
      gap: 0.25rem;
      padding: 0 1rem 1rem;
    }

    .mobile-table-of-contents a {
      padding-block: 0.25rem;
      color: var(--docs-muted-text);
      text-decoration: none;
    }

    .mobile-table-of-contents a:hover {
      color: var(--docs-accent-strong);
    }

    .page-pagination {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      margin-block-start: 3rem;
      padding-block-start: 1.5rem;
      border-block-start: 1px solid var(--docs-border);
    }

    .page-pagination a {
      display: grid;
      gap: 0.25rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
      color: var(--docs-accent-strong);
      font-weight: 700;
      text-decoration: none;
    }

    .page-pagination a:hover {
      background: var(--docs-subtle);
    }

    .page-pagination span {
      color: var(--docs-muted-text);
      font-size: 0.75rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .page-pagination .next-page {
      grid-column: 2;
      text-align: end;
    }

    .section-navigation,
    .table-of-contents {
      position: sticky;
      inset-block-start: 8.25rem;
    }

    .section-navigation nav,
    .table-of-contents nav {
      display: grid;
      gap: 0.25rem;
    }

    .section-navigation p,
    .table-of-contents p {
      margin: 0 0 0.625rem;
      color: var(--docs-text);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .section-navigation a {
      padding: 0.625rem 0.75rem;
    }

    .table-of-contents {
      padding-inline-start: 1rem;
      border-inline-start: 1px solid var(--docs-border);
    }

    .table-of-contents a {
      padding-block: 0.25rem;
      color: var(--docs-muted-text);
      font-size: 0.8125rem;
      line-height: 1.4;
      text-decoration: none;
    }

    .table-of-contents a:hover {
      color: var(--docs-accent-strong);
    }

    .site-footer {
      justify-content: space-between;
      gap: 2rem;
      padding-block: 2rem;
      border-block-start: 1px solid var(--docs-border);
      color: var(--docs-muted-text);
      font-size: 0.875rem;
    }

    .site-footer > div {
      display: grid;
      gap: 0.5rem;
    }

    .footer-brand {
      font-size: 1rem;
    }

    .site-footer nav {
      gap: 1rem;
    }

    .site-footer a {
      text-decoration: none;
    }

    dialog {
      inline-size: min(calc(100% - 2rem), 42rem);
      max-block-size: min(42rem, calc(100dvh - 2rem));
      padding: 1.25rem;
      border: 1px solid var(--docs-border);
      border-radius: 1rem;
      background: var(--docs-surface);
      color: var(--docs-text);
      box-shadow: var(--docs-shadow);
    }

    dialog::backdrop {
      background: color-mix(in srgb, #111827 68%, transparent);
    }

    .dialog-heading {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: start;
      margin-block-end: 1rem;
    }

    .dialog-heading h2,
    .dialog-heading p {
      margin: 0;
    }

    .eyebrow {
      color: var(--docs-accent-strong);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    dialog label {
      display: block;
      margin-block-end: 0.5rem;
      font-size: 0.875rem;
      font-weight: 650;
    }

    dialog input {
      inline-size: 100%;
      min-block-size: 3rem;
      margin-block-end: 1rem;
      padding-inline: 0.875rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: 0.625rem;
      background: var(--docs-surface);
      color: var(--docs-text);
      font: inherit;
    }

    dialog button {
      min-block-size: 2.5rem;
      padding-inline: 0.75rem;
      border: 1px solid var(--docs-border);
      border-radius: 0.5rem;
      background: var(--docs-subtle);
      color: var(--docs-text);
      cursor: pointer;
    }

    dialog nav {
      display: grid;
      gap: 0.5rem;
    }

    dialog nav a {
      display: grid;
      gap: 0.25rem;
      padding: 0.875rem;
      border: 1px solid var(--docs-border);
      border-radius: 0.625rem;
      color: inherit;
      text-decoration: none;
    }

    dialog nav a:hover {
      border-color: var(--docs-accent);
      background: var(--docs-subtle);
    }

    dialog nav span {
      color: var(--docs-muted-text);
      font-size: 0.875rem;
    }

    .skip-link {
      position: fixed;
      inset-block-start: 0.5rem;
      inset-inline-start: 0.5rem;
      z-index: 100;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      background: var(--docs-text);
      color: var(--docs-surface);
      font-weight: 700;
      transform: translateY(-150%);
    }

    .skip-link:focus {
      transform: translateY(0);
    }

    @media (max-width: 64rem) {
      .documentation-grid {
        grid-template-columns: minmax(10rem, 13rem) minmax(0, 1fr);
      }

      .table-of-contents {
        display: none;
      }

      .mobile-table-of-contents {
        display: block;
      }
    }

    @media (max-width: 48rem) {
      .utility-bar > p,
      .desktop-navigation {
        display: none;
      }

      .utility-bar {
        justify-content: flex-end;
      }

      .mobile-navigation {
        display: block;
      }

      .documentation-grid {
        grid-template-columns: minmax(0, 1fr);
        padding-block-start: 1.5rem;
      }

      .section-navigation {
        display: none;
      }

      .page-pagination {
        grid-template-columns: minmax(0, 1fr);
      }

      .page-pagination .next-page {
        grid-column: 1;
        text-align: start;
      }

      .site-footer {
        align-items: start;
      }
    }

    @media (max-width: 30rem) {
      .utility-actions a {
        display: none;
      }

      .site-footer {
        display: grid;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .skip-link {
        transition: none;
      }
    }
  `,
})
export class DocsAppComponent {
  private readonly document = inject(DOCUMENT);
  private readonly metadata = inject(DocsMetadataService);
  private readonly router = inject(Router);
  private readonly searchDialog = viewChild.required<ElementRef<HTMLDialogElement>>('searchDialog');
  private searchInvoker: HTMLElement | null = null;
  private readonly routePath = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => normalizeRoutePath(event.urlAfterRedirects)),
    ),
    { initialValue: normalizeRoutePath(this.router.url) },
  );

  protected readonly primaryNavigation = primaryNavigationPages();
  protected readonly currentPage = computed(() => findSitePage(this.routePath()) ?? notFoundPage);
  protected readonly breadcrumbs = computed(() => breadcrumbsForPage(this.currentPage()));
  protected readonly previousPage = computed(() => findSitePageById(this.currentPage().previousId));
  protected readonly nextPage = computed(() => findSitePageById(this.currentPage().nextId));
  protected readonly showDocumentationNavigation = computed(
    () => this.currentPage().path !== '/' && this.currentPage().section !== 'system',
  );
  protected readonly searchQuery = signal('');
  protected readonly searchResults = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase();
    return indexableSitePages().filter(
      page =>
        query === '' ||
        page.title.toLocaleLowerCase().includes(query) ||
        page.description.toLocaleLowerCase().includes(query),
    );
  });
  protected readonly theme = signal<DocsTheme>('light');

  constructor() {
    this.metadata.initialize();
    afterNextRender(() => {
      const savedTheme = this.document.defaultView?.localStorage.getItem('zordon-docs-theme');
      if (savedTheme === 'dark' || savedTheme === 'light') this.applyTheme(savedTheme, false);
    });
  }

  protected openSearch(event: Event): void {
    this.searchQuery.set('');
    this.searchInvoker = event.currentTarget as HTMLElement;
    this.searchDialog().nativeElement.showModal();
  }

  protected closeSearch(): void {
    this.searchDialog().nativeElement.close();
  }

  protected cancelSearch(event: Event): void {
    event.preventDefault();
    this.closeSearch();
    this.searchInvoker?.focus();
  }

  protected updateSearchQuery(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected closeMobileNavigation(navigation: HTMLDetailsElement): void {
    navigation.open = false;
  }

  protected toggleTheme(): void {
    this.applyTheme(this.theme() === 'light' ? 'dark' : 'light', true);
  }

  private applyTheme(theme: DocsTheme, persist: boolean): void {
    this.theme.set(theme);
    this.document.documentElement.dataset['theme'] = theme;
    if (persist) this.document.defaultView?.localStorage.setItem('zordon-docs-theme', theme);
  }
}

function normalizeRoutePath(url: string): string {
  return url.split(/[?#]/, 1)[0] ?? url;
}
