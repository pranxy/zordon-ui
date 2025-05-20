import { Routes } from '@angular/router';

const EXAMPLES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./examples.component'),
    },
];

export default EXAMPLES_ROUTES;
