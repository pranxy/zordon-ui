import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink, RouterLinkActive, type Params, type UrlTree } from '@angular/router';
import { ZdClassNames } from '@pranxy/zordon-ui';
export type ZdDockSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdDockPosition = 'fixed' | 'sticky' | 'static';
export type ZdDockVisibility = 'always' | 'mobile' | 'desktop';
export type ZdDockLabels = 'always' | 'compact' | 'hidden';
export interface ZdDockIconContext {
  readonly $implicit: ZdDockItem;
}
export interface ZdDockItem {
  readonly id: string;
  readonly label: string;
  readonly href?: string;
  readonly routerLink?: string | unknown[] | UrlTree;
  readonly queryParams?: Params;
  readonly fragment?: string;
  readonly disabled?: boolean;
  readonly icon?: TemplateRef<ZdDockIconContext>;
  readonly badge?: string | number;
  /** Include meaningful badge information in the link's accessible name. */
  readonly badgeLabel?: string;
}
@Component({
  selector: 'zd-dock',
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-position]': 'position()',
    '[attr.data-visibility]': 'visibility()',
    '[attr.data-reserve]': 'reserveSpace()',
    '[style.--zd-dock-height]': 'heights[size()]',
  },
  styles: `
    :host {
      display: block;
      min-width: 0;
      --zd-dock-safe-bottom: env(safe-area-inset-bottom, 0px);
    }
    :host[data-position='fixed'][data-reserve='true'] {
      min-block-size: calc(var(--zd-dock-height) + var(--zd-dock-safe-bottom));
    }
    :host[data-position='sticky'] {
      position: sticky;
      bottom: 0;
      z-index: 10;
    }
    nav {
      box-sizing: border-box;
      display: flex;
      flex-wrap: nowrap;
      align-items: stretch;
      justify-content: space-between;
      gap: 0.25rem;
      overflow-x: auto;
      overflow-y: hidden;
      height: calc(var(--zd-dock-height) + var(--zd-dock-safe-bottom));
      padding: 0.25rem max(0.5rem, env(safe-area-inset-right, 0px))
        calc(0.25rem + var(--zd-dock-safe-bottom)) max(0.5rem, env(safe-area-inset-left, 0px));
      z-index: 10;
    }
    nav[data-position='static'] {
      position: static;
    }
    nav[data-position='sticky'] {
      position: static;
    }
    nav > .zd-item {
      box-sizing: border-box;
      display: flex;
      flex: 1 0 4rem;
      max-width: 8rem;
      min-width: 4rem;
      min-height: 2rem;
      height: auto;
      margin: 0;
      padding: 0.15rem 0.35rem 0.45rem;
      gap: 0.1rem;
      text-decoration: none;
      color: inherit;
    }
    nav > .zd-item[aria-disabled='true'] {
      pointer-events: auto;
      color: inherit;
      opacity: 0.65;
      cursor: default;
    }
    .zd-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      flex: none;
    }
    nav[data-size='xs'] .zd-icon {
      width: 1.125rem;
      height: 1.125rem;
    }
    .zd-label {
      display: block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .zd-badge {
      position: absolute;
      inset-block-start: 0;
      inset-inline-end: 0.2rem;
      max-width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 0.25rem;
      border: 1px solid currentColor;
      border-radius: 1rem;
      font-size: 0.65rem;
      line-height: 1.15rem;
      background: var(--color-base-100, Canvas);
    }
    nav[data-labels='hidden'] .zd-item:has(.zd-icon) .zd-label {
      display: none;
    }
    a:focus-visible,
    nav:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: -3px;
    }
    @media (max-width: 40rem) {
      nav[data-labels='compact'] .zd-item:has(.zd-icon) .zd-label {
        display: none;
      }
    }
    @media (width < 48rem) {
      :host[data-visibility='desktop'] {
        display: none;
      }
    }
    @media (width >= 48rem) {
      :host[data-visibility='mobile'] {
        display: none;
      }
    }
    @media (prefers-reduced-motion: reduce), (forced-colors: active) {
      nav,
      .zd-item,
      .zd-item::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }
    }
    @media (forced-colors: active) {
      .zd-item[aria-current='page'] {
        outline: 2px solid Highlight;
        outline-offset: -5px;
      }
    }
  `,
  template: `
    <nav
      [class]="classes()"
      [attr.aria-label]="label()"
      [attr.data-position]="position()"
      [attr.data-labels]="labels()"
      [attr.data-size]="size()"
      tabindex="0"
    >
      @for (item of checked(); track item.id) {
        @if (item.disabled) {
          <span class="zd-item" role="link" aria-disabled="true" [attr.aria-label]="name(item)"
            ><ng-container
              [ngTemplateOutlet]="content"
              [ngTemplateOutletContext]="{ $implicit: item }"
          /></span>
        } @else if (item.routerLink !== undefined) {
          <a
            [routerLink]="item.routerLink"
            [queryParams]="item.queryParams"
            [fragment]="item.fragment"
            [routerLinkActive]="[]"
            [routerLinkActiveOptions]="{ exact: routeExact() }"
            #route="routerLinkActive"
            class="zd-item"
            [class]="active(item, route.isActive) ? activeClass : ''"
            [attr.aria-current]="active(item, route.isActive) ? 'page' : null"
            [attr.aria-label]="name(item)"
            ><ng-container
              [ngTemplateOutlet]="content"
              [ngTemplateOutletContext]="{ $implicit: item }"
          /></a>
        } @else {
          <a
            [href]="item.href"
            class="zd-item"
            [class]="active(item, false) ? activeClass : ''"
            [attr.aria-current]="active(item, false) ? 'page' : null"
            [attr.aria-label]="name(item)"
            ><ng-container
              [ngTemplateOutlet]="content"
              [ngTemplateOutletContext]="{ $implicit: item }"
          /></a>
        }
      }
    </nav>
    <ng-template #content let-item>
      @if (item.icon) {
        <span class="zd-icon" aria-hidden="true"
          ><ng-container
            [ngTemplateOutlet]="item.icon"
            [ngTemplateOutletContext]="{ $implicit: item }"
        /></span>
      }
      <span class="zd-label" [class]="labelClass" aria-hidden="true">{{ item.label }}</span>
      @if (item.badge !== undefined) {
        <span class="zd-badge" aria-hidden="true">{{ item.badge }}</span>
      }
    </ng-template>
  `,
})
export class ZdDock {
  readonly items = input<readonly ZdDockItem[]>([]);
  readonly label = input('Primary navigation');
  readonly size = input<ZdDockSize>('md');
  readonly position = input<ZdDockPosition>('fixed');
  readonly visibility = input<ZdDockVisibility>('always');
  readonly labels = input<ZdDockLabels>('always');
  readonly reserveSpace = input(true, { transform: booleanAttribute });
  readonly routeExact = input(true, { transform: booleanAttribute });
  /** Undefined follows RouterLinkActive; null clears all active markers. */
  readonly activeId = input<string | null>();
  protected readonly heights: Record<ZdDockSize, string> = {
    xs: '3rem',
    sm: '3.5rem',
    md: '4rem',
    lg: '4.5rem',
    xl: '5rem',
  };
  private readonly names = inject(ZdClassNames);
  protected readonly activeClass = this.names.daisyUi('dock-active');
  protected readonly labelClass = this.names.daisyUi('dock-label');
  protected readonly classes = computed(
    () => `${this.names.daisyUi('dock')} ${this.names.daisyUi('dock-' + this.size())}`,
  );
  protected readonly checked = computed(() => {
    const ids = new Set<string>();
    for (const item of this.items()) {
      if (!item.id.trim() || !item.label.trim() || ids.has(item.id))
        throw new RangeError('Dock items require unique nonempty IDs and labels.');
      if (
        (item.href !== undefined && item.routerLink !== undefined) ||
        (!item.disabled && item.href === undefined && item.routerLink === undefined)
      )
        throw new RangeError('Enabled Dock items require exactly one href or routerLink.');
      ids.add(item.id);
    }
    return this.items();
  });
  protected active(item: ZdDockItem, routed: boolean): boolean {
    return this.activeId() === undefined ? routed : this.activeId() === item.id;
  }
  protected name(item: ZdDockItem): string {
    return item.badgeLabel ? `${item.label}, ${item.badgeLabel}` : item.label;
  }
}
