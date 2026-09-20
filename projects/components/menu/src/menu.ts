import { NgTemplateOutlet } from '@angular/common';
import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { RouterLink, RouterLinkActive, type Params, type UrlTree } from '@angular/router';
import { ZdClassNames, ZdIdGenerator } from '@pranxy/zordon-ui';

export type ZdMenuSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdMenuOrientation = 'vertical' | 'horizontal';
export interface ZdMenuIconContext {
  readonly $implicit: ZdMenuNode;
}
export interface ZdMenuNode {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly icon?: TemplateRef<ZdMenuIconContext>;
  readonly badge?: string | number;
  readonly badgeLabel?: string;
  /** Display-only hint; this component does not register global shortcuts. */
  readonly shortcut?: string;
  readonly children?: readonly ZdMenuNode[];
}
export interface ZdMenuItem extends ZdMenuNode {
  readonly kind?: 'item' | 'title' | 'separator';
  readonly href?: string;
  readonly routerLink?: string | unknown[] | UrlTree;
  readonly queryParams?: Params;
  readonly fragment?: string;
  readonly children?: readonly ZdMenuItem[];
}

function validateIds(nodes: readonly ZdMenuNode[]): void {
  const ids = new Set<string>();
  const visit = (entries: readonly ZdMenuNode[]): void => {
    for (const node of entries) {
      if (!node.id.trim() || !node.label.trim() || ids.has(node.id))
        throw new RangeError('Menu nodes require unique nonempty IDs and labels.');
      ids.add(node.id);
      visit(node.children ?? []);
    }
  };
  visit(nodes);
}
function name(node: ZdMenuNode): string {
  return node.badgeLabel ? `${node.label}, ${node.badgeLabel}` : node.label;
}
function expanded(ids: readonly string[], id: string, open: boolean): readonly string[] {
  return open ? [...ids.filter(value => value !== id), id] : ids.filter(value => value !== id);
}

/** Native navigation lists, with controlled inline disclosure. */
@Component({
  selector: 'zd-menu',
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './menu.css',
  template: `<nav [attr.aria-label]="label()">
      <ul [class]="classes()" [attr.data-orientation]="orientation()">
        <ng-container
          [ngTemplateOutlet]="entries"
          [ngTemplateOutletContext]="{ $implicit: checked() }"
        />
      </ul>
    </nav>
    <ng-template #entries let-items>
      @for (item of items; track item.id) {
        @if (item.kind === 'title') {
          <li [class]="titleClass" data-zd-menu-title>
            <span>{{ item.label }}</span>
          </li>
        } @else if (item.kind === 'separator') {
          <li><hr /></li>
        } @else {
          <li>
            @if (item.children?.length) {
              <button
                type="button"
                class="zd-row"
                [disabled]="item.disabled"
                [attr.aria-label]="itemName(item)"
                [attr.aria-expanded]="expandedIds().includes(item.id)"
                [attr.aria-controls]="groupId(item.id)"
                (click)="toggle(item)"
              >
                <ng-container
                  [ngTemplateOutlet]="content"
                  [ngTemplateOutletContext]="{ $implicit: item }"
                /><span aria-hidden="true">{{ expandedIds().includes(item.id) ? '−' : '+' }}</span>
              </button>
              <ul [id]="groupId(item.id)" [hidden]="!expandedIds().includes(item.id)">
                <ng-container
                  [ngTemplateOutlet]="entries"
                  [ngTemplateOutletContext]="{ $implicit: item.children }"
                />
              </ul>
            } @else if (item.disabled) {
              <span
                class="zd-row"
                role="link"
                aria-disabled="true"
                [attr.aria-label]="itemName(item)"
                ><ng-container
                  [ngTemplateOutlet]="content"
                  [ngTemplateOutletContext]="{ $implicit: item }"
              /></span>
            } @else if (item.routerLink !== undefined) {
              <a
                class="zd-row"
                [routerLink]="item.routerLink"
                [queryParams]="item.queryParams"
                [fragment]="item.fragment"
                [routerLinkActive]="[]"
                [routerLinkActiveOptions]="{ exact: routeExact() }"
                #route="routerLinkActive"
                [class]="active(item, route.isActive) ? activeClass : ''"
                [attr.aria-current]="active(item, route.isActive) ? 'page' : null"
                [attr.aria-label]="itemName(item)"
                ><ng-container
                  [ngTemplateOutlet]="content"
                  [ngTemplateOutletContext]="{ $implicit: item }"
              /></a>
            } @else {
              <a
                class="zd-row"
                [href]="item.href"
                [class]="active(item, false) ? activeClass : ''"
                [attr.aria-current]="active(item, false) ? 'page' : null"
                [attr.aria-label]="itemName(item)"
                ><ng-container
                  [ngTemplateOutlet]="content"
                  [ngTemplateOutletContext]="{ $implicit: item }"
              /></a>
            }
          </li>
        }
      }
    </ng-template>
    <ng-template #content let-item>
      @if (item.icon) {
        <span class="zd-icon" aria-hidden="true"
          ><ng-container
            [ngTemplateOutlet]="item.icon"
            [ngTemplateOutletContext]="{ $implicit: item }"
        /></span>
      }
      <span class="zd-label" aria-hidden="true">{{ item.label }}</span>
      @if (item.badge !== undefined) {
        <span class="zd-badge" aria-hidden="true">{{ item.badge }}</span>
      }
      @if (item.shortcut) {
        <kbd aria-hidden="true">{{ item.shortcut }}</kbd>
      }
    </ng-template>`,
})
export class ZdMenu {
  readonly items = input<readonly ZdMenuItem[]>([]);
  readonly label = input('Navigation');
  readonly size = input<ZdMenuSize>('md');
  readonly orientation = input<ZdMenuOrientation>('vertical');
  readonly expandedIds = model<readonly string[]>([]);
  readonly activeId = input<string | null>();
  readonly routeExact = input(true, { transform: booleanAttribute });
  private readonly names = inject(ZdClassNames);
  private readonly id = inject(ZdIdGenerator).next('menu');
  protected readonly titleClass = this.names.daisyUi('menu-title');
  protected readonly activeClass = this.names.daisyUi('menu-active');
  protected readonly itemName: (node: ZdMenuNode) => string = name;
  protected readonly classes = computed(() =>
    ['menu', `menu-${this.size()}`, `menu-${this.orientation()}`]
      .map(value => this.names.daisyUi(value))
      .join(' '),
  );
  protected readonly checked = computed(() => {
    validateIds(this.items());
    const visit = (items: readonly ZdMenuItem[]): void => {
      for (const item of items) {
        if (!item.kind || item.kind === 'item') {
          const destinations =
            Number(item.href !== undefined) + Number(item.routerLink !== undefined);
          if (
            destinations > 1 ||
            (item.children?.length ? destinations > 0 : !item.disabled && destinations !== 1)
          )
            throw new RangeError(
              'Menu leaves require one destination; groups cannot have destinations.',
            );
        }
        visit(item.children ?? []);
      }
    };
    visit(this.items());
    return this.items();
  });
  protected groupId(id: string): string {
    return `${this.id}-${encodeURIComponent(id)}`;
  }
  protected toggle(item: ZdMenuItem): void {
    this.expandedIds.set(
      expanded(this.expandedIds(), item.id, !this.expandedIds().includes(item.id)),
    );
  }
  protected active(item: ZdMenuItem, routed: boolean): boolean {
    return this.activeId() === undefined ? routed : this.activeId() === item.id;
  }
}

/** A selectable hierarchy; Angular Aria owns focus, typeahead and tree semantics. */
@Component({
  selector: 'zd-menu-tree',
  imports: [Tree, TreeItem, TreeItemGroup, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './menu.css',
  template: `<ul
      ngTree
      #tree="ngTree"
      [class]="classes()"
      [attr.aria-label]="label()"
      [orientation]="orientation()"
      [attr.data-orientation]="orientation()"
      [values]="selectedIds()"
      (valuesChange)="selectedIds.set($event)"
      [multi]="multi()"
      [disabled]="disabled()"
      [softDisabled]="false"
      [wrap]="wrap()"
      [typeaheadDelay]="typeaheadDelay()"
    >
      <ng-container
        [ngTemplateOutlet]="nodes"
        [ngTemplateOutletContext]="{ $implicit: checked(), parent: tree }"
      />
    </ul>
    <ng-template #nodes let-items let-parent="parent">
      @for (item of items; track item.id) {
        <li
          ngTreeItem
          #node="ngTreeItem"
          [parent]="parent"
          [value]="item.id"
          [label]="item.label"
          [attr.aria-label]="itemName(item)"
          [disabled]="item.disabled"
          [expanded]="expandedIds().includes(item.id)"
          (expandedChange)="expand(item.id, $event)"
        >
          <span class="zd-row" [class.zd-selected]="node.selected()">
            @if (item.children?.length) {
              <button
                type="button"
                class="zd-expander"
                tabindex="-1"
                [attr.aria-label]="'Toggle ' + item.label"
                [attr.aria-expanded]="node.expanded()"
                [disabled]="item.disabled || disabled()"
                (pointerdown)="$event.stopPropagation()"
                (click)="
                  expand(item.id, !node.expanded()); node.element.focus(); $event.stopPropagation()
                "
              >
                <span aria-hidden="true">{{ node.expanded() ? '−' : '+' }}</span>
              </button>
            }
            @if (item.icon) {
              <span class="zd-icon" aria-hidden="true"
                ><ng-container
                  [ngTemplateOutlet]="item.icon"
                  [ngTemplateOutletContext]="{ $implicit: item }"
              /></span>
            }
            <span class="zd-label" aria-hidden="true">{{ item.label }}</span>
            @if (item.badge !== undefined) {
              <span class="zd-badge" aria-hidden="true">{{ item.badge }}</span>
            }
            @if (item.shortcut) {
              <kbd aria-hidden="true">{{ item.shortcut }}</kbd>
            }
          </span>
          @if (item.children?.length) {
            <ul role="group">
              <ng-template ngTreeItemGroup [ownedBy]="node" #group="ngTreeItemGroup"
                ><ng-container
                  [ngTemplateOutlet]="nodes"
                  [ngTemplateOutletContext]="{ $implicit: item.children, parent: group }"
              /></ng-template>
            </ul>
          }
        </li>
      }
    </ng-template>`,
})
export class ZdMenuTree {
  readonly items = input<readonly ZdMenuNode[]>([]);
  readonly label = input('Items');
  readonly size = input<ZdMenuSize>('md');
  readonly orientation = input<ZdMenuOrientation>('vertical');
  readonly selectedIds = model<string[]>([]);
  readonly expandedIds = model<readonly string[]>([]);
  readonly multi = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly wrap = input(true, { transform: booleanAttribute });
  readonly typeaheadDelay = input(500);
  private readonly names = inject(ZdClassNames);
  protected readonly itemName: (node: ZdMenuNode) => string = name;
  protected readonly classes = computed(() =>
    ['menu', `menu-${this.size()}`, `menu-${this.orientation()}`]
      .map(value => this.names.daisyUi(value))
      .join(' '),
  );
  protected readonly checked = computed(() => {
    validateIds(this.items());
    return this.items();
  });
  protected expand(id: string, open: boolean): void {
    this.expandedIds.set(expanded(this.expandedIds(), id, open));
  }
}
