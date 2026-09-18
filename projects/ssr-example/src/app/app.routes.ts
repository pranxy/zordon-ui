import { type Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'alert',
    loadComponent: () =>
      import('../../../docs/src/app/testing/alert-test-fixture.component').then(
        module => module.AlertTestFixtureComponent,
      ),
  },
  {
    path: 'theme-controller',
    loadComponent: () =>
      import('../../../docs/src/app/testing/theme-controller-test-fixture.component').then(
        module => module.ThemeControllerTestFixtureComponent,
      ),
  },
  {
    path: 'modal',
    loadComponent: () =>
      import('../../../docs/src/app/testing/modal-test-fixture.component').then(
        module => module.ModalTestFixtureComponent,
      ),
  },
  {
    path: 'fab',
    loadComponent: () =>
      import('../../../docs/src/app/testing/fab-test-fixture.component').then(
        module => module.FabTestFixtureComponent,
      ),
  },
  {
    path: 'tooltip',
    loadComponent: () =>
      import('../../../docs/src/app/testing/tooltip-test-fixture.component').then(
        module => module.TooltipTestFixtureComponent,
      ),
  },
  {
    path: 'swap',
    loadComponent: () =>
      import('../../../docs/src/app/testing/swap-test-fixture.component').then(
        module => module.SwapTestFixtureComponent,
      ),
  },
  {
    path: 'dropdown',
    loadComponent: () =>
      import('../../../docs/src/app/testing/dropdown-test-fixture.component').then(
        module => module.DropdownTestFixtureComponent,
      ),
  },
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
