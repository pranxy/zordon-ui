import { Routes } from '@angular/router';

const COMPONENTS_ROUTES: Routes = [
    {
        path: 'button',
        loadComponent: () => import('./button-demo/button-demo'),
    },
    {
        path: 'checkbox',
        loadComponent: () => import('./checkbox-demo/checkbox-demo'),
    },
];

export default COMPONENTS_ROUTES;
