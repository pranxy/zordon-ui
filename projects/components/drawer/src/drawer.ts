import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  ViewEncapsulation,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { ZdClassNames, ZdIdGenerator } from '@pranxy/zordon-ui';
import { ZdModal } from '@pranxy/zordon-ui/modal';

export type ZdDrawerMode = 'modal' | 'persistent' | 'push' | 'responsive';
export type ZdDrawerInlineMode = 'persistent' | 'push';
export type ZdDrawerSide = 'start' | 'end';
export type ZdDrawerReason = 'close' | 'escape' | 'backdrop' | 'navigation' | 'swipe';
export interface ZdDrawerContext {
  readonly $implicit: () => void;
}

@Directive({ selector: 'ng-template[zdDrawerPanel]' })
export class ZdDrawerPanel {
  readonly template = inject<TemplateRef<ZdDrawerContext>>(TemplateRef);
  static ngTemplateContextGuard(
    _directive: ZdDrawerPanel,
    context: unknown,
  ): context is ZdDrawerContext {
    return true;
  }
}

@Component({
  selector: 'zd-drawer',
  exportAs: 'zdDrawer',
  imports: [NgTemplateOutlet, ZdModal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './drawer.css',
  host: {
    '[class]': 'classes()',
    '[attr.data-mode]': 'effectiveMode()',
    '[attr.data-side]': 'side()',
    '[attr.data-open]': 'open()',
    '[style.--zd-drawer-width.px]': 'checkedWidth()',
  },
  template: `
    @if (effectiveMode() !== 'modal') {
      <aside [id]="panelId" class="zd-drawer-inline" [attr.aria-label]="label()" [hidden]="!open()">
        @if (open()) {
          <ng-container [ngTemplateOutlet]="body" />
        }
      </aside>
    } @else if (!open()) {
      <div [id]="panelId" hidden></div>
    }
    <div class="zd-drawer-content"><ng-content /></div>
    <ng-template zdModal [open]="open() && effectiveMode() === 'modal'" [options]="options()">
      <div [id]="panelId" class="zd-drawer-surface" [style.--zd-drawer-width.px]="checkedWidth()">
        <ng-container [ngTemplateOutlet]="body" />
      </div>
    </ng-template>
    <ng-template #body>
      @if (swipe() && effectiveMode() === 'modal') {
        <button
          type="button"
          class="zd-drawer-swipe"
          (click)="swipeClick($event)"
          (pointerdown)="startSwipe($event)"
          (pointerup)="endSwipe($event)"
          (pointercancel)="cancelSwipe()"
        >
          {{ closeLabel() }}<span aria-hidden="true"> ↔</span>
        </button>
      }
      @if (panel(); as panel) {
        <ng-container
          [ngTemplateOutlet]="panel.template"
          [ngTemplateOutletContext]="{ $implicit: closePanel }"
        />
      }
    </ng-template>
  `,
})
export class ZdDrawer {
  readonly open = input(false, { transform: booleanAttribute });
  readonly openChange = output<boolean>();
  readonly closeRequest = output<ZdDrawerReason>();
  readonly label = input('Drawer');
  readonly mode = input<ZdDrawerMode>('modal');
  readonly desktopMode = input<ZdDrawerInlineMode>('persistent');
  readonly side = input<ZdDrawerSide>('start');
  readonly width = input(320);
  readonly breakpoint = input(768);
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly closeOnNavigation = input(false, { transform: booleanAttribute });
  readonly swipe = input(false, { transform: booleanAttribute });
  readonly closeLabel = input('Close drawer');
  readonly panelId = inject(ZdIdGenerator).next('drawer');
  private readonly names = inject(ZdClassNames);
  private readonly document = inject(DOCUMENT);
  private readonly direction = inject(Directionality);
  private readonly router = inject(Router, { optional: true });
  private readonly wide = signal(true);
  protected readonly panel = contentChild(ZdDrawerPanel);
  private gesture: { id: number; x: number; y: number } | null = null;
  private swiped = false;
  readonly effectiveMode = computed<Exclude<ZdDrawerMode, 'responsive'>>(() =>
    this.mode() === 'responsive'
      ? this.wide()
        ? this.desktopMode()
        : 'modal'
      : (this.mode() as Exclude<ZdDrawerMode, 'responsive'>),
  );
  protected readonly classes = computed(
    () => `${this.names.daisyUi('drawer')} ${this.names.daisyUi('drawer-' + this.side())}`,
  );
  protected readonly checkedWidth = computed(() => this.positive(this.width(), 'width'));
  protected readonly closePanel = (): void => this.requestClose();
  protected readonly options = computed(() => ({
    label: this.label(),
    backend: 'overlay' as const,
    size: 'full' as const,
    placement: this.side(),
    panelClass: 'zd-drawer-pane',
    beforeClose: (result: { readonly reason: string }) => {
      if (result.reason === 'escape' && !this.closeOnEscape()) return false;
      if (result.reason === 'backdrop' && !this.closeOnBackdrop()) return false;
      this.requestClose(
        result.reason === 'escape' || result.reason === 'backdrop' ? result.reason : 'close',
      );
      return false;
    },
  }));
  constructor() {
    this.router?.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationEnd && this.closeOnNavigation())
        this.requestClose('navigation');
    });
    afterRenderEffect(onCleanup => {
      const breakpoint = this.positive(this.breakpoint(), 'breakpoint');
      const media = this.document.defaultView?.matchMedia?.(`(min-width: ${breakpoint}px)`);
      if (!media) return;
      const update = (): void => this.wide.set(media.matches);
      update();
      media.addEventListener('change', update);
      onCleanup(() => media.removeEventListener('change', update));
    });
  }
  /** Emit a request only. The owner accepts by updating open. */
  requestClose(reason: ZdDrawerReason = 'close'): void {
    if (!this.open()) return;
    this.closeRequest.emit(reason);
    this.openChange.emit(false);
  }
  protected startSwipe(event: PointerEvent): void {
    this.swiped = false;
    if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
    this.gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  protected endSwipe(event: PointerEvent): void {
    const start = this.gesture;
    this.gesture = null;
    if (!start || start.id !== event.pointerId) return;
    const delta = event.clientX - start.x;
    this.swiped = Math.hypot(delta, event.clientY - start.y) > 10;
    const left = (this.side() === 'start') === (this.direction.value === 'ltr');
    if ((left ? -delta : delta) >= 64 && Math.abs(delta) > Math.abs(event.clientY - start.y)) {
      event.preventDefault();
      this.swiped = true;
      this.requestClose('swipe');
    }
  }
  protected cancelSwipe(): void {
    this.gesture = null;
  }
  protected swipeClick(event: MouseEvent): void {
    if (this.swiped && event.detail > 0) event.preventDefault();
    else this.requestClose();
    this.swiped = false;
  }
  private positive(value: number, name: string): number {
    if (!Number.isFinite(value) || value <= 0)
      throw new RangeError(`Drawer ${name} must be finite and positive.`);
    return value;
  }
}
