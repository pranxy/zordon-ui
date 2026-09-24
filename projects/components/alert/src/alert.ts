import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdAlertColor = 'info' | 'success' | 'warning' | 'error';
export type ZdAlertVariant = 'soft' | 'outline' | 'dash';
export type ZdAlertDirection = 'horizontal' | 'vertical' | 'responsive';
export type ZdAlertAnnouncement = 'off' | 'polite' | 'assertive';
export type ZdAlertDismissReason = 'close-button' | 'timeout' | 'api';

/** An inline message with projected content and consumer-accepted dismissal requests. */
@Component({
  selector: 'zd-alert',
  exportAs: 'zdAlert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[hidden]': '!open()',
    '[attr.inert]': 'open() ? null : ""',
    '[attr.role]':
      '!open() || announcement() === "off" ? null : announcement() === "polite" ? "status" : "alert"',
    '[attr.aria-atomic]': 'open() && announcement() !== "off" ? "true" : null',
    '[attr.data-zd-alert-direction]': 'direction()',
    '(pointerenter)': 'hovered.set(true)',
    '(pointerleave)': 'hovered.set(false)',
    '(focusin)': 'focused.set(true)',
    '(focusout)': 'focusOut($event)',
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-inline-size: 0;
    }
    :host([hidden]) {
      display: none;
    }
    :host([data-zd-alert-direction='vertical']),
    :host([data-zd-alert-direction='responsive']) {
      flex-direction: column;
      text-align: center;
    }
    .zd-alert-content {
      flex: 1;
      min-inline-size: 0;
      overflow-wrap: anywhere;
    }
    .zd-alert-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }
    .zd-alert-icon:empty,
    .zd-alert-actions:empty {
      display: none;
    }
    .zd-alert-close {
      color: inherit;
      background: transparent;
      border: 1px solid currentColor;
      border-radius: 0.5rem;
      min-inline-size: 2.75rem;
      min-block-size: 2.75rem;
      cursor: pointer;
      font: inherit;
    }
    .zd-alert-close:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
    @media (min-width: 40rem) {
      :host([data-zd-alert-direction='responsive']) {
        flex-direction: row;
        text-align: start;
      }
    }
  `,
  template: `
    <div class="zd-alert-icon" aria-hidden="true"><ng-content select="[zdAlertIcon]" /></div>
    <div class="zd-alert-content">
      <ng-content select="[zdAlertTitle]" /><ng-content /><ng-content select="[zdAlertDetails]" />
    </div>
    <div class="zd-alert-actions">
      <ng-content select="[zdAlertActions]" />
      @if (dismissible()) {
        <button
          type="button"
          class="zd-alert-close"
          [attr.aria-label]="dismissLabel()"
          (click)="dismiss('close-button')"
        >
          <span aria-hidden="true">×</span>
        </button>
      }
    </div>
  `,
})
export class ZdAlert {
  readonly color = input<ZdAlertColor>();
  readonly variant = input<ZdAlertVariant>();
  readonly direction = input<ZdAlertDirection>('responsive');
  /** Off by default: static messages must not interrupt screen-reader users. */
  readonly announcement = input<ZdAlertAnnouncement>('off');
  readonly open = input(true, { transform: booleanAttribute });
  readonly dismissible = input(false, { transform: booleanAttribute });
  readonly dismissLabel = input('Dismiss alert');
  /** Active milliseconds before one close request; zero disables. Paused on hover/focus/hidden tab. */
  readonly autoDismiss = input(0, {
    transform: (value: number | string) => {
      const delay = Number(value);
      if (!Number.isFinite(delay) || delay < 0 || delay > 2147483647)
        throw new RangeError('Alert autoDismiss must be between 0 and 2147483647 milliseconds.');
      return delay;
    },
  });
  readonly openChange = output<boolean>();
  readonly dismissRequested = output<ZdAlertDismissReason>();
  private readonly names = inject(ZdClassNames);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly platform = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ready = signal(false);
  private readonly hidden = signal(false);
  private readonly requested = signal(false);
  protected readonly hovered = signal(false);
  protected readonly focused = signal(false);
  private remaining = 0;
  private previousDelay = 0;
  private previousOpen = false;
  protected readonly classes = computed(() =>
    [
      this.names.daisyUi('alert'),
      this.color() && this.names.daisyUi(`alert-${this.color()}`),
      this.variant() && this.names.daisyUi(`alert-${this.variant()}`),
      this.direction() !== 'responsive' && this.names.daisyUi(`alert-${this.direction()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platform)) return;
      const visibility = () => this.hidden.set(this.document.hidden);
      visibility();
      this.document.addEventListener('visibilitychange', visibility);
      this.destroyRef.onDestroy(() =>
        this.document.removeEventListener('visibilitychange', visibility),
      );
      this.ready.set(true);
    });
    afterRenderEffect(onCleanup => {
      if (!this.ready()) return;
      const open = this.open();
      const delay = this.autoDismiss();
      if (!open || !this.previousOpen || delay !== this.previousDelay) {
        this.remaining = delay;
        this.requested.set(false);
      }
      this.previousDelay = delay;
      this.previousOpen = open;
      if (
        !open ||
        delay === 0 ||
        this.requested() ||
        this.hovered() ||
        this.focused() ||
        this.hidden()
      )
        return;
      const start = Date.now();
      const timer = setTimeout(() => this.dismiss('timeout'), this.remaining);
      onCleanup(() => {
        clearTimeout(timer);
        this.remaining = Math.max(0, this.remaining - (Date.now() - start));
      });
    });
  }
  /** Emits at most once until closed/reopened or autoDismiss is changed. Does not move focus. */
  dismiss(reason: ZdAlertDismissReason = 'api'): void {
    if (!this.open() || this.requested()) return;
    this.requested.set(true);
    this.dismissRequested.emit(reason);
    this.openChange.emit(false);
  }
  protected focusOut(event: FocusEvent): void {
    this.focused.set(this.element.contains(event.relatedTarget as Node | null));
  }
}
