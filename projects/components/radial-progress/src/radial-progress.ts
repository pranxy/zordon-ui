import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdRadialProgressColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export interface ZdRadialProgressState {
  readonly value: number | null;
  readonly max: number;
  readonly percent: number | null;
  readonly complete: boolean;
}
export type ZdRadialProgressFormatter = (state: ZdRadialProgressState) => string;
export interface ZdRadialProgressThreshold {
  /** Inclusive lower percentage boundary, from 0 through 100. */
  readonly at: number;
  readonly color: ZdRadialProgressColor;
}

function thresholds(
  value: readonly ZdRadialProgressThreshold[],
): readonly ZdRadialProgressThreshold[] {
  let previous = -1;
  return value.map(threshold => {
    if (
      !Number.isFinite(threshold.at) ||
      threshold.at < 0 ||
      threshold.at > 100 ||
      threshold.at <= previous
    )
      throw new RangeError('Radial Progress thresholds must increase strictly from 0 through 100.');
    previous = threshold.at;
    return { ...threshold };
  });
}

/** A non-interactive progressbar with decorative ring and projected center content. */
@Component({
  selector: 'zd-radial-progress',
  exportAs: 'zdRadialProgress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'progressbar',
    '[style.inline-size]': 'size()',
    '[style.block-size]': 'size()',
    '[attr.aria-label]': 'label()',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'state().value',
    '[attr.aria-valuetext]': 'text()',
    '[attr.data-zd-radial-indeterminate]': 'state().value === null',
    '[attr.data-zd-radial-empty]': 'state().value === 0',
    '[attr.data-zd-radial-animated]': 'animated()',
    '[attr.data-zd-radial-complete]': 'complete()',
  },
  styles: `
    :host {
      display: inline-grid;
      vertical-align: middle;
      isolation: isolate;
    }
    .zd-radial-ring,
    .zd-radial-content {
      grid-area: 1 / 1;
    }
    .zd-radial-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0.5rem;
      min-inline-size: 0;
      overflow-wrap: anywhere;
      z-index: 1;
      pointer-events: none;
    }
    .zd-radial-ring {
      color: var(--zd-radial-color, currentColor);
    }
    :host([data-zd-radial-empty='true']) .zd-radial-ring::before,
    :host([data-zd-radial-empty='true']) .zd-radial-ring::after {
      visibility: hidden;
    }
    :host([data-zd-radial-indeterminate='true']) .zd-radial-ring {
      animation: zd-radial-spin 1.5s linear infinite;
    }
    :host([data-zd-radial-animated='false']) .zd-radial-ring,
    :host([data-zd-radial-animated='false']) .zd-radial-ring::after {
      animation: none !important;
      transition: none !important;
    }
    @keyframes zd-radial-spin {
      to {
        rotate: 360deg;
      }
    }
    @media (prefers-reduced-motion: reduce), (forced-colors: active) {
      .zd-radial-ring,
      .zd-radial-ring::after {
        animation: none !important;
        transition: none !important;
      }
    }
    @media (forced-colors: active) {
      .zd-radial-ring {
        box-sizing: border-box;
        border: 2px solid CanvasText;
      }
      .zd-radial-ring::before,
      .zd-radial-ring::after {
        display: none;
      }
    }
  `,
  template: `
    <span
      class="zd-radial-ring"
      [class]="ringClass"
      aria-hidden="true"
      [style.--value]="state().percent ?? 25"
      [style.--size]="size()"
      [style.--thickness]="thickness()"
      [style.--zd-radial-color]="resolvedColor() ? 'var(--color-' + resolvedColor() + ')' : null"
    ></span>
    <span class="zd-radial-content" aria-hidden="true" inert>
      <ng-content select="[zdRadialProgressIcon]" />
      <ng-content select="[zdRadialProgressLabel]"
        ><bdi>{{ text() }}</bdi></ng-content
      >
    </span>
  `,
})
export class ZdRadialProgress {
  readonly label = input.required<string, string>({
    transform: (value: string) => {
      if (!value.trim()) throw new RangeError('Radial Progress label must be nonempty.');
      return value;
    },
  });
  readonly value = input<number | null, number | null | undefined>(null, {
    transform: value => {
      if (value == null) return null;
      if (!Number.isFinite(value)) throw new RangeError('Radial Progress value must be finite.');
      return value;
    },
  });
  readonly max = input(100, {
    transform: (value: number) => {
      if (!Number.isFinite(value) || value <= 0)
        throw new RangeError('Radial Progress max must be finite and positive.');
      return value;
    },
  });
  readonly size = input('5rem');
  readonly thickness = input('calc(var(--size) / 10)');
  readonly color = input<ZdRadialProgressColor>();
  readonly thresholds = input<
    readonly ZdRadialProgressThreshold[],
    readonly ZdRadialProgressThreshold[]
  >([], { transform: thresholds });
  readonly animated = input(true, { transform: booleanAttribute });
  readonly format = input<ZdRadialProgressFormatter>();
  protected readonly ringClass = inject(ZdClassNames).daisyUi('radial-progress');
  readonly state = computed<ZdRadialProgressState>(() => {
    const max = this.max();
    const raw = this.value();
    const value = raw === null ? null : Math.min(max, Math.max(0, raw));
    return {
      value,
      max,
      percent: value === null ? null : (value / max) * 100,
      complete: value === max,
    };
  });
  readonly complete = computed(() => this.state().complete);
  readonly resolvedColor = computed(() => {
    const percent = this.state().percent;
    let color = this.color();
    if (percent !== null) {
      for (const threshold of this.thresholds()) {
        if (threshold.at <= percent) color = threshold.color;
      }
    }
    return color;
  });
  readonly text = computed(() => {
    const state = this.state();
    const format = this.format();
    return format
      ? format(state)
      : state.percent === null
        ? 'In progress'
        : `${Math.round(state.percent)}%`;
  });
}
