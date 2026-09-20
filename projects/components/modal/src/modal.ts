import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { CdkTrapFocus, InteractivityChecker } from '@angular/cdk/a11y';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  input,
  output,
  PLATFORM_ID,
  signal,
  TemplateRef,
  untracked,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';
import { ɵZdOverlayCoordinator, type ZdOverlayHandle } from '@pranxy/zordon-ui/internal-overlay';

export type ZdModalBackend = 'auto' | 'native' | 'overlay';
export type ZdModalSize = 'sm' | 'md' | 'lg' | 'full';
export type ZdModalPlacement = 'center' | 'top' | 'bottom' | 'start' | 'end';
export type ZdModalReason =
  'close' | 'escape' | 'backdrop' | 'submit' | 'confirm' | 'cancel' | 'destroy';
export interface ZdModalResult<T = unknown> {
  readonly reason: ZdModalReason;
  readonly value?: T;
}
export interface ZdModalContext<T = unknown> {
  readonly $implicit: ZdModalRef<T>;
}
export interface ZdModalOptions<T = unknown> {
  readonly label: string;
  readonly description?: string;
  readonly backend?: ZdModalBackend;
  readonly size?: ZdModalSize;
  readonly placement?: ZdModalPlacement;
  readonly panelClass?: string;
  readonly closeOnEscape?: boolean;
  readonly closeOnBackdrop?: boolean;
  readonly initialFocus?: 'first' | 'dialog';
  readonly beforeClose?: (result: ZdModalResult<T>) => boolean | Promise<boolean>;
  readonly message?: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly errorMessage?: string;
  readonly action?: () => void | Promise<void>;
}

/** One dialog lifetime. Results resolve exactly once, including destruction. */
export class ZdModalRef<T = unknown> {
  private readonly busy = signal(false);
  readonly pending = this.busy.asReadonly();
  private readonly failure = signal<unknown>(null);
  readonly error = this.failure.asReadonly();
  private readonly done = signal(false);
  readonly closed = this.done.asReadonly();
  private resolve!: (result: ZdModalResult<T>) => void;
  readonly result = new Promise<ZdModalResult<T>>(resolve => {
    this.resolve = resolve;
  });
  /** @internal */
  constructor(
    readonly options: ZdModalOptions<T>,
    private readonly dispose: () => void,
  ) {}
  async close(value?: T, reason: ZdModalReason = 'close'): Promise<boolean> {
    if (this.closed() || this.pending()) return false;
    this.busy.set(true);
    this.failure.set(null);
    const result = { value, reason };
    try {
      if (this.options.beforeClose && !(await this.options.beforeClose(result))) return false;
      if (this.closed()) return false;
      this.finish(result);
      return true;
    } catch (error) {
      this.failure.set(error);
      return false;
    } finally {
      this.busy.set(false);
    }
  }
  /** Run an optional confirmation action once; failure leaves the dialog available for retry. */
  async confirm(): Promise<boolean> {
    if (this.closed() || this.pending()) return false;
    this.busy.set(true);
    this.failure.set(null);
    try {
      await this.options.action?.();
    } catch (error) {
      this.failure.set(error);
      this.busy.set(false);
      return false;
    }
    this.busy.set(false);
    return this.close(undefined, 'confirm');
  }
  /** Forced owner teardown bypasses guards and cancels any later async completion. */
  destroy(): void {
    if (!this.closed()) this.finish({ reason: 'destroy' });
  }
  /** @internal Complete an accepted declarative request without running its guard again. */
  accept(result: ZdModalResult<T>): void {
    if (!this.closed()) this.finish(result);
  }
  private finish(result: ZdModalResult<T>): void {
    this.done.set(true);
    this.dispose();
    this.resolve(result);
  }
}

interface SurfaceOwner {
  ref: ZdModalRef;
  native: boolean;
  template: TemplateRef<ZdModalContext> | null;
  ready: (dialog: HTMLDialogElement) => void;
  escape: (event: KeyboardEvent) => void;
}
const OWNER = new InjectionToken<SurfaceOwner>('Zordon Modal surface owner');

@Component({
  selector: 'zd-modal-surface',
  imports: [NgTemplateOutlet, CdkTrapFocus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './modal.css',
  template: `
    <dialog
      #dialog
      class="zd-modal-dialog"
      [class]="boxClass"
      tabindex="-1"
      [attr.open]="owner.native ? null : ''"
      [attr.aria-label]="owner.ref.options.label"
      [attr.aria-description]="owner.ref.options.description ?? null"
      aria-modal="true"
      [attr.aria-busy]="owner.ref.pending()"
      [attr.data-size]="owner.ref.options.size ?? 'md'"
      [attr.data-placement]="owner.ref.options.placement ?? 'center'"
      [attr.data-native]="owner.native"
      [cdkTrapFocus]="!owner.native"
      [cdkTrapFocusAutoCapture]="false"
      (cancel)="cancel($event)"
      (close)="nativeClosed()"
      (keydown)="owner.escape($event)"
      (pointerdown)="rememberPointer($event)"
      (click)="backdrop($event)"
      (submit)="submit($event)"
    >
      @if (owner.template) {
        <ng-container
          [ngTemplateOutlet]="owner.template"
          [ngTemplateOutletContext]="{ $implicit: owner.ref }"
        />
      } @else {
        <h2>{{ owner.ref.options.label }}</h2>
        <p>{{ owner.ref.options.message }}</p>
        <div class="zd-modal-actions">
          <button
            type="button"
            [disabled]="owner.ref.pending()"
            (click)="owner.ref.close(undefined, 'cancel')"
          >
            {{ owner.ref.options.cancelLabel ?? 'Cancel' }}
          </button>
          <button type="button" [disabled]="owner.ref.pending()" (click)="owner.ref.confirm()">
            {{ owner.ref.options.confirmLabel ?? 'Confirm' }}
          </button>
        </div>
      }
      @if (owner.ref.error()) {
        <p role="alert">
          {{
            owner.ref.options.errorMessage ?? 'Unable to complete this action. Please try again.'
          }}
        </p>
      }
    </dialog>
  `,
})
class ZdModalSurface {
  protected readonly owner = inject(OWNER);
  protected readonly boxClass = inject(ZdClassNames).daisyUi('modal-box');
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  protected pointerOutside = false;
  protected rememberPointer(event: MouseEvent): void {
    this.pointerOutside = this.outside(event);
  }
  private readonly ready = afterNextRender(() => this.owner.ready(this.dialog().nativeElement));
  protected cancel(event: Event): void {
    event.preventDefault();
    if (this.owner.ref.options.closeOnEscape !== false)
      void this.owner.ref.close(undefined, 'escape');
  }
  protected nativeClosed(): void {
    this.owner.ref.destroy();
  }
  protected outside(event: MouseEvent): boolean {
    const dialog = this.dialog().nativeElement,
      r = dialog.getBoundingClientRect();
    return (
      event.target === dialog &&
      (event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom)
    );
  }
  protected backdrop(event: MouseEvent): void {
    if (
      this.pointerOutside &&
      this.outside(event) &&
      this.owner.ref.options.closeOnBackdrop !== false
    )
      void this.owner.ref.close(undefined, 'backdrop');
    this.pointerOutside = false;
  }
  protected submit(event: Event): void {
    const form = event.target as HTMLFormElement;
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;
    if ((submitter?.getAttribute('formmethod') ?? form.getAttribute('method')) === 'dialog') {
      event.preventDefault();
      void this.owner.ref.close(undefined, 'submit');
    }
  }
}

interface Entry {
  ref: ZdModalRef;
  handle: ZdOverlayHandle;
  injector: Injector & { destroy(): void };
  dialog?: HTMLDialogElement;
  origin: HTMLElement | null;
  ownerCleanup: () => void;
}

/** Root-scoped dialog ownership, nesting, background isolation and queue. */
@Injectable({ providedIn: 'root' })
export class ZdModalService {
  private readonly coordinator = inject(ɵZdOverlayCoordinator);
  private readonly document = inject(DOCUMENT);
  private readonly platform = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private readonly checker = inject(InteractivityChecker);
  private readonly container = inject(OverlayContainer);
  private readonly entries: Entry[] = [];
  private readonly hidden = new Map<HTMLElement, { inert: boolean; aria: string | null }>();
  private queue: Promise<unknown> = Promise.resolve();
  private destroyed = false;
  private readonly teardown = inject(DestroyRef).onDestroy(() => {
    this.destroyed = true;
    for (const entry of [...this.entries].reverse()) entry.ref.destroy();
  });
  open<T = unknown>(
    template: TemplateRef<ZdModalContext<T>> | null,
    options: ZdModalOptions<T>,
    viewContainerRef?: ViewContainerRef,
  ): ZdModalRef<T> {
    if (this.destroyed || !isPlatformBrowser(this.platform))
      throw new Error(
        'Modal service opening requires a live browser application. Open after rendering.',
      );
    const owner = viewContainerRef?.injector.get(DestroyRef);
    if (owner?.destroyed) throw new Error('Modal view owner has already been destroyed.');
    const native =
      options.backend !== 'overlay' &&
      typeof this.document.createElement('dialog').showModal === 'function';
    if (options.backend === 'native' && !native)
      throw new Error('Native dialog is unavailable; use auto or overlay mode.');
    const origin = this.document.activeElement as HTMLElement | null;
    const ref = new ZdModalRef<T>(options, () => this.dispose(entry));
    const child = Injector.create({
      parent: viewContainerRef?.injector ?? this.injector,
      providers: [
        {
          provide: OWNER,
          useValue: {
            ref: ref as ZdModalRef,
            native,
            template: template as TemplateRef<ZdModalContext> | null,
            escape: (event: KeyboardEvent) => {
              if (this.coordinator.dispatchEscape(entry.handle, event)) event.stopPropagation();
            },
            ready: (dialog: HTMLDialogElement) => {
              entry.dialog = dialog;
              if (native) dialog.showModal();
              this.isolate();
              const target =
                options.initialFocus === 'dialog'
                  ? dialog
                  : ([
                      ...dialog.querySelectorAll<HTMLElement>(
                        '[autofocus],button,input,select,textarea,a[href],[tabindex]',
                      ),
                    ].find(element => this.checker.isTabbable(element)) ?? dialog);
              target.focus();
            },
          } satisfies SurfaceOwner,
        },
      ],
    });
    const place = options.placement ?? 'center';
    const entry: Entry = {
      ref: ref as ZdModalRef,
      handle: null!,
      injector: child,
      origin,
      ownerCleanup: () => {},
    };
    try {
      entry.handle = this.coordinator.open({
        content: {
          kind: 'component',
          component: ZdModalSurface,
          injector: child,
          viewContainerRef,
        },
        placement: {
          kind: 'global',
          vertical: place === 'top' || place === 'bottom' ? place : 'center',
          horizontal: place === 'start' || place === 'end' ? place : 'center',
        },
        origin: origin ?? undefined,
        scrollPolicy: 'block',
        hasBackdrop: !native,
        backdropClass: 'zd-modal-backdrop',
        panelClass: ['zd-modal-pane', options.panelClass ?? ''],
        canClose: reason => {
          if (reason === 'escape' && options.closeOnEscape !== false)
            void ref.close(undefined, 'escape');
          if (reason === 'backdrop' && options.closeOnBackdrop !== false)
            void ref.close(undefined, 'backdrop');
          return false;
        },
        onCloseRequest: () => ref.destroy(),
      })!;
    } catch (error) {
      child.destroy();
      throw error;
    }
    this.entries.push(entry);
    if (owner) entry.ownerCleanup = owner.onDestroy(() => ref.destroy());
    return ref;
  }
  confirm(options: ZdModalOptions, viewContainerRef?: ViewContainerRef): Promise<boolean> {
    return this.open(null, options, viewContainerRef).result.then(
      result => result.reason === 'confirm',
    );
  }
  enqueue<T = unknown>(
    template: TemplateRef<ZdModalContext<T>> | null,
    options: ZdModalOptions<T>,
    viewContainerRef?: ViewContainerRef,
  ): Promise<ZdModalResult<T>> {
    const queued = this.queue.then(() => this.open(template, options, viewContainerRef).result);
    this.queue = queued.catch(() => undefined);
    return queued;
  }
  private dispose(entry: Entry): void {
    const index = this.entries.indexOf(entry);
    for (const child of this.entries.slice(index + 1).reverse()) child.ref.destroy();
    this.entries.splice(index, 1);
    entry.ownerCleanup();
    entry.handle.finalizeClose();
    entry.injector.destroy();
    this.isolate();
    if (entry.origin?.isConnected && this.checker.isFocusable(entry.origin)) entry.origin.focus();
  }
  private isolate(): void {
    for (const [element, saved] of this.hidden) {
      if (element.inert) element.inert = saved.inert;
      if (element.getAttribute('aria-hidden') === 'true') {
        if (saved.aria === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', saved.aria);
      }
    }
    this.hidden.clear();
    if (!this.entries.length) return;
    const hide = (element: HTMLElement) => {
      this.hidden.set(element, { inert: element.inert, aria: element.getAttribute('aria-hidden') });
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    };
    for (const element of [...this.document.body.children])
      if (element instanceof HTMLElement && element !== this.container.getContainerElement())
        hide(element);
    for (const entry of this.entries.slice(0, -1)) hide(entry.handle.element);
  }
}

/** Declarative lazy modal template; options are captured for each opening. */
@Directive({ selector: 'ng-template[zdModal]', exportAs: 'zdModal' })
export class ZdModal<T = unknown> {
  readonly open = input(false);
  readonly options = input.required<ZdModalOptions<T>>();
  readonly openChange = output<boolean>();
  readonly closed = output<ZdModalResult<T>>();
  private readonly template = inject<TemplateRef<ZdModalContext<T>>>(TemplateRef);
  private readonly container = inject(ViewContainerRef);
  private readonly service = inject(ZdModalService);
  private ref: ZdModalRef<T> | undefined;
  private alive = true;
  private requested: ZdModalResult<T> | undefined;
  private readonly teardown = inject(DestroyRef).onDestroy(() => {
    this.alive = false;
    this.ref?.destroy();
  });
  private readonly render = afterRenderEffect(() => {
    const open = this.open();
    const options = this.options();
    untracked(() => {
      if (open && !this.ref) {
        const ref = this.service.open(
          this.template,
          {
            ...options,
            beforeClose: async result => {
              if (!options.beforeClose || (await options.beforeClose(result))) {
                this.requested = result;
                this.openChange.emit(false);
              }
              return false;
            },
          },
          this.container,
        );
        this.ref = ref;
        void ref.result.then(result => {
          if (this.alive) this.closed.emit(result);
        });
      } else if (!open && this.ref) {
        this.ref.accept(this.requested ?? { reason: 'close' });
        this.ref = undefined;
        this.requested = undefined;
      }
    });
  });
  static ngTemplateContextGuard<U>(
    _directive: ZdModal<U>,
    context: unknown,
  ): context is ZdModalContext<U> {
    return true;
  }
}
