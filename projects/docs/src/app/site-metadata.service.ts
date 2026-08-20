import { DOCUMENT } from '@angular/common';
import { Injectable, TransferState, inject, makeStateKey } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { breadcrumbsForPage, findSitePage, notFoundPage, type DocsSitePage } from './site-catalog';
import { DOCS_CANONICAL_ORIGIN, normalizeCanonicalOrigin } from './site-origin';

const CANONICAL_ORIGIN_STATE = makeStateKey<string>('docs-canonical-origin');

@Injectable({ providedIn: 'root' })
export class DocsMetadataService {
  private readonly configuredOrigin = inject(DOCS_CANONICAL_ORIGIN);
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly transferState = inject(TransferState);
  private readonly canonicalOrigin =
    normalizeCanonicalOrigin(this.configuredOrigin) ??
    normalizeCanonicalOrigin(this.transferState.get(CANONICAL_ORIGIN_STATE, ''));

  initialize(): void {
    if (this.canonicalOrigin) {
      this.transferState.set(CANONICAL_ORIGIN_STATE, this.canonicalOrigin);
    }
    this.apply(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.apply(event.urlAfterRedirects);
    });
  }

  private apply(path: string): void {
    const routePath = path.split(/[?#]/, 1)[0] ?? path;
    const page = findSitePage(routePath) ?? notFoundPage;
    const canonicalUrl =
      page.indexable && this.canonicalOrigin ? `${this.canonicalOrigin}${page.path}` : undefined;
    const isIndexable = canonicalUrl !== undefined;

    this.title.setTitle(page.title);
    this.meta.updateTag({ content: page.description, name: 'description' });
    this.meta.updateTag({
      content: isIndexable ? 'index,follow' : 'noindex,nofollow',
      name: 'robots',
    });
    this.meta.updateTag({ content: page.title, property: 'og:title' });
    this.meta.updateTag({ content: page.description, property: 'og:description' });
    this.meta.updateTag({ content: 'website', property: 'og:type' });
    this.meta.updateTag({ content: 'summary', name: 'twitter:card' });
    this.meta.updateTag({ content: page.title, name: 'twitter:title' });
    this.meta.updateTag({ content: page.description, name: 'twitter:description' });

    if (canonicalUrl) {
      this.meta.updateTag({ content: canonicalUrl, property: 'og:url' });
      this.setCanonicalLink(canonicalUrl);
    } else {
      this.meta.removeTag("property='og:url'");
      this.document.head.querySelector("link[rel='canonical']")?.remove();
    }

    this.setStructuredData(page, canonicalUrl);
  }

  private setCanonicalLink(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }

  private setStructuredData(page: DocsSitePage, canonicalUrl: string | undefined): void {
    const existing = this.document.head.querySelector<HTMLScriptElement>(
      "script#docs-structured-data[type='application/ld+json']",
    );
    if (!canonicalUrl || !this.canonicalOrigin) {
      existing?.remove();
      return;
    }

    const structuredData =
      page.id === 'home'
        ? {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'applicationCategory': 'DeveloperApplication',
            'codeRepository': 'https://github.com/pranxy/zordon-ui',
            'description': page.description,
            'name': 'Zordon UI',
            'operatingSystem': 'Web',
            'programmingLanguage': 'TypeScript',
            'url': canonicalUrl,
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': breadcrumbsForPage(page).map((breadcrumb, index) => ({
              '@type': 'ListItem',
              'item': `${this.canonicalOrigin}${breadcrumb.path}`,
              'name':
                breadcrumb.breadcrumbLabel ??
                breadcrumb.navigationLabel ??
                breadcrumb.title.replace(/ \| Zordon UI$/, ''),
              'position': index + 1,
            })),
          };

    const script = existing ?? this.document.createElement('script');
    script.id = 'docs-structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData).replaceAll('<', '\\u003c');
    if (!existing) this.document.head.appendChild(script);
  }
}
