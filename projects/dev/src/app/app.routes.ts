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
        path: '**',
        redirectTo: '',
    },
];
