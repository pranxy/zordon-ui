import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'components',
    },
    {
        path: 'components',
        loadComponent: () => import('./pages/components/components.component'),
        loadChildren: () => import('./pages/components/components.routes'),
    },
];
