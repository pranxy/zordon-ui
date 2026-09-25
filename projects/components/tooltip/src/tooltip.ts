import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import {
  afterEveryRender,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  Injector,
  input,
  numberAttribute,
  output,
  signal,
  TemplateRef,
  untracked,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ZdClassNames, ZdIdGenerator } from '@pranxy/zordon-ui';
import {
  ɵZdOverlayCoordinator,
  type ZdOverlayConnectedPosition,
  type ZdOverlayHandle,
} from '@pranxy/zordon-ui/internal-overlay';

export type ZdTooltipSide = 'top' | 'bottom' | 'start' | 'end';
export type ZdTooltipAlign = 'start' | 'center' | 'end';
export type ZdTooltipColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdTooltipTrigger = 'auto' | 'hover' | 'focus' | 'manual';
export type ZdTooltipCloseReason =
  | 'escape'
  | 'outside-pointer'
  | 'focus'
  | 'hover'
  | 'touch'
  | 'programmatic'
  | 'navigation'
  | 'destroy';

const TOOLTIP_OWNER = new InjectionToken<ZdTooltip>('Zordon Tooltip owner');

@Component({
  selector: 'zd-tooltip-surface',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './tooltip.css',
  host: {
    '[id]': 'owner.id',
    '[class]': 'classes()',
    '[attr.role]': 'owner.tooltipInteractive() ? "dialog" : "tooltip"',
    '[attr.aria-label]': 'owner.tooltipInteractive() ? owner.tooltipLabel() : null',
    '[attr.tabindex]': 'owner.tooltipInteractive() ? -1 : null',
    '[style.--zd-tooltip-bg]': '"var(--color-" + owner.tooltipColor() + ")"',
    '[style.--zd-tooltip-fg]': '"var(--color-" + owner.tooltipColor() + "-content)"',
  },
  template: `
    <div class="zd-tooltip-body">
      @if (template(); as content) {
        <ng-container [ngTemplateOutlet]="content" />
      } @else {
        {{ owner.content() }}
      }
    </div>
    @if (owner.tooltipArrow()) {
      <span class="zd-tooltip-arrow" aria-hidden="true"></span>
    }
  `,
})
class ZdTooltipSurface {
  protected readonly owner = inject(TOOLTIP_OWNER);
  private readonly names = inject(ZdClassNames);
  protected readonly classes = computed(() =>
    [
      this.names.daisyUi('tooltip-content'),
      this.owner.tooltipColor() !== 'neutral' &&
        this.names.daisyUi(`tooltip-${this.owner.tooltipColor()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
  protected readonly template = computed(() => {
    const value = this.owner.content();
    return value instanceof TemplateRef ? value : null;
  });
}

@Directive({
  selector: '[zdTooltip]',
  exportAs: 'zdTooltip',
  host: { '[attr.data-zd-tooltip-ready]': 'ready()' },
})
export class ZdTooltip {
  readonly content = input.required<string | TemplateRef<object>>({ alias: 'zdTooltip' });
  readonly tooltipOpen = input<boolean | undefined>();
  readonly tooltipDisabled = input(false, { transform: booleanAttribute });
  readonly tooltipInteractive = input(false, { transform: booleanAttribute });
  readonly tooltipLabel = input('Help');
  readonly tooltipTrigger = input<ZdTooltipTrigger>('auto');
  readonly tooltipSide = input<ZdTooltipSide>('top');
  readonly tooltipAlign = input<ZdTooltipAlign>('center');
  readonly tooltipColor = input<ZdTooltipColor>('neutral');
  readonly tooltipGap = input(8, { transform: numberAttribute });
  readonly tooltipArrow = input(true, { transform: booleanAttribute });
  readonly tooltipAutoFlip = input(true, { transform: booleanAttribute });
  readonly tooltipShowDelay = input(500, { transform: numberAttribute });
  readonly tooltipHideDelay = input(100, { transform: numberAttribute });
  readonly tooltipTouch = input(true, { transform: booleanAttribute });
  readonly tooltipLongPressDelay = input(500, { transform: numberAttribute });
  readonly tooltipTouchHideDelay = input(1500, { transform: numberAttribute });
  readonly tooltipPanelClass = input('');
  readonly tooltipOpenChange = output<boolean>();
  readonly tooltipClosed = output<ZdTooltipCloseReason>();
  readonly id = inject(ZdIdGenerator).next('tooltip');
  protected readonly ready = signal(false);
  private readonly visible = signal(false);
  readonly expanded = this.visible.asReadonly();
  private readonly local = signal(false);
  private readonly desired = computed(
    () =>
      !this.tooltipDisabled() &&
      (typeof this.content() !== 'string' || (this.content() as string).trim().length > 0) &&
      (this.tooltipOpen() ?? this.local()),
  );
  private readonly origin = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly direction = inject(Directionality);
  private readonly coordinator = inject(ɵZdOverlayCoordinator);
  private readonly checker = inject(InteractivityChecker);
  private readonly container = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  private handle: ZdOverlayHandle | null = null;
  private cleanup: (() => void) | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private hovered = false;
  private paneHovered = false;
  private touching = false;
  private consumedTouch = false;
  private touchStart: { x: number; y: number } | undefined;
  private focusRequested = false;
  private restoring = false;
  private mode = false;
  private closeReason: ZdTooltipCloseReason | undefined;
  private readonly owned = new Map<string, { previous: string | null; last: string | null }>();

  private readonly teardown = inject(DestroyRef).onDestroy(() => {
    this.dispose('destroy');
    this.syncAria(true);
  });
  private readonly policy = afterRenderEffect(() => {
    this.tooltipTrigger();
    this.tooltipDisabled();
    this.tooltipTouch();
    untracked(() => {
      this.cancelTimer();
      this.hovered = false;
      this.touching = false;
      this.consumedTouch = false;
    });
  });
  private readonly render = afterRenderEffect(() => {
    const desired = this.desired();
    const positions = this.positions();
    const mode = this.tooltipInteractive();
    this.content();
    untracked(() => {
      if (this.handle && (!desired || this.mode !== mode)) this.dispose();
      if (desired && !this.handle) this.attach();
      else if (this.handle)
        this.coordinator.updatePlacement(this.handle, {
          kind: 'connected',
          origin: this.origin,
          positions,
        });
    });
  });
  private readonly semantics = afterEveryRender(() => {
    this.syncAria();
  });
  private readonly listeners = afterRenderEffect(onCleanup => {
    const enter = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' && this.hoverEnabled()) {
        this.hovered = true;
        this.schedule(() => this.request(true), this.tooltipShowDelay(), 500);
      }
    };
    const leave = () => {
      this.hovered = false;
      if (this.hoverEnabled()) this.deferHide('hover');
    };
    const focus = () => {
      if (
        !this.restoring &&
        !this.touching &&
        (this.tooltipTrigger() === 'auto' || this.tooltipTrigger() === 'focus')
      )
        this.request(true);
    };
    const blur = (event: FocusEvent) => {
      if (!this.contains(event.relatedTarget as Node | null)) this.deferHide('focus');
    };
    const down = (event: PointerEvent) => {
      this.consumedTouch = false;
      if (
        event.pointerType !== 'touch' ||
        !this.tooltipTouch() ||
        this.tooltipTrigger() === 'manual'
      )
        return;
      this.touching = true;
      this.touchStart = { x: event.clientX, y: event.clientY };
      this.schedule(
        () => {
          this.consumedTouch = true;
          this.request(true);
        },
        this.tooltipLongPressDelay(),
        500,
      );
    };
    const move = (event: PointerEvent) => {
      if (
        this.touchStart &&
        Math.hypot(event.clientX - this.touchStart.x, event.clientY - this.touchStart.y) > 10
      )
        this.cancelTouch();
    };
    const up = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return;
      this.touchStart = undefined;
      this.touching = false;
      this.cancelTimer();
      if (this.consumedTouch)
        this.schedule(() => this.request(false, 'touch'), this.tooltipTouchHideDelay(), 1500);
    };
    const cancel = () => this.cancelTouch();
    const click = (event: MouseEvent) => {
      if (this.consumedTouch) {
        this.consumedTouch = false;
        event.preventDefault();
        event.stopImmediatePropagation();
      } else if (this.tooltipInteractive() && this.tooltipTrigger() !== 'manual')
        this.focusContent();
    };
    const context = (event: MouseEvent) => {
      if (this.consumedTouch) event.preventDefault();
    };
    const key = (event: KeyboardEvent) => {
      if (this.handle && this.coordinator.dispatchEscape(this.handle, event)) {
        event.stopImmediatePropagation();
        return;
      }
      if (
        event.key === 'F2' &&
        this.tooltipInteractive() &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.isComposing &&
        !event.repeat
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.focusContent();
      }
    };
    this.origin.addEventListener('pointerenter', enter);
    this.origin.addEventListener('pointerleave', leave);
    this.origin.addEventListener('focusin', focus);
    this.origin.addEventListener('focusout', blur);
    this.origin.addEventListener('pointerdown', down);
    this.origin.addEventListener('pointermove', move);
    this.origin.addEventListener('pointerup', up);
    this.origin.addEventListener('pointercancel', cancel);
    this.origin.addEventListener('click', click, true);
    this.origin.addEventListener('contextmenu', context);
    this.origin.addEventListener('keydown', key, true);
    this.ready.set(true);
    onCleanup(() => {
      this.origin.removeEventListener('pointerenter', enter);
      this.origin.removeEventListener('pointerleave', leave);
      this.origin.removeEventListener('focusin', focus);
      this.origin.removeEventListener('focusout', blur);
      this.origin.removeEventListener('pointerdown', down);
      this.origin.removeEventListener('pointermove', move);
      this.origin.removeEventListener('pointerup', up);
      this.origin.removeEventListener('pointercancel', cancel);
      this.origin.removeEventListener('click', click, true);
      this.origin.removeEventListener('contextmenu', context);
      this.origin.removeEventListener('keydown', key, true);
    });
  });

  show(): void {
    this.request(true);
  }
  hide(reason: ZdTooltipCloseReason = 'programmatic'): void {
    this.request(false, reason);
  }
  /** Explicit keyboard/programmatic entry into interactive help. */
  focusContent(): void {
    if (!this.tooltipInteractive() || this.tooltipDisabled()) return;
    this.focusRequested = true;
    this.request(true);
    if (this.handle) {
      this.focusRequested = false;
      const surface = this.surface()!;
      (this.focusables(surface)[0] ?? surface).focus();
    }
  }
  private request(next: boolean, reason: ZdTooltipCloseReason = 'programmatic'): void {
    this.cancelTimer();
    if (next && this.tooltipDisabled()) return;
    this.closeReason = next ? undefined : reason;
    if (next === this.desired()) return;
    if (this.tooltipOpen() === undefined) this.local.set(next);
    this.tooltipOpenChange.emit(next);
  }
  private attach(): void {
    this.mode = this.tooltipInteractive();
    const portalInjector = Injector.create({
      parent: this.injector,
      providers: [{ provide: TOOLTIP_OWNER, useValue: this }],
    });
    this.handle = this.coordinator.open({
      content: {
        kind: 'component',
        component: ZdTooltipSurface,
        injector: portalInjector,
        viewContainerRef: this.container,
      },
      placement: { kind: 'connected', origin: this.origin, positions: this.positions() },
      directionality: this.direction,
      panelClass: this.tooltipPanelClass().split(/\s+/).filter(Boolean),
      captureEscape: true,
      onPositionChange: position => this.positioned(position),
      canClose: reason => {
        if (reason === 'escape' || reason === 'outside-pointer') this.hide(reason);
        return false;
      },
      onCloseRequest: () => this.hide(),
    });
    if (!this.handle) {
      portalInjector.destroy();
      return;
    }
    this.visible.set(true);
    const pane = this.handle.element;
    const focus = afterNextRender(
      () => {
        this.syncAria();
        if (this.focusRequested && this.handle && this.tooltipInteractive()) {
          this.focusRequested = false;
          const surface = this.surface()!;
          (this.focusables(surface)[0] ?? surface).focus();
        }
      },
      { injector: this.injector },
    );
    const enter = () => {
      this.paneHovered = true;
      this.cancelTimer();
    };
    const leave = () => {
      this.paneHovered = false;
      if (this.tooltipTrigger() !== 'manual') this.deferHide('hover');
    };
    const blur = (event: FocusEvent) => {
      if (!this.contains(event.relatedTarget as Node | null)) this.deferHide('focus');
    };
    const key = (event: KeyboardEvent) => this.tab(event);
    const resize = new ResizeObserver(() => {
      if (this.handle)
        this.coordinator.updatePlacement(this.handle, {
          kind: 'connected',
          origin: this.origin,
          positions: this.positions(),
        });
    });
    resize.observe(pane);
    pane.addEventListener('pointerenter', enter);
    pane.addEventListener('pointerleave', leave);
    pane.addEventListener('focusout', blur);
    pane.addEventListener('keydown', key);
    this.cleanup = () => {
      focus.destroy();
      resize.disconnect();
      pane.removeEventListener('pointerenter', enter);
      pane.removeEventListener('pointerleave', leave);
      pane.removeEventListener('focusout', blur);
      pane.removeEventListener('keydown', key);
      portalInjector.destroy();
    };
  }
  private dispose(reason: ZdTooltipCloseReason = this.closeReason ?? 'programmatic'): void {
    this.cancelTimer();
    this.focusRequested = false;
    const handle = this.handle;
    if (!handle) return;
    const restore =
      this.mode &&
      (reason === 'escape' || reason === 'programmatic') &&
      handle.element.contains(this.document.activeElement);
    this.cleanup?.();
    this.cleanup = undefined;
    this.handle = null;
    handle.finalizeClose();
    this.visible.set(false);
    this.paneHovered = false;
    if (restore && this.origin.isConnected && this.checker.isFocusable(this.origin)) {
      this.restoring = true;
      this.origin.focus();
      this.restoring = false;
    }
    if (reason !== 'destroy') this.tooltipClosed.emit(reason);
    this.closeReason = undefined;
  }
  private cancelTouch(): void {
    this.cancelTimer();
    this.touchStart = undefined;
    this.touching = false;
    if (this.consumedTouch) {
      this.consumedTouch = false;
      this.hide('touch');
    }
  }
  private hoverEnabled(): boolean {
    return this.tooltipTrigger() === 'auto' || this.tooltipTrigger() === 'hover';
  }
  private deferHide(reason: 'hover' | 'focus'): void {
    this.schedule(
      () => {
        if (!this.hovered && !this.paneHovered && !this.contains(this.document.activeElement))
          this.request(false, reason);
      },
      this.tooltipHideDelay(),
      100,
    );
  }
  private schedule(callback: () => void, delay: number, fallback: number): void {
    this.cancelTimer();
    this.timer = setTimeout(
      () => {
        this.timer = undefined;
        callback();
      },
      Number.isFinite(delay) ? Math.max(0, delay) : fallback,
    );
  }
  private cancelTimer(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
  private contains(target: Node | null): boolean {
    return (
      !!target &&
      (this.origin.contains(target) ||
        (!!this.handle && this.coordinator.contains(this.handle, target)))
    );
  }
  private surface(): HTMLElement | null {
    return this.document.getElementById(this.id);
  }
  private focusables(scope: HTMLElement): HTMLElement[] {
    return [
      ...scope.querySelectorAll<HTMLElement>('button,a[href],input,select,textarea,[tabindex]'),
    ].filter(element => this.checker.isTabbable(element));
  }
  private tab(event: KeyboardEvent): void {
    if (
      event.key !== 'Tab' ||
      !this.tooltipInteractive() ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.isComposing
    )
      return;
    const inside = this.focusables(this.handle!.element);
    const active = this.document.activeElement;
    if (active !== this.surface() && (event.shiftKey ? inside[0] : inside.at(-1)) !== active)
      return;
    const candidates = this.focusables(this.document.body).filter(
      element => !this.handle!.element.contains(element),
    );
    const index = candidates.indexOf(this.origin);
    event.preventDefault();
    this.hide('focus');
    this.restoring = true;
    (event.shiftKey ? this.origin : candidates[index + 1])?.focus();
    this.restoring = false;
  }
  private syncAria(destroy = false): void {
    const descriptions = (this.origin.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(value => value && value !== this.id);
    if (!destroy && this.visible() && !this.tooltipInteractive()) descriptions.push(this.id);
    if (descriptions.length) this.origin.setAttribute('aria-describedby', descriptions.join(' '));
    else this.origin.removeAttribute('aria-describedby');
    const attributes: Record<string, string | null> = {
      'aria-haspopup': 'dialog',
      'aria-expanded': String(this.visible()),
      'aria-controls': this.visible() ? this.id : null,
    };
    for (const [name, value] of Object.entries(attributes)) {
      const current = this.origin.getAttribute(name);
      const owned = this.owned.get(name);
      if (!destroy && this.tooltipInteractive()) {
        this.owned.set(name, {
          previous: !owned || current !== owned.last ? current : owned.previous,
          last: value,
        });
        this.setAttribute(name, value);
      } else if (owned) {
        if (current === owned.last) this.setAttribute(name, owned.previous);
        this.owned.delete(name);
      }
    }
  }
  private setAttribute(name: string, value: string | null): void {
    if (value === null) this.origin.removeAttribute(name);
    else this.origin.setAttribute(name, value);
  }
  private positioned(position: ZdOverlayConnectedPosition): void {
    const surface = this.surface();
    if (!surface) return;
    const side =
      position.originY === 'top' && position.overlayY === 'bottom'
        ? 'top'
        : position.originY === 'bottom' && position.overlayY === 'top'
          ? 'bottom'
          : position.originX;
    const origin = this.origin.getBoundingClientRect();
    const rect = surface.getBoundingClientRect();
    surface.setAttribute('data-zd-tooltip-side', side);
    surface.style.setProperty(
      '--zd-tooltip-arrow-x',
      `${Math.max(8, Math.min(rect.width - 8, origin.left + origin.width / 2 - rect.left))}px`,
    );
    surface.style.setProperty(
      '--zd-tooltip-arrow-y',
      `${Math.max(8, Math.min(rect.height - 8, origin.top + origin.height / 2 - rect.top))}px`,
    );
  }
  private positions(): ZdOverlayConnectedPosition[] {
    const side = this.tooltipSide();
    const align = this.tooltipAlign();
    const gap = Number.isFinite(this.tooltipGap()) ? Math.max(0, this.tooltipGap()) : 0;
    const position = (value: ZdTooltipSide): ZdOverlayConnectedPosition => {
      if (value === 'top' || value === 'bottom')
        return {
          originX: align,
          overlayX: align,
          originY: value,
          overlayY: value === 'top' ? 'bottom' : 'top',
          offsetY: value === 'top' ? -gap : gap,
          panelClass: `zd-tooltip-side-${value}`,
        };
      const y = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
      return {
        originX: value,
        overlayX: value === 'start' ? 'end' : 'start',
        originY: y,
        overlayY: y,
        offsetX: (value === 'start' ? -gap : gap) * (this.direction.value === 'rtl' ? -1 : 1),
        panelClass: `zd-tooltip-side-${value}`,
      };
    };
    const opposite: Record<ZdTooltipSide, ZdTooltipSide> = {
      top: 'bottom',
      bottom: 'top',
      start: 'end',
      end: 'start',
    };
    return this.tooltipAutoFlip() ? [position(side), position(opposite[side])] : [position(side)];
  }
}
