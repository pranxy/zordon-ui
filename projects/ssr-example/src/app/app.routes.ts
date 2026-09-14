import { type Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dropdown-probe',
    loadComponent: () =>
      import('../../../docs/src/app/testing/dropdown-menu-probe.component').then(
        module => module.DropdownMenuProbeComponent,
      ),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('../../../docs/src/app/testing/calendar-test-fixture.component').then(
        module => module.CalendarTestFixtureComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./app.component').then(module => module.SsrExampleAppComponent),
  },
  {
    path: 'calendar-grid-probe',
    loadComponent: () =>
      import('../../../docs/src/app/testing/calendar-grid-probe.component').then(
        module => module.CalendarGridProbeComponent,
      ),
  },
];
