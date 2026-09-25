import { type Route, type Routes } from '@angular/router';
import { notFoundPage, sitePages } from './site-catalog';

type SitePageId = (typeof sitePages)[number]['id'];
type PageLoader = NonNullable<Route['loadComponent']>;

const pageLoaders = {
  'button': () => import('./pages/button.component').then(module => module.ButtonPageComponent),
  'dropdown': () =>
    import('./pages/dropdown.component').then(module => module.DropdownPageComponent),
  'fab': () => import('./pages/fab.component').then(module => module.FabPageComponent),
  'modal': () => import('./pages/modal.component').then(module => module.ModalPageComponent),
  'theme-controller': () =>
    import('./pages/theme-controller.component').then(
      module => module.ThemeControllerPageComponent,
    ),
  'swap': () => import('./pages/swap.component').then(module => module.SwapPageComponent),
  'carousel': () =>
    import('./pages/carousel.component').then(module => module.CarouselPageComponent),
  'collapse': () =>
    import('./pages/collapse.component').then(module => module.CollapsePageComponent),
  'breadcrumbs': () =>
    import('./pages/breadcrumbs.component').then(module => module.BreadcrumbsPageComponent),
  'dock': () => import('./pages/dock.component').then(module => module.DockPageComponent),
  'link': () => import('./pages/link.component').then(module => module.LinkPageComponent),
  'navbar': () => import('./pages/navbar.component').then(module => module.NavbarPageComponent),
  'pagination': () =>
    import('./pages/pagination.component').then(module => module.PaginationPageComponent),
  'steps': () => import('./pages/steps.component').then(module => module.StepsPageComponent),
  'tabs': () => import('./pages/tabs.component').then(module => module.TabsPageComponent),
  'megamenu': () =>
    import('./pages/megamenu.component').then(module => module.MegamenuPageComponent),
  'menu': () => import('./pages/menu.component').then(module => module.MenuPageComponent),
  'alert': () => import('./pages/alert.component').then(module => module.AlertPageComponent),
  'loading': () => import('./pages/loading.component').then(module => module.LoadingPageComponent),
  'progress': () =>
    import('./pages/progress.component').then(module => module.ProgressPageComponent),
  'radial-progress': () =>
    import('./pages/radial-progress.component').then(module => module.RadialProgressPageComponent),
  'skeleton': () =>
    import('./pages/skeleton.component').then(module => module.SkeletonPageComponent),
  'toast': () => import('./pages/toast.component').then(module => module.ToastPageComponent),
  'tooltip': () => import('./pages/tooltip.component').then(module => module.TooltipPageComponent),
  'calendar': () =>
    import('./pages/calendar.component').then(module => module.CalendarPageComponent),
  'checkbox': () =>
    import('./pages/checkbox.component').then(module => module.CheckboxPageComponent),
  'radio': () => import('./pages/radio.component').then(module => module.RadioPageComponent),
  'range': () => import('./pages/range.component').then(module => module.RangePageComponent),
  'rating': () => import('./pages/rating.component').then(module => module.RatingPageComponent),
  'select': () => import('./pages/select.component').then(module => module.SelectPageComponent),
  'text-input': () =>
    import('./pages/text-input.component').then(module => module.TextInputPageComponent),
  'textarea': () =>
    import('./pages/textarea.component').then(module => module.TextareaPageComponent),
  'toggle': () => import('./pages/toggle.component').then(module => module.TogglePageComponent),
  'fieldset': () =>
    import('./pages/fieldset.component').then(module => module.FieldsetPageComponent),
  'file-input': () =>
    import('./pages/file-input.component').then(module => module.FileInputPageComponent),
  'filter': () => import('./pages/filter.component').then(module => module.FilterPageComponent),
  'label': () => import('./pages/label.component').then(module => module.LabelPageComponent),
  'validator': () =>
    import('./pages/validator.component').then(module => module.ValidatorPageComponent),
  'otp': () => import('./pages/otp.component').then(module => module.OtpPageComponent),
  'kbd': () => import('./pages/kbd.component').then(module => module.KbdPageComponent),
  'components': () =>
    import('./pages/components.component').then(module => module.ComponentsPageComponent),
  'home': () => import('./pages/home.component').then(module => module.DocsHomeComponent),
  'getting-started': () =>
    import('./pages/getting-started.component').then(module => module.GettingStartedComponent),
  'not-found': () => import('./pages/not-found.component').then(module => module.NotFoundComponent),
  'resources': () =>
    import('./pages/resources.component').then(module => module.ResourcesPageComponent),
  'styling-and-theming': () =>
    import('./pages/styling-and-theming.component').then(
      module => module.StylingAndThemingPageComponent,
    ),
  'typed-vocabularies': () =>
    import('./pages/typed-vocabularies.component').then(
      module => module.TypedVocabulariesPageComponent,
    ),
} satisfies Record<SitePageId, PageLoader>;

export const routes: Routes = [
  {
    path: '__zordon-tests__/drawer',
    loadComponent: () =>
      import('./testing/drawer-test-fixture.component').then(
        module => module.DrawerTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/ui',
    loadComponent: () =>
      import('./testing/ui-gallery.component').then(module => module.UiGalleryComponent),
  },
  {
    path: '__zordon-tests__/tabs',
    loadComponent: () =>
      import('./testing/tabs-test-fixture.component').then(
        module => module.TabsTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/steps',
    loadComponent: () =>
      import('./testing/steps-test-fixture.component').then(
        module => module.StepsTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/pagination',
    loadComponent: () =>
      import('./testing/pagination-test-fixture.component').then(
        module => module.PaginationTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/navbar',
    loadComponent: () =>
      import('./testing/navbar-test-fixture.component').then(
        module => module.NavbarTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/menu',
    loadComponent: () =>
      import('./testing/menu-docs-fixture.component').then(
        module => module.MenuDocsFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/megamenu',
    loadComponent: () =>
      import('./testing/megamenu-test-fixture.component').then(
        module => module.MegamenuTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/dock',
    loadComponent: () =>
      import('./testing/dock-test-fixture.component').then(
        module => module.DockTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/breadcrumbs',
    loadComponent: () =>
      import('./testing/breadcrumbs-test-fixture.component').then(
        module => module.BreadcrumbsTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/accordion',
    loadComponent: () =>
      import('./testing/accordion-test-fixture.component').then(
        module => module.AccordionTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/toast',
    loadComponent: () =>
      import('./testing/toast-test-fixture.component').then(
        module => module.ToastTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/skeleton',
    loadComponent: () =>
      import('./testing/skeleton-test-fixture.component').then(
        module => module.SkeletonTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/radial-progress',
    loadComponent: () =>
      import('./testing/radial-progress-test-fixture.component').then(
        module => module.RadialProgressTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/progress',
    loadComponent: () =>
      import('./testing/progress-test-fixture.component').then(
        module => module.ProgressTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/loading',
    loadComponent: () =>
      import('./testing/loading-test-fixture.component').then(
        module => module.LoadingTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/alert',
    loadComponent: () =>
      import('./testing/alert-test-fixture.component').then(
        module => module.AlertTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/theme-controller',
    loadComponent: () =>
      import('./testing/theme-controller-test-fixture.component').then(
        module => module.ThemeControllerTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/modal',
    loadComponent: () =>
      import('./testing/modal-test-fixture.component').then(
        module => module.ModalTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/fab',
    loadComponent: () =>
      import('./testing/fab-test-fixture.component').then(module => module.FabTestFixtureComponent),
  },
  {
    path: '__zordon-tests__/tooltip',
    loadComponent: () =>
      import('./testing/tooltip-test-fixture.component').then(
        module => module.TooltipTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/swap',
    loadComponent: () =>
      import('./testing/swap-test-fixture.component').then(
        module => module.SwapTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/dropdown',
    loadComponent: () =>
      import('./testing/dropdown-test-fixture.component').then(
        module => module.DropdownTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/dropdown-probe',
    loadComponent: () =>
      import('./testing/dropdown-menu-probe.component').then(
        module => module.DropdownMenuProbeComponent,
      ),
  },
  {
    path: '__zordon-tests__/calendar',
    loadComponent: () =>
      import('./testing/calendar-test-fixture.component').then(
        module => module.CalendarTestFixtureComponent,
      ),
  },
  {
    path: '__zordon-tests__/browser',
    loadComponent: () =>
      import('./testing/browser-test-fixture.component').then(module => module.default),
  },
  ...sitePages.map((page): Route => ({
    path: page.path === '/' ? '' : page.path.slice(1),
    pathMatch: 'full',
    title: page.title,
    loadComponent: pageLoaders[page.id],
  })),
  {
    path: '**',
    title: notFoundPage.title,
    loadComponent: pageLoaders['not-found'],
  },
];
