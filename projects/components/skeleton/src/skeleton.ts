import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
} from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdSkeletonShape = 'text' | 'rectangle' | 'circle' | 'custom';
export type ZdSkeletonPreset = 'none' | 'paragraph' | 'avatar-text' | 'card';
export type ZdSkeletonAnimation = 'shimmer' | 'pulse' | 'none';

/** Decorative placeholder artwork; loading state and announcements belong to the consumer. */
@Component({
  selector: 'zd-skeleton',
  exportAs: 'zdSkeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    'inert': '',
    '[hidden]': '!active()',
    '[style.inline-size]': 'resolvedWidth()',
    '[style.--zd-skeleton-duration]': 'speed() + "ms"',
    '[attr.data-zd-skeleton-animation]': 'animation()',
  },
  styles: `
    :host {
      display: block;
      max-inline-size: 100%;
    }
    :host([hidden]) {
      display: none;
    }
    .zd-skeleton-part {
      display: block;
      min-inline-size: 0;
      animation-duration: var(--zd-skeleton-duration) !important;
    }
    .zd-skeleton-lines {
      display: grid;
      gap: 0.75rem;
      min-inline-size: 0;
      flex: 1;
    }
    .zd-skeleton-layout {
      display: grid;
      gap: 1rem;
    }
    .zd-skeleton-avatar-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .zd-skeleton-avatar {
      inline-size: 3rem;
      block-size: 3rem;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .zd-skeleton-image {
      block-size: 8rem;
    }
    :host([data-zd-skeleton-animation='pulse']) .zd-skeleton-part {
      background-image: none;
      animation: zd-skeleton-pulse var(--zd-skeleton-duration) ease-in-out infinite;
    }
    :host([data-zd-skeleton-animation='none']) .zd-skeleton-part {
      animation: none !important;
      background-image: none;
      will-change: auto;
    }
    @keyframes zd-skeleton-pulse {
      50% {
        opacity: 0.45;
      }
    }
    @media (prefers-reduced-motion: reduce), (forced-colors: active) {
      .zd-skeleton-part {
        animation: none !important;
        transition: none !important;
        background-image: none !important;
        will-change: auto;
      }
    }
    @media (forced-colors: active) {
      .zd-skeleton-part {
        background: Canvas;
        border: 1px solid CanvasText;
        box-sizing: border-box;
      }
    }
  `,
  template: `
    <span class="zd-skeleton-layout" [class.zd-skeleton-avatar-row]="preset() === 'avatar-text'">
      @if (preset() === 'avatar-text') {
        <span class="zd-skeleton-avatar" [class]="partClass"></span>
      }
      @if (preset() === 'card') {
        <span class="zd-skeleton-image" [class]="partClass" [style.border-radius]="radius()"></span>
      }
      @if (preset() !== 'none' || shape() === 'text') {
        <span class="zd-skeleton-lines">
          @for (line of lineIndexes(); track line) {
            <span
              [class]="partClass"
              [style.block-size]="height() ?? '1rem'"
              [style.inline-size]="line === lines() - 1 ? lastLineWidth() : '100%'"
              [style.border-radius]="radius()"
            ></span>
          }
        </span>
      } @else {
        <span
          [class]="partClass"
          [style.block-size]="resolvedHeight()"
          [style.border-radius]="resolvedRadius()"
          [style.clip-path]="shape() === 'custom' ? clipPath() : null"
        ></span>
      }
    </span>
  `,
})
export class ZdSkeleton {
  readonly active = input(true, { transform: booleanAttribute });
  readonly shape = input<ZdSkeletonShape>('rectangle');
  readonly preset = input<ZdSkeletonPreset>('none');
  readonly width = input<string>();
  readonly height = input<string>();
  readonly radius = input<string>();
  readonly clipPath = input('none');
  readonly lines = input(3, {
    transform: (value: number) => {
      if (!Number.isInteger(value) || value < 1 || value > 100)
        throw new RangeError('Skeleton lines must be an integer from 1 through 100.');
      return value;
    },
  });
  readonly lastLineWidth = input('60%');
  readonly animation = input<ZdSkeletonAnimation>('shimmer');
  readonly speed = input(1800, {
    transform: (value: number) => {
      if (!Number.isFinite(value) || value <= 0)
        throw new RangeError('Skeleton speed must be finite and positive milliseconds.');
      return value;
    },
  });
  protected readonly partClass = 'zd-skeleton-part ' + inject(ZdClassNames).daisyUi('skeleton');
  protected readonly lineIndexes = computed(() =>
    Array.from({ length: this.lines() }, (_, index) => index),
  );
  protected readonly resolvedWidth = computed(
    () => this.width() ?? (this.preset() === 'none' && this.shape() === 'circle' ? '3rem' : '100%'),
  );
  protected readonly resolvedHeight = computed(
    () => this.height() ?? (this.shape() === 'circle' ? '3rem' : '8rem'),
  );
  protected readonly resolvedRadius = computed(
    () => this.radius() ?? (this.shape() === 'circle' ? '50%' : null),
  );
}

/** Apply to the real loading region, not to decorative Skeleton artwork. */
@Directive({
  selector: '[zdSkeletonRegion]',
  exportAs: 'zdSkeletonRegion',
  host: { '[attr.aria-busy]': 'loading()' },
})
export class ZdSkeletonRegion {
  readonly loading = input(false, { alias: 'zdSkeletonRegion', transform: booleanAttribute });
}
