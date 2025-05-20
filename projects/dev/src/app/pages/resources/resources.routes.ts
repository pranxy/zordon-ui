import { Routes } from '@angular/router';

const RESOURCES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./resources.component'),
    },
];

export default RESOURCES_ROUTES;
