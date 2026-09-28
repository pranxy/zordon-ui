import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ZdBreadcrumbs, type ZdBreadcrumbItem } from '@pranxy/zordon-ui/breadcrumbs';

export interface DocsBreadcrumb {
  readonly label: string;
  /** Omit for the current page. */
  readonly path?: string;
  readonly queryParams?: Readonly<Record<string, string>>;
}

/** The site trail, rendered by Zordon's own Breadcrumbs. */
@Component({
  selector: 'docs-breadcrumbs',
  imports: [ZdBreadcrumbs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<zd-breadcrumbs label="Breadcrumb" separator="/" [items]="trail()" />`,
  styles: `
    :host {
      display: block;
      padding-block: 0.5rem;
      border-block-end: 1px solid var(--docs-border);
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }
  `,
})
export class DocsBreadcrumbsComponent {
  readonly items = input.required<readonly DocsBreadcrumb[]>();

  protected readonly trail = computed<readonly ZdBreadcrumbItem[]>(() =>
    this.items().map((item, index) => ({
      id: `${index}-${item.path ?? 'current'}`,
      label: item.label,
      routerLink: item.path,
      queryParams: item.queryParams,
    })),
  );
}
