import { type Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home.component').then(module => module.DocsHomeComponent),
  },
  {
    path: 'docs/getting-started',
    loadComponent: () =>
      import('./pages/getting-started.component').then(module => module.GettingStartedComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found.component').then(module => module.NotFoundComponent),
  },
];
