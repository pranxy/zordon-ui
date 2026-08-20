import { type Routes } from '@angular/router';
import { gettingStartedPage, homePage, notFoundPage } from './site-catalog';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: homePage.title,
    loadComponent: () => import('./pages/home.component').then(module => module.DocsHomeComponent),
  },
  {
    path: 'docs/getting-started',
    title: gettingStartedPage.title,
    loadComponent: () =>
      import('./pages/getting-started.component').then(module => module.GettingStartedComponent),
  },
  {
    path: '**',
    title: notFoundPage.title,
    loadComponent: () =>
      import('./pages/not-found.component').then(module => module.NotFoundComponent),
  },
];
