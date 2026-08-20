import { type Route, type Routes } from '@angular/router';
import { notFoundPage, sitePages } from './site-catalog';

type SitePageId = (typeof sitePages)[number]['id'];
type PageLoader = NonNullable<Route['loadComponent']>;

const pageLoaders = {
  'home': () => import('./pages/home.component').then(module => module.DocsHomeComponent),
  'getting-started': () =>
    import('./pages/getting-started.component').then(module => module.GettingStartedComponent),
  'not-found': () => import('./pages/not-found.component').then(module => module.NotFoundComponent),
} satisfies Record<SitePageId, PageLoader>;

export const routes: Routes = [
  ...sitePages.map((page): Route => ({
    path: page.path === '/' ? '' : page.path.slice(1),
    pathMatch: 'full',
    title: page.title,
    loadComponent: pageLoaders[page.id],
  })),
  {
    path: '**',
    title: notFoundPage.title,
    loadComponent: pageLoaders['not-found'],
  },
];
