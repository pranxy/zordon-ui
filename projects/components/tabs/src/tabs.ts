import { NgTemplateOutlet } from '@angular/common';
import { Tab, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ZdClassNames, type ZdOrientation, type ZdSize } from '@pranxy/zordon-ui';

export interface ZdTabItem {
  readonly id: string;
  readonly label: string;
  readonly content?: string;
  readonly disabled?: boolean;
  readonly closable?: boolean;
}
export type ZdTabsVariant = 'box' | 'border' | 'lift';
export type ZdTabsActivation = 'automatic' | 'manual';
export interface ZdTabContentContext {
  readonly $implicit: ZdTabItem;
  readonly active: boolean;
}
export interface ZdTabClose {
  readonly id: string;
  readonly nextId: string | null;
}
export interface ZdTabReorder {
  readonly id: string;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly items: readonly ZdTabItem[];
}
export interface ZdTabsLabels {
  readonly close: (label: string) => string;
  readonly earlier: (label: string) => string;
  readonly later: (label: string) => string;
}

/** The panel template is instantiated per item, with lifecycle owned by ZdTabs. */
@Directive({ selector: 'ng-template[zdTabContent]' })
export class ZdTabContent {
  readonly template = inject<TemplateRef<ZdTabContentContext>>(TemplateRef);
  static ngTemplateContextGuard(
    _directive: ZdTabContent,
    context: unknown,
  ): context is ZdTabContentContext {
    return true;
  }
}

/** Host composition gives accepted attributes precedence over Aria's initial host state. */
@Directive({
  selector: '[zdTabsTrigger]',
  hostDirectives: [{ directive: Tab, inputs: ['value', 'disabled'] }],
  host: {
    '[attr.aria-selected]': 'zdSelected()',
    '[attr.tabindex]': '(zdReady() ? aria.active() : zdSelected()) ? 0 : -1',
  },
})
export class TabsTrigger {
  readonly zdSelected = input(false);
  readonly zdReady = input(false);
  protected readonly aria = inject(Tab);
}

@Directive({
  selector: '[zdTabsPanel]',
  hostDirectives: [{ directive: TabPanel, inputs: ['value'] }],
  host: {
    '[hidden]': '!zdVisible()',
    '[attr.inert]': 'zdVisible() ? null : ""',
    '[attr.tabindex]': 'zdVisible() ? 0 : -1',
  },
})
export class TabsPanel {
  readonly zdVisible = input(false);
}

@Component({
  selector: 'zd-tabs',
  imports: [Tabs, TabList, TabsTrigger, TabsPanel, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './tabs.css',
  host: {
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-zd-tabs-ready]': 'ready()',
  },
  template: `
    <div ngTabs class="zd-tabs-root">
      <div
        ngTabList
        #list="ngTabList"
        class="zd-tab-list"
        [class]="classes()"
        [attr.aria-label]="label()"
        [orientation]="orientation()"
        [wrap]="wrap()"
        [softDisabled]="false"
        [disabled]="disabled()"
        [selectionMode]="activation() === 'automatic' ? 'follow' : 'explicit'"
        [selectedTab]="currentId() ?? undefined"
        (keydown)="selection()"
        (pointerdown)="selection()"
      >
        @for (item of checked(); track $index + ':' + item.id) {
          <button
            type="button"
            zdTabsTrigger
            [value]="item.id"
            [disabled]="disabled() || !!item.disabled"
            [attr.disabled]="disabled() || item.disabled ? '' : null"
            [class]="tabClass"
            [class.zd-selected]="item.id === currentId()"
            [zdSelected]="item.id === currentId()"
            [zdReady]="ready()"
            (click)="activate(item, $event)"
            (keydown.delete)="remove(item, $event)"
          >
            {{ item.label }}
          </button>
        }
      </div>
      <div class="zd-panels">
        @for (item of checked(); track item.id) {
          <div zdTabsPanel [value]="item.id" [zdVisible]="item.id === currentId()" class="zd-panel">
            @if (
              !lazy() || item.id === currentId() || (preserveContent() && visited().has(item.id))
            ) {
              @if (content(); as content) {
                <ng-container
                  [ngTemplateOutlet]="content.template"
                  [ngTemplateOutletContext]="{ $implicit: item, active: item.id === currentId() }"
                />
              } @else {
                {{ item.content }}
              }
            }
          </div>
        }
      </div>
    </div>
    @if (currentItem(); as item) {
      @if (item.closable || reorderable()) {
        <div class="zd-tab-actions">
          @if (item.closable) {
            <button type="button" [disabled]="disabled()" (click)="remove(item, $event)">
              {{ labels().close(item.label) }}
            </button>
          }
          @if (reorderable()) {
            <button
              type="button"
              [disabled]="disabled() || currentIndex() === 0"
              (click)="move(-1)"
            >
              {{ labels().earlier(item.label) }}
            </button>
            <button
              type="button"
              [disabled]="disabled() || currentIndex() === checked().length - 1"
              (click)="move(1)"
            >
              {{ labels().later(item.label) }}
            </button>
          }
        </div>
      }
    }
  `,
})
export class ZdTabs {
  readonly items = input<readonly ZdTabItem[]>([]);
  /** Null selects the first enabled item. Invalid/removed IDs also fall back without emitting. */
  readonly activeId = input<string | null>(null);
  readonly activeIdChange = output<string>();
  readonly closeRequest = output<ZdTabClose>();
  readonly reorder = output<ZdTabReorder>();
  readonly label = input('Tabs');
  readonly variant = input<ZdTabsVariant>('border');
  readonly size = input<ZdSize>('md');
  readonly orientation = input<ZdOrientation>('horizontal');
  readonly activation = input<ZdTabsActivation>('automatic');
  readonly wrap = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly lazy = input(true, { transform: booleanAttribute });
  readonly preserveContent = input(false, { transform: booleanAttribute });
  readonly reorderable = input(false, { transform: booleanAttribute });
  /** Opt in to Router-owned selection using this query parameter. */
  readonly queryParam = input<string | null>(null);
  readonly labels = input<ZdTabsLabels>({
    close: label => `Close ${label}`,
    earlier: label => `Move ${label} earlier`,
    later: label => `Move ${label} later`,
  });
  private readonly names = inject(ZdClassNames);
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly router = inject(Router, { optional: true });
  private readonly params = toSignal(this.route?.queryParamMap ?? of(convertToParamMap({})), {
    initialValue: convertToParamMap({}),
  });
  private readonly list = viewChild.required(TabList);
  private readonly tabs = viewChildren(Tab);
  protected readonly content = contentChild(ZdTabContent);
  protected readonly ready = signal(false);
  protected readonly visited = signal<ReadonlySet<string>>(new Set());
  private readonly pendingFocus = signal<{ id: string; order: string } | null>(null);
  protected readonly tabClass = this.names.daisyUi('tab');
  protected readonly classes = computed(() =>
    ['tabs', `tabs-${this.variant()}`, `tabs-${this.size()}`]
      .map(name => this.names.daisyUi(name))
      .join(' '),
  );
  protected readonly checked = computed(() => {
    const ids = new Set<string>();
    for (const item of this.items()) {
      if (!item.id.trim() || !item.label.trim() || ids.has(item.id))
        throw new RangeError('Tabs require unique nonempty IDs and labels.');
      ids.add(item.id);
    }
    return this.items();
  });
  private readonly query = computed(() => {
    const key = this.queryParam();
    if (key !== null) {
      if (!key.trim()) throw new RangeError('Tabs queryParam must be nonempty.');
      if (!this.router || !this.route)
        throw new Error('Tabs query mode requires Router and ActivatedRoute.');
    }
    return key;
  });
  readonly currentId = computed<string | null>(() => {
    const key = this.query();
    const id = key === null ? this.activeId() : this.params().get(key);
    const enabled = this.checked().filter(item => !item.disabled);
    return enabled.find(item => item.id === id)?.id ?? enabled[0]?.id ?? null;
  });
  protected readonly currentIndex = computed(() =>
    this.checked().findIndex(item => item.id === this.currentId()),
  );
  protected readonly currentItem = computed(() => this.checked()[this.currentIndex()]);
  constructor() {
    effect(() => {
      const current = this.currentId();
      const ids = new Set(this.checked().map(item => item.id));
      this.visited.update(
        previous =>
          new Set([...previous, ...(current === null ? [] : [current])].filter(id => ids.has(id))),
      );
    });
    afterRenderEffect(() => {
      this.ready.set(true);
      const current = this.currentId();
      this.tabs();
      untracked(() => {
        if (current !== null) {
          this.list().open(current);
          this.list().selectedTab.set(current);
        }
      });
      const pending = this.pendingFocus();
      if (pending && pending.order !== this.order()) {
        const tab =
          this.tabs().find(tab => tab.value() === pending.id) ??
          this.tabs().find(tab => tab.value() === this.currentId());
        tab?.element.focus();
        this.pendingFocus.set(null);
      }
    });
  }
  protected selection(): void {
    this.request(
      this.tabs()
        .find(tab => tab.selected())
        ?.value(),
    );
  }
  protected request(id: string | undefined): void {
    const current = this.currentId();
    if (id === undefined || id === current) return;
    // Aria's model is optimistic. Restore its public state while awaiting the owner/Router.
    if (current !== null) {
      this.list().open(current);
      this.list().selectedTab.set(current);
    }
    if (this.disabled() || !this.checked().some(item => item.id === id && !item.disabled)) return;
    this.activeIdChange.emit(id);
    const key = this.query();
    if (key !== null)
      void this.router!.navigate([], {
        relativeTo: this.route,
        queryParams: { [key]: id },
        queryParamsHandling: 'merge',
        preserveFragment: true,
      });
  }
  protected activate(item: ZdTabItem, event: MouseEvent): void {
    if (event.detail === 0 && !event.defaultPrevented) this.request(item.id);
  }
  protected remove(item: ZdTabItem, event: Event): void {
    if (this.disabled() || item.disabled || !item.closable) return;
    event.preventDefault();
    const index = this.checked().indexOf(item);
    const next = [
      ...this.checked().slice(index + 1),
      ...this.checked().slice(0, index).reverse(),
    ].find(candidate => !candidate.disabled);
    this.pendingFocus.set({ id: item.id, order: this.order() });
    this.closeRequest.emit({ id: item.id, nextId: next?.id ?? null });
  }
  protected move(offset: -1 | 1): void {
    const fromIndex = this.currentIndex();
    const toIndex = fromIndex + offset;
    if (
      this.disabled() ||
      !this.reorderable() ||
      fromIndex < 0 ||
      toIndex < 0 ||
      toIndex >= this.checked().length
    )
      return;
    const items = [...this.checked()];
    const [item] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, item);
    this.pendingFocus.set({ id: item.id, order: this.order() });
    this.reorder.emit({ id: item.id, fromIndex, toIndex, items });
  }
  private order(): string {
    return JSON.stringify(this.checked().map(item => item.id));
  }
}
