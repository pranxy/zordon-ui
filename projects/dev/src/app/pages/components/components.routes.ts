import { Routes } from '@angular/router';

const COMPONENTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./components-overview.component'),
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
    {
        path: 'skeleton',
        loadComponent: () => import('./skeleton-demo/skeleton-demo.component'),
    },
];

export default COMPONENTS_ROUTES;
