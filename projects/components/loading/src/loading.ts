import { isPlatformBrowser } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  PLATFORM_ID,
} from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdLoadingVariant =
  'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity' | 'custom';
export type ZdLoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdLoadingColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdLoadingLayout = 'inline' | 'center' | 'overlay';

/** Decorative artwork and an independently mounted status region for indeterminate work. */
@Component({
  selector: 'zd-loading',
  exportAs: 'zdLoading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'decorative() ? null : "status"',
    '[attr.aria-atomic]': 'decorative() ? null : "true"',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
    '[attr.data-zd-loading-layout]': 'layout()',
    '[attr.data-zd-loading-visible]': 'visible()',
    '[style.--zd-loading-color]': 'color() ? "var(--color-" + color() + ")" : null',
    '[style.--zd-loading-size]': 'sizeFactor()',
  },
  styles: `
    :host {
      display: inline-flex;
      vertical-align: middle;
      pointer-events: none;
    }
    :host([data-zd-loading-layout='center']) {
      display: flex;
      justify-content: center;
    }
    :host([data-zd-loading-layout='overlay']) {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    .zd-loading-view {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      max-inline-size: 100%;
    }
    .zd-loading-view[hidden] {
      display: none;
    }
    .zd-loading-art {
      display: inline-flex;
      color: var(--zd-loading-color, currentColor);
    }
    .zd-loading-static {
      display: none;
      box-sizing: border-box;
      inline-size: calc(var(--size-selector, 0.25rem) * var(--zd-loading-size));
      block-size: calc(var(--size-selector, 0.25rem) * var(--zd-loading-size));
      border: 2px solid currentColor;
      border-inline-end-color: transparent;
      border-radius: 50%;
    }
    .zd-loading-label {
      overflow-wrap: anywhere;
    }
    .zd-loading-status {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }
    @media (prefers-reduced-motion: reduce), (forced-colors: active) {
      .zd-loading-animated,
      .zd-loading-custom {
        display: none;
      }
      .zd-loading-static {
        display: inline-block;
        color: CanvasText;
      }
    }
    @media (prefers-reduced-motion: reduce) and (forced-colors: none) {
      .zd-loading-static {
        color: inherit;
      }
    }
  `,
  template: `
    <span class="zd-loading-view" [hidden]="!visible()" aria-hidden="true" inert>
      <span class="zd-loading-art">
        @if (variant() === 'custom') {
          <span class="zd-loading-custom"><ng-content select="[zdLoadingCustom]" /></span>
        } @else {
          <span class="zd-loading-animated" [class]="glyphClasses()"></span>
        }
        <span class="zd-loading-static"></span>
      </span>
      @if (showLabel()) {
        <span class="zd-loading-label">{{ label() }}</span>
      }
    </span>
    <span class="zd-loading-status">{{ visible() && !decorative() ? label() : '' }}</span>
  `,
})
export class ZdLoading {
  readonly active = input(true, { transform: booleanAttribute });
  readonly variant = input<ZdLoadingVariant>('spinner');
  readonly size = input<ZdLoadingSize>('md');
  readonly color = input<ZdLoadingColor>();
  readonly layout = input<ZdLoadingLayout>('inline');
  readonly decorative = input(false, { transform: booleanAttribute });
  readonly showLabel = input(false, { transform: booleanAttribute });
  readonly label = input('Loading', {
    transform: (value: string) => {
      if (!value.trim()) throw new RangeError('Loading label must be nonempty.');
      return value;
    },
  });
  /** Delay before artwork and status text appear; canceled when inactive or destroyed. */
  readonly delay = input(0, {
    transform: (value: number | string) => {
      const delay = Number(value);
      if (!Number.isFinite(delay) || delay < 0 || delay > 2147483647)
        throw new RangeError('Loading delay must be between 0 and 2147483647 milliseconds.');
      return delay;
    },
  });
  private readonly names = inject(ZdClassNames);
  private readonly platform = inject(PLATFORM_ID);
  private readonly elapsed = linkedSignal({
    source: () => ({ active: this.active(), delay: this.delay() }),
    computation: () => false,
  });
  readonly visible = computed(() => this.active() && (this.delay() === 0 || this.elapsed()));
  protected readonly sizeFactor = computed(
    () => ({ xs: 4, sm: 5, md: 6, lg: 7, xl: 8 })[this.size()],
  );
  protected readonly glyphClasses = computed(() =>
    [
      this.names.daisyUi('loading'),
      this.names.daisyUi(`loading-${this.variant()}`),
      this.names.daisyUi(`loading-${this.size()}`),
    ].join(' '),
  );
  constructor() {
    afterRenderEffect(onCleanup => {
      if (!isPlatformBrowser(this.platform) || !this.active() || this.delay() === 0) return;
      const timer = setTimeout(() => this.elapsed.set(true), this.delay());
      onCleanup(() => clearTimeout(timer));
    });
  }
}
