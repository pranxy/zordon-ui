import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injectable,
  input,
  PLATFORM_ID,
  signal,
  TemplateRef,
} from '@angular/core';
import { ZdClassNames, ZdIdGenerator } from '@pranxy/zordon-ui';
import { ZdAlert } from '@pranxy/zordon-ui/alert';

export type ZdToastPosition = `${'top' | 'middle' | 'bottom'}-${'start' | 'center' | 'end'}`;
export type ZdToastPriority = 'off' | 'polite' | 'assertive';
export interface ZdToastAction {
  readonly label: string;
  readonly run: () => void | Promise<void>;
  readonly errorMessage: string;
}
export interface ZdToastOptions {
  readonly message: string;
  readonly color?: 'info' | 'success' | 'warning' | 'error';
  readonly position?: ZdToastPosition;
  /** Zero persists. Actions persist by default; other messages default to 5000ms. */
  readonly duration?: number;
  readonly priority?: ZdToastPriority;
  readonly key?: string;
  readonly dismissLabel?: string;
  readonly action?: ZdToastAction;
  readonly template?: TemplateRef<ZdToastContext>;
}
export interface ZdToastItem extends ZdToastOptions {
  readonly id: string;
  readonly revision: number;
  readonly pending: boolean;
  readonly position: ZdToastPosition;
  readonly duration: number;
  readonly priority: ZdToastPriority;
  readonly dismissLabel: string;
}
export interface ZdToastContext {
  readonly $implicit: ZdToastItem;
}
export interface ZdToastFlow<T> {
  readonly loading: ZdToastOptions;
  readonly success: (value: T) => ZdToastOptions;
  readonly error: (error: unknown) => ZdToastOptions;
}
function normalize(options: ZdToastOptions) {
  const duration = options.duration ?? (options.action ? 0 : 5000);
  if (
    !options.message.trim() ||
    options.key === '' ||
    options.dismissLabel === '' ||
    (options.action && (!options.action.label.trim() || !options.action.errorMessage.trim()))
  )
    throw new RangeError('Toast messages and action labels must be nonempty.');
  if (!Number.isFinite(duration) || duration < 0 || duration > 2147483647)
    throw new RangeError('Toast duration must be between 0 and 2147483647 milliseconds.');
  return {
    ...options,
    duration,
    position: options.position ?? 'bottom-end',
    priority: options.priority ?? 'polite',
    dismissLabel: options.dismissLabel ?? 'Dismiss notification',
  };
}

/** Scoped notification state. Mount one outlet per service instance. */
@Injectable({ providedIn: 'root' })
export class ZdToastService {
  private readonly state = signal<readonly ZdToastItem[]>([]);
  readonly items = this.state.asReadonly();
  private readonly ids = inject(ZdIdGenerator);
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly origins = new Map<string, HTMLElement | null>();
  private outlet: HTMLElement | null = null;
  constructor() {
    inject(DestroyRef).onDestroy(() => this.clear());
  }
  show(options: ZdToastOptions): string {
    const normalized = normalize(options);
    const duplicate = options.key && this.items().find(item => item.key === options.key);
    if (duplicate) return duplicate.id;
    if (this.items().length >= 100) throw new RangeError('Toast queue is limited to 100 messages.');
    const id = this.ids.next('toast');
    this.origins.set(id, this.browser ? (this.document.activeElement as HTMLElement | null) : null);
    this.state.update(items => [...items, { ...normalized, id, revision: 0, pending: false }]);
    return id;
  }
  /** Replace options. Unchanged durations retain their remaining visible time. */
  update(id: string, options: ZdToastOptions): boolean {
    const item = this.items().find(item => item.id === id);
    if (!item) return false;
    const normalized = normalize(options);
    if (
      normalized.key &&
      this.items().some(other => other.id !== id && other.key === normalized.key)
    )
      throw new RangeError('Toast key is already in use.');
    this.state.update(items =>
      items.map(other =>
        other.id === id
          ? { ...normalized, id, revision: item.revision + 1, pending: false }
          : other,
      ),
    );
    return true;
  }
  dismiss(id: string): boolean {
    if (!this.items().some(item => item.id === id)) return false;
    if (this.browser) {
      const row = this.document.getElementById(id);
      if (row?.contains(this.document.activeElement)) {
        const origin = this.origins.get(id);
        if (origin?.isConnected) origin.focus();
        if (row.contains(this.document.activeElement)) this.outlet?.focus();
      }
    }
    this.origins.delete(id);
    this.state.update(items => items.filter(item => item.id !== id));
    return true;
  }
  clear(): void {
    for (const item of this.items()) this.dismiss(item.id);
  }
  async act(id: string): Promise<boolean> {
    const item = this.items().find(item => item.id === id);
    if (!item?.action || item.pending) return false;
    this.state.update(items =>
      items.map(other => (other.id === id ? { ...other, pending: true } : other)),
    );
    try {
      await item.action.run();
      if (this.items().find(other => other.id === id)?.revision === item.revision) this.dismiss(id);
      return true;
    } catch {
      if (this.items().find(other => other.id === id)?.revision === item.revision)
        this.update(id, {
          ...item,
          message: item.action.errorMessage,
          priority: 'assertive',
          duration: 0,
        });
      return false;
    }
  }
  /** Track an independent task; dismissal or manual update prevents stale settlement from replacing it. */
  async track<T>(work: Promise<T>, flow: ZdToastFlow<T>): Promise<T> {
    const id = this.show({ ...flow.loading, key: undefined, duration: 0 });
    try {
      const result = await work;
      if (this.items().find(item => item.id === id)?.revision === 0)
        this.update(id, flow.success(result));
      return result;
    } catch (error) {
      if (this.items().find(item => item.id === id)?.revision === 0)
        this.update(id, flow.error(error));
      throw error;
    }
  }
  /** @internal Outlet ownership and teardown; not an application integration API. */
  attach(element: HTMLElement): () => void {
    if (this.outlet) throw new Error('Mount only one Toast outlet per service instance.');
    this.outlet = element;
    return () => {
      this.clear();
      this.outlet = null;
    };
  }
}

/** A declarative non-blocking fixed outlet with pre-existing local announcement regions. */
@Component({
  selector: 'zd-toast-outlet',
  exportAs: 'zdToastOutlet',
  imports: [ZdAlert, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'role': 'region', 'tabindex': '-1', '[attr.aria-label]': 'label()' },
  styles: `
    :host {
      display: block;
    }
    .zd-toast-stack {
      z-index: 1000;
      pointer-events: none;
    }
    .zd-toast-stack > zd-alert {
      pointer-events: auto;
      inline-size: min(24rem, calc(100vw - 2rem));
      box-sizing: border-box;
    }
    .zd-toast-stack[data-inline='center'] {
      left: 50%;
      right: auto;
      --toast-x: -50%;
    }
    .zd-toast-action {
      font: inherit;
      color: inherit;
      background: transparent;
      border: 1px solid currentColor;
      border-radius: 0.5rem;
      padding: 0.5rem 0.75rem;
      min-block-size: 2.75rem;
      cursor: pointer;
    }
    .zd-toast-action:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
    .zd-toast-message {
      overflow-wrap: anywhere;
    }
    .zd-toast-live {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    @media (prefers-reduced-motion: reduce), (forced-colors: active) {
      .zd-toast-stack > zd-alert {
        animation: none !important;
        transition: none !important;
      }
    }
  `,
  template: `
    <span class="zd-toast-live" role="status" aria-atomic="true">
      @for (item of polite(); track item.id + ':' + item.revision) {
        <span>{{ item.message }} </span>
      }
    </span>
    <span class="zd-toast-live" role="alert" aria-atomic="true">
      @for (item of assertive(); track item.id + ':' + item.revision) {
        <span>{{ item.message }} </span>
      }
    </span>
    @for (group of groups(); track group.position) {
      <div
        class="zd-toast-stack"
        [class]="group.classes"
        [attr.data-inline]="group.inline"
        [attr.data-position]="group.position"
      >
        @for (item of group.items; track item.id) {
          <zd-alert
            [id]="item.id"
            [attr.data-zd-toast-id]="item.id"
            [color]="item.color"
            direction="horizontal"
            dismissible
            [dismissLabel]="item.dismissLabel"
            [autoDismiss]="item.pending ? 0 : item.duration"
            (dismissRequested)="service.dismiss(item.id)"
          >
            @if (item.template) {
              <ng-container
                [ngTemplateOutlet]="item.template"
                [ngTemplateOutletContext]="{ $implicit: item }"
              />
            } @else {
              <span class="zd-toast-message">{{ item.message }}</span>
            }
            @if (item.action) {
              <button
                zdAlertActions
                type="button"
                class="zd-toast-action"
                [attr.aria-disabled]="item.pending"
                [attr.aria-busy]="item.pending"
                (click)="service.act(item.id)"
              >
                {{ item.action.label }}
              </button>
            }
          </zd-alert>
        }
      </div>
    }
  `,
})
export class ZdToastOutlet {
  readonly label = input('Notifications');
  readonly limit = input(3, {
    transform: (value: number) => {
      if (!Number.isInteger(value) || value < 1 || value > 20)
        throw new RangeError('Toast visible limit must be an integer from 1 through 20.');
      return value;
    },
  });
  protected readonly service = inject(ZdToastService);
  private readonly names = inject(ZdClassNames);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly visible = computed(() => this.service.items().slice(0, this.limit()));
  protected readonly groups = computed(() => {
    const groups = new Map<ZdToastPosition, ZdToastItem[]>();
    for (const item of this.visible())
      groups.set(item.position, [...(groups.get(item.position) ?? []), item]);
    return [...groups].map(([position, items]) => {
      const [block, inline] = position.split('-');
      return {
        position,
        inline,
        items,
        classes: ['toast', `toast-${block}`, `toast-${inline}`]
          .map(name => this.names.daisyUi(name))
          .join(' '),
      };
    });
  });
  protected readonly polite = signal<readonly ZdToastItem[]>([]);
  protected readonly assertive = signal<readonly ZdToastItem[]>([]);
  private seen = new Map<string, number>();
  private ready = false;
  constructor() {
    inject(DestroyRef).onDestroy(
      this.service.attach(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement),
    );
    afterRenderEffect(() => {
      const visible = this.visible();
      if (!this.browser) return;
      const changed = visible.filter(item => this.seen.get(item.id) !== item.revision);
      this.seen = new Map(visible.map(item => [item.id, item.revision]));
      if (this.ready && changed.length) {
        this.polite.set(changed.filter(item => item.priority === 'polite'));
        this.assertive.set(changed.filter(item => item.priority === 'assertive'));
      } else if (!visible.length) {
        this.polite.set([]);
        this.assertive.set([]);
      }
      this.ready = true;
    });
  }
}
