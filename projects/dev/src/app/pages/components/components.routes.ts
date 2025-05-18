import { Routes } from '@angular/router';

const COMPONENTS_ROUTES: Routes = [
    {
        path: 'button',
        loadComponent: () => import('./button-demo/button-demo'),
    },
    {
        path: 'modal',
        loadComponent: () => import('./modal-demo/modal-demo.component'),
    },
    {
        path: 'checkbox',
        loadComponent: () => import('./checkbox-demo/checkbox-demo'),
    },
    {
        path: 'radio',
        loadComponent: () => import('./radio-demo/radio-demo'),
    },
];

export default COMPONENTS_ROUTES;
