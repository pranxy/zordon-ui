import { Routes } from '@angular/router';

const COMPONENTS_ROUTES: Routes = [
    {
        path: 'button',
        loadComponent: () => import('./button-demo/button-demo.component'),
    },
];

export default COMPONENTS_ROUTES;
