import { type Route, type Routes } from '@angular/router';
import { notFoundPage, sitePages } from './site-catalog';

type SitePageId = (typeof sitePages)[number]['id'];
type PageLoader = NonNullable<Route['loadComponent']>;

const pageLoaders = {
  'button': () => import('./pages/button.component').then(module => module.ButtonPageComponent),
  'components': () =>
    import('./pages/components.component').then(module => module.ComponentsPageComponent),
  'home': () => import('./pages/home.component').then(module => module.DocsHomeComponent),
  'getting-started': () =>
    import('./pages/getting-started.component').then(module => module.GettingStartedComponent),
  'not-found': () => import('./pages/not-found.component').then(module => module.NotFoundComponent),
  'resources': () =>
    import('./pages/resources.component').then(module => module.ResourcesPageComponent),
  'styling-and-theming': () =>
    import('./pages/styling-and-theming.component').then(
      module => module.StylingAndThemingPageComponent,
    ),
  'typed-vocabularies': () =>
    import('./pages/typed-vocabularies.component').then(
      module => module.TypedVocabulariesPageComponent,
    ),
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
