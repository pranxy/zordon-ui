import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  computed,
  signal,
  viewChild,
} from '@angular/core';
import {
  ZdBreadcrumbs,
  type ZdBreadcrumbItem,
  type ZdBreadcrumbIconContext,
  type ZdBreadcrumbOverflow,
} from '@pranxy/zordon-ui/breadcrumbs';
@Component({
  selector: 'docs-breadcrumbs-daisy-styles',
  template: '',
  styleUrl: './breadcrumbs-daisy-fixture.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class BreadcrumbsDaisyStyles {}
@Component({
  selector: 'docs-breadcrumbs-test-fixture',
  imports: [ZdBreadcrumbs, BreadcrumbsDaisyStyles],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './breadcrumbs-fixture.css',
  template: `<docs-breadcrumbs-daisy-styles />
    <main data-testid="breadcrumbs-fixture" [dir]="direction()">
      <h1>Breadcrumbs</h1>
      <p>Find your place in a workspace hierarchy.</p>
      <div class="controls">
        <button type="button" (click)="mode.set(mode() === 'collapse' ? 'scroll' : 'collapse')">
          Toggle scrolling
        </button>
        <button type="button" (click)="maximum.set(maximum() === 4 ? 3 : 4)">Toggle maximum</button>
        <button type="button" (click)="linked.set(!linked())">Toggle current link</button>
        <button type="button" (click)="separator.set(separator() === '›' ? '/' : '›')">
          Toggle separator
        </button>
        <button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
          Toggle direction
        </button>
      </div>
      <ng-template #home let-item
        ><svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          focusable="false"
        >
          <path d="M3 11 12 3 21 11M5 10V21H19V10M9 21V14H15V21" /></svg
      ></ng-template>
      <zd-breadcrumbs
        [items]="items()"
        [overflow]="mode()"
        [maxItems]="maximum()"
        [linkCurrent]="linked()"
        [separator]="separator()"
        label="Workspace path"
        structuredData
      />
      <section class="destination" id="report" aria-label="Report">
        <h2>Quarterly performance report</h2>
        <p>Your current workspace document.</p>
        <label>Report title <input value="Q3 performance" /></label>
      </section>
    </main>`,
})
export class BreadcrumbsTestFixtureComponent {
  readonly mode = signal<ZdBreadcrumbOverflow>('collapse');
  readonly maximum = signal(4);
  readonly linked = signal(false);
  readonly separator = signal('›');
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly home = viewChild<TemplateRef<ZdBreadcrumbIconContext>>('home');
  readonly items = computed<readonly ZdBreadcrumbItem[]>(() => [
    {
      id: 'home',
      label: 'Workspace home',
      shortLabel: 'Home',
      href: '#home',
      canonicalUrl: 'https://example.com/',
      icon: this.home(),
    },
    {
      id: 'projects',
      label: 'All projects',
      routerLink: ['.'],
      queryParams: { crumb: 'projects' },
      canonicalUrl: 'https://example.com/projects',
    },
    {
      id: 'team',
      label: 'Research and development',
      routerLink: ['.'],
      queryParams: { crumb: 'team' },
      canonicalUrl: 'https://example.com/projects/research',
    },
    {
      id: 'archive',
      label: 'Annual archive',
      href: '#archive',
      canonicalUrl: 'https://example.com/projects/research/archive',
    },
    {
      id: 'reports',
      label: 'Quarterly reports',
      shortLabel: 'Reports',
      routerLink: ['.'],
      queryParams: { crumb: 'reports' },
      canonicalUrl: 'https://example.com/projects/research/archive/reports',
    },
    {
      id: 'report',
      label: 'Quarterly performance report',
      shortLabel: 'Report',
      routerLink: ['.'],
      queryParams: { crumb: 'report' },
      fragment: 'report',
      canonicalUrl: 'https://example.com/projects/research/archive/reports/q3',
    },
  ]);
}
