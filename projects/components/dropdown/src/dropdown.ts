import { DOCUMENT } from '@angular/common';
import { MenuItem } from '@angular/aria/menu';
import { Directionality } from '@angular/cdk/bidi';
import { InteractivityChecker } from '@angular/cdk/a11y';
import {
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  numberAttribute,
  output,
  signal,
  untracked,
} from '@angular/core';
import { ZdIdGenerator } from '@pranxy/zordon-ui';
import {
  ɵZdOverlayCoordinator,
  type ZdOverlayHandle,
  type ZdOverlayConnectedPosition,
} from '@pranxy/zordon-ui/internal-overlay';
import { ZdDropdownPanel } from './dropdown-panel';
export { ZdDropdownPanel } from './dropdown-panel';

export type ZdDropdownCloseReason =
  | 'trigger'
  | 'selection'
  | 'backdrop'
  | 'outside-pointer'
  | 'escape'
  | 'programmatic'
  | 'navigation'
  | 'destroy'
  | 'focus'
  | 'hover';
export type ZdDropdownSide = 'top' | 'bottom' | 'start' | 'end';
export type ZdDropdownAlign = 'start' | 'center' | 'end';

@Directive({
  selector: '[zdDropdown]',
  exportAs: 'zdDropdown',
  host: { '[attr.data-zd-dropdown-ready]': 'originReady()' },
})
export class ZdDropdown {
  readonly open = input<boolean | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly mode = input<'content' | 'menu'>('content');
  readonly trigger = input<'click' | 'hover' | 'focus' | 'manual'>('click');
  readonly side = input<ZdDropdownSide>('bottom');
  readonly align = input<ZdDropdownAlign>('start');
  readonly gap = input(4, { transform: numberAttribute });
  readonly autoFlip = input(true, { transform: booleanAttribute });
  readonly closeOnSelection = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly closeOnOutside = input(true, { transform: booleanAttribute });
  readonly closeOnFocus = input(true, { transform: booleanAttribute });
  readonly restoreFocus = input(true, { transform: booleanAttribute });
  readonly initialFocus = input<'first' | 'none'>('none');
  readonly hoverDelay = input(150, { transform: numberAttribute });
  readonly panelClass = input('');
  readonly openChange = output<boolean>();
  readonly closed = output<ZdDropdownCloseReason>();
  readonly selected = output<unknown>();
  private readonly shown = signal(false);
  readonly expanded = this.shown.asReadonly();
  readonly panelId = inject(ZdIdGenerator).next('dropdown');

  private readonly coordinator = inject(ɵZdOverlayCoordinator);
  private readonly direction = inject(Directionality);
  private readonly document = inject(DOCUMENT);
  private readonly checker = inject(InteractivityChecker);
  private readonly injector = inject(Injector);
  private readonly parent = inject(ZdDropdown, { skipSelf: true, optional: true });
  private readonly panel = signal<ZdDropdownPanel | undefined>(undefined);
  private readonly localOpen = signal(false);
  private readonly desired = computed(() => !this.disabled() && (this.open() ?? this.localOpen()));
  private readonly children = new Set<ZdDropdown>();
  private origin?: HTMLButtonElement;
  protected readonly originReady = signal(false);
  private handle: ZdOverlayHandle | null = null;
  private cleanup: (() => void) | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private focusTarget: 'first' | 'last' | 'none' = 'none';
  private reason: ZdDropdownCloseReason = 'programmatic';
  private closeReason: ZdDropdownCloseReason | undefined;
  private restoring = false;

  private readonly teardown = inject(DestroyRef).onDestroy(() => {
    this.reason = 'destroy';
    this.dispose();
    this.parent?.children.delete(this);
  });

  private readonly render = afterRenderEffect(() => {
    const desired = this.desired();
    const panel = this.panel();
    const positions = this.positions();
    this.originReady();
    untracked(() => {
      if (desired && panel && this.origin && !this.handle) this.attach(panel);
      if (!desired && this.handle) {
        this.reason = this.closeReason ?? 'programmatic';
        this.dispose();
      }
      if (desired && this.handle)
        this.coordinator.updatePlacement(this.handle, {
          kind: 'connected',
          origin: this.origin!,
          positions,
        });
    });
  });

  /** Open from a consumer action; controlled roots emit a request. */
  show(): void {
    this.request(true, 'programmatic', this.initialFocus());
  }
  /** Navigation integrations can explicitly supply the navigation close reason. */
  close(reason: ZdDropdownCloseReason = 'programmatic'): void {
    this.request(false, reason);
  }

  /** @internal */
  registerPanel(panel: ZdDropdownPanel): void {
    if (this.panel()) throw new Error('A Dropdown root must own exactly one panel template.');
    this.panel.set(panel);
  }

  /** @internal */
  unregisterPanel(): void {
    this.reason = 'destroy';
    this.dispose();
    this.panel.set(undefined);
  }

  /** @internal */
  registerTrigger(element: HTMLButtonElement): void {
    this.origin = element;
    this.originReady.set(true);
    this.parent?.children.add(this);
  }

  /** @internal */
  unregisterTrigger(element: HTMLButtonElement): void {
    if (this.origin !== element) return;
    this.reason = 'destroy';
    this.dispose();
    this.origin = undefined;
    this.originReady.set(false);
  }

  /** @internal */
  activate(event: Event): void {
    if (this.disabled() || this.origin?.disabled || this.trigger() === 'manual') return;
    event.preventDefault();
    this.request(!this.expanded(), 'trigger', 'first');
  }

  /** @internal */
  key(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
    const expandKey = this.direction.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      (this.parent && event.key === expandKey)
    ) {
      if (this.trigger() === 'manual' || this.disabled() || this.origin?.disabled) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.request(true, 'trigger', event.key === 'ArrowUp' ? 'last' : 'first');
    } else if (this.parent && (event.key === 'Enter' || event.key === ' ')) {
      event.stopImmediatePropagation();
      this.activate(event);
    }
  }

  /** @internal */
  enter(): void {
    this.cancelTimer();
    this.parent?.enter();
    if (this.trigger() === 'hover' && !this.expanded()) {
      this.timer = setTimeout(() => this.request(true, 'hover', 'none'), this.delay());
    }
  }

  /** @internal */
  leave(event: MouseEvent): void {
    this.cancelTimer();
    this.parent?.leave(event);
    if (this.trigger() === 'hover' && !this.contains(event.relatedTarget as Node | null)) {
      this.timer = setTimeout(() => {
        if (!this.contains(this.document.activeElement)) this.request(false, 'hover');
      }, this.delay());
    }
  }

  /** @internal */
  focus(): void {
    if (this.trigger() === 'focus' && !this.restoring) this.request(true, 'focus', 'none');
  }

  /** @internal */
  blur(event: FocusEvent): void {
    if (this.closeOnFocus() && !this.contains(event.relatedTarget as Node | null))
      this.close('focus');
  }

  /** @internal */
  choose(value: unknown): void {
    this.selected.emit(value);
    if (this.closeOnSelection()) {
      this.request(false, 'selection');
      this.parent?.choose(value);
    }
  }

  private request(
    next: boolean,
    reason: ZdDropdownCloseReason,
    focus: 'first' | 'last' | 'none' = 'none',
  ): void {
    this.cancelTimer();
    if (next && this.disabled()) return;
    this.reason = reason;
    this.closeReason = next ? undefined : reason;
    this.focusTarget = focus;
    if (this.desired() === next) return;
    if (this.open() === undefined) this.localOpen.set(next);
    this.openChange.emit(next);
  }

  private attach(panel: ZdDropdownPanel): void {
    this.handle = this.coordinator.open({
      content: { kind: 'template', template: panel.template, viewContainerRef: panel.container },
      placement: { kind: 'connected', origin: this.origin!, positions: this.positions() },
      parent: this.parent?.handle ?? undefined,
      directionality: this.direction,
      panelClass: this.panelClass().split(/\s+/).filter(Boolean),
      captureEscape: true,
      canClose: reason => {
        if (
          (reason === 'escape' && this.closeOnEscape()) ||
          (reason === 'outside-pointer' && this.closeOnOutside())
        )
          this.close(reason);
        // Commit disposal only after controlled state accepts the request.
        return false;
      },
      onCloseRequest: this.close.bind(this),
    });
    if (!this.handle) return;
    this.shown.set(true);
    const pane = this.handle.element;
    pane.id = this.panelId;
    const focusout = (event: FocusEvent) => this.blur(event);
    const keydown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
      const collapseKey = this.direction.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
      if (this.parent && this.mode() === 'menu' && event.key === collapseKey) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.close('escape');
      }
      if (event.key === 'Tab') this.tab(event);
    };
    const enter = () => this.enter();
    const leave = (event: MouseEvent) => this.leave(event);
    pane.addEventListener('focusout', focusout);
    pane.addEventListener('keydown', keydown, true);
    pane.addEventListener('mouseenter', enter);
    pane.addEventListener('mouseleave', leave);
    const focusRef = afterNextRender(
      () => {
        const target =
          this.focusTarget === 'none' && this.reason === 'programmatic'
            ? this.initialFocus()
            : this.focusTarget;
        if (target === 'none') return;
        const candidates = this.focusables(pane);
        const element = target === 'last' ? candidates.at(-1) : candidates[0];
        element?.focus();
      },
      { injector: this.injector },
    );
    this.cleanup = () => {
      focusRef.destroy();
      pane.removeEventListener('focusout', focusout);
      pane.removeEventListener('keydown', keydown, true);
      pane.removeEventListener('mouseenter', enter);
      pane.removeEventListener('mouseleave', leave);
    };
  }

  private dispose(): void {
    this.cancelTimer();
    for (const child of this.children) {
      child.reason = 'destroy';
      child.dispose();
    }
    const handle = this.handle;
    if (!handle) return;
    const active = this.document.activeElement;
    const restore =
      this.restoreFocus() &&
      (this.reason === 'escape' || this.reason === 'selection' || this.reason === 'programmatic') &&
      (this.contains(active) || active === this.document.body);
    this.cleanup?.();
    this.cleanup = undefined;
    this.handle = null;
    handle.finalizeClose();
    this.shown.set(false);
    if (restore && this.origin?.isConnected && !this.origin.disabled) {
      this.restoring = true;
      this.origin.focus();
      this.restoring = false;
    }
    if (this.reason !== 'destroy') this.closed.emit(this.reason);
    this.closeReason = undefined;
  }

  private contains(target: Node | null): boolean {
    return (
      !!target &&
      (!!this.origin?.contains(target) ||
        (!!this.handle && this.coordinator.contains(this.handle, target)) ||
        [...this.children].some(child => child.contains(target)))
    );
  }

  private focusables(scope: HTMLElement): HTMLElement[] {
    return [
      ...scope.querySelectorAll<HTMLElement>('button,a[href],input,select,textarea,[tabindex]'),
    ].filter(
      element => element.getAttribute('role') !== 'menu' && this.checker.isFocusable(element),
    );
  }

  private tab(event: KeyboardEvent): void {
    const pane = this.handle!.element;
    const inside = this.focusables(pane).filter(element => this.checker.isTabbable(element));
    if (
      this.mode() !== 'menu' &&
      (event.shiftKey ? inside[0] : inside.at(-1)) !== this.document.activeElement
    )
      return;
    const root = this.rootDropdown();
    const candidates = this.focusables(this.document.body).filter(
      element =>
        this.checker.isTabbable(element) && (!root.contains(element) || element === root.origin),
    );
    const index = candidates.indexOf(root.origin!);
    event.preventDefault();
    root.close('focus');
    candidates[index + (event.shiftKey ? -1 : 1)]?.focus();
  }

  private positions(): ZdOverlayConnectedPosition[] {
    const side = this.side();
    const align = this.align();
    const gap = Number.isFinite(this.gap()) ? Math.max(0, this.gap()) : 0;
    const position = (side: ZdDropdownSide): ZdOverlayConnectedPosition => {
      if (side === 'top' || side === 'bottom')
        return {
          originX: align,
          overlayX: align,
          originY: side,
          overlayY: side === 'top' ? 'bottom' : 'top',
          offsetY: side === 'top' ? -gap : gap,
        };
      const y = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
      return {
        originX: side,
        overlayX: side === 'start' ? 'end' : 'start',
        originY: y,
        overlayY: y,
        offsetX: (side === 'start' ? -gap : gap) * (this.direction.value === 'rtl' ? -1 : 1),
      };
    };
    const opposite: Record<ZdDropdownSide, ZdDropdownSide> = {
      top: 'bottom',
      bottom: 'top',
      start: 'end',
      end: 'start',
    };
    return this.autoFlip() ? [position(side), position(opposite[side])] : [position(side)];
  }

  private delay(): number {
    return Number.isFinite(this.hoverDelay()) ? Math.max(0, this.hoverDelay()) : 150;
  }
  private rootDropdown(): ZdDropdown {
    return this.parent?.rootDropdown() ?? this;
  }
  private cancelTimer(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
  }
}

@Directive({
  selector: 'button[zdDropdownTrigger]',
  host: {
    'type': 'button',
    '[attr.aria-expanded]': 'root.expanded()',
    '[attr.aria-controls]': 'root.expanded() ? root.panelId : null',
    '[attr.aria-haspopup]': 'root.mode() === "menu" ? "menu" : null',
    '[disabled]': 'root.disabled()',
    '(mouseenter)': 'root.enter()',
    '(mouseleave)': 'root.leave($event)',
    '(focus)': 'root.focus()',
    '(focusout)': 'root.blur($event)',
  },
})
export class ZdDropdownTrigger {
  protected readonly root = inject(ZdDropdown);
  private readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
  private readonly item = inject(MenuItem, { optional: true, self: true });
  private readonly initialize = afterRenderEffect(onCleanup => {
    this.root.registerTrigger(this.element);
    const click = (event: MouseEvent) => {
      event.stopPropagation();
      if (!this.item?.disabled()) this.root.activate(event);
    };
    const key = (event: KeyboardEvent) => {
      if (!this.item?.disabled()) this.root.key(event);
    };
    this.element.addEventListener('click', click, true);
    this.element.addEventListener('keydown', key, true);
    onCleanup(() => {
      this.root.unregisterTrigger(this.element);
      this.element.removeEventListener('click', click, true);
      this.element.removeEventListener('keydown', key, true);
    });
  });
}
