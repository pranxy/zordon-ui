import { Routes } from '@angular/router';

const DOCS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./docs.component'),
    },
    // {
    //     path: 'getting-started',
    //     loadComponent: () =>
    //         import('./getting-started/getting-started.component').then(
    //             m => m.GettingStartedComponent
    //         ),
    // },
    // {
    //     path: 'installation',
    //     loadComponent: () =>
    //         import('./installation/installation.component').then(m => m.InstallationComponent),
    // },
];

export default DOCS_ROUTES;
