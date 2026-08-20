import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { findSitePage, notFoundPage } from './site-catalog';

@Injectable({ providedIn: 'root' })
export class DocsMetadataService {
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  initialize(): void {
    this.apply(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.apply(event.urlAfterRedirects);
    });
  }

  private apply(path: string): void {
    const page = findSitePage(path) ?? notFoundPage;
    this.title.setTitle(page.title);
    this.meta.updateTag({ content: page.description, name: 'description' });
    this.meta.updateTag({
      content: page.indexable ? 'index,follow' : 'noindex,nofollow',
      name: 'robots',
    });
    this.meta.updateTag({ content: page.title, property: 'og:title' });
    this.meta.updateTag({ content: page.description, property: 'og:description' });
  }
}
