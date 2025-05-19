import { Routes } from '@angular/router';

const COMPONENTS_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'button',
        pathMatch: 'full',
    },
    {
        path: 'button',
        loadComponent: () => import('./button-demo/button-demo'),
    },
    {
        path: 'badge',
        loadComponent: () => import('./badge-demo/badge-demo.component'),
    },
    {
        path: 'modal',
        loadComponent: () => import('./modal-demo/modal-demo.component'),
    },
    {
        path: 'alert',
        loadComponent: () => import('./alert-demo/alert-demo.component'),
    },
    {
        path: 'radio',
        loadComponent: () => import('./radio-demo/radio-demo'),
    },
];

export default COMPONENTS_ROUTES;
