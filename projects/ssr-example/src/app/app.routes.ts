import { type Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'steps',
    loadComponent: () =>
      import('../../../docs/src/app/testing/steps-test-fixture.component').then(
        module => module.StepsTestFixtureComponent,
      ),
  },
  {
    path: 'pagination',
    loadComponent: () =>
      import('../../../docs/src/app/testing/pagination-test-fixture.component').then(
        module => module.PaginationTestFixtureComponent,
      ),
  },
  {
    path: 'navbar',
    loadComponent: () =>
      import('../../../docs/src/app/testing/navbar-test-fixture.component').then(
        module => module.NavbarTestFixtureComponent,
      ),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('../../../docs/src/app/testing/menu-test-fixture.component').then(
        module => module.MenuTestFixtureComponent,
      ),
  },
  {
    path: 'megamenu',
    loadComponent: () =>
      import('../../../docs/src/app/testing/megamenu-test-fixture.component').then(
        module => module.MegamenuTestFixtureComponent,
      ),
  },
  {
    path: 'dock',
    loadComponent: () =>
      import('../../../docs/src/app/testing/dock-test-fixture.component').then(
        module => module.DockTestFixtureComponent,
      ),
  },
  {
    path: 'breadcrumbs',
    loadComponent: () =>
      import('../../../docs/src/app/testing/breadcrumbs-test-fixture.component').then(
        module => module.BreadcrumbsTestFixtureComponent,
      ),
  },
  {
    path: 'accordion',
    loadComponent: () =>
      import('../../../docs/src/app/testing/accordion-test-fixture.component').then(
        module => module.AccordionTestFixtureComponent,
      ),
  },
  {
    path: 'toast',
    loadComponent: () =>
      import('../../../docs/src/app/testing/toast-test-fixture.component').then(
        module => module.ToastTestFixtureComponent,
      ),
  },
  {
    path: 'skeleton',
    loadComponent: () =>
      import('../../../docs/src/app/testing/skeleton-test-fixture.component').then(
        module => module.SkeletonTestFixtureComponent,
      ),
  },
  {
    path: 'radial-progress',
    loadComponent: () =>
      import('../../../docs/src/app/testing/radial-progress-test-fixture.component').then(
        module => module.RadialProgressTestFixtureComponent,
      ),
  },
  {
    path: 'progress',
    loadComponent: () =>
      import('../../../docs/src/app/testing/progress-test-fixture.component').then(
        module => module.ProgressTestFixtureComponent,
      ),
  },
  {
    path: 'loading',
    loadComponent: () =>
      import('../../../docs/src/app/testing/loading-test-fixture.component').then(
        module => module.LoadingTestFixtureComponent,
      ),
  },
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
