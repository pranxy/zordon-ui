import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component'),
    },
    {
        path: 'components',
        loadChildren: () => import('./pages/components/components.routes'),
    },
    {
        path: 'docs',
        loadChildren: () => import('./pages/docs/docs.routes'),
    },
    {
        path: 'examples',
        loadChildren: () => import('./pages/examples/examples.routes'),
    },
    {
        path: 'resources',
        loadChildren: () => import('./pages/resources/resources.routes'),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
