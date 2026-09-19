import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdProgressColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export interface ZdProgressState {
  readonly value: number | null;
  readonly max: number;
  readonly percent: number | null;
  readonly buffer: number | null;
  readonly complete: boolean;
}
export type ZdProgressFormatter = (state: ZdProgressState) => string;

function optionalNumber(value: number | null | undefined): number | null {
  if (value == null) return null;
  if (!Number.isFinite(value)) throw new RangeError('Progress values must be finite.');
  return value;
}

/** Native progress semantics with one accessible indicator and an optional decorative buffer. */
@Component({
  selector: 'zd-progress',
  exportAs: 'zdProgress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-zd-progress-complete]': 'complete()',
    '[attr.data-zd-progress-animated]': 'animated()',
    '[style.--zd-progress-color]': 'color() ? "var(--color-" + color() + ")" : null',
  },
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }
    .zd-progress-label {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-block-end: 0.5rem;
      overflow-wrap: anywhere;
    }
    .zd-progress-track {
      position: relative;
      display: flex;
      align-items: center;
    }
    progress {
      display: block;
      inline-size: 100%;
      position: relative;
    }
    .zd-progress-buffer {
      position: absolute;
      inset-inline-start: 0;
      block-size: 0.5rem;
      border-radius: var(--radius-box, 0.5rem);
      background: var(--zd-progress-color, var(--color-base-content, currentColor));
      opacity: 0.3;
    }
    :host([data-zd-progress-animated='false']) progress {
      animation: none !important;
    }
    :host([data-zd-progress-animated='false']) progress::-webkit-progress-value {
      transition: none !important;
    }
    :host([data-zd-progress-animated='false']) progress::-moz-progress-bar {
      animation: none !important;
      transition: none !important;
    }
    @media (prefers-reduced-motion: reduce) {
      progress {
        animation: none !important;
      }
      progress::-webkit-progress-value {
        transition: none !important;
      }
      progress::-moz-progress-bar {
        animation: none !important;
        transition: none !important;
      }
    }
    @media (forced-colors: active) {
      progress {
        appearance: auto;
        background: none;
        animation: none !important;
      }
      .zd-progress-buffer {
        display: none;
      }
    }
  `,
  template: `
    @if (showLabel()) {
      <span class="zd-progress-label" aria-hidden="true"
        ><bdi>{{ label() }}</bdi
        ><bdi>{{ text() }}</bdi></span
      >
    }
    <span class="zd-progress-track">
      @if (bufferPercent() !== null) {
        <span
          class="zd-progress-buffer"
          aria-hidden="true"
          [style.inline-size.%]="bufferPercent()"
        ></span>
      }
      <progress
        [class]="classes()"
        [attr.value]="state().value"
        [max]="max()"
        [attr.aria-label]="label()"
        [attr.aria-valuetext]="text()"
      ></progress>
    </span>
  `,
})
export class ZdProgress {
  readonly label = input.required<string, string>({
    transform: (value: string) => {
      if (!value.trim()) throw new RangeError('Progress label must be nonempty.');
      return value;
    },
  });
  /** Null or undefined removes the native value attribute, making progress indeterminate. */
  readonly value = input<number | null, number | null | undefined>(null, {
    transform: optionalNumber,
  });
  readonly max = input(100, {
    transform: (value: number) => {
      if (!Number.isFinite(value) || value <= 0)
        throw new RangeError('Progress max must be finite and positive.');
      return value;
    },
  });
  readonly buffer = input<number | null, number | null | undefined>(null, {
    transform: optionalNumber,
  });
  readonly color = input<ZdProgressColor>();
  readonly showLabel = input(true, { transform: booleanAttribute });
  readonly animated = input(true, { transform: booleanAttribute });
  /** Format both visible text and native aria-valuetext; keep the function pure for SSR. */
  readonly format = input<ZdProgressFormatter>();
  private readonly names = inject(ZdClassNames);
  readonly state = computed<ZdProgressState>(() => {
    const max = this.max();
    const raw = this.value();
    const value = raw === null ? null : Math.min(max, Math.max(0, raw));
    const buffer = this.buffer();
    return {
      value,
      max,
      percent: value === null ? null : (value / max) * 100,
      buffer: value === null || buffer === null ? null : Math.min(max, Math.max(value, buffer)),
      complete: value === max,
    };
  });
  readonly complete = computed(() => this.state().complete);
  readonly text = computed(() => {
    const state = this.state();
    const format = this.format();
    return format
      ? format(state)
      : state.percent === null
        ? 'In progress'
        : `${Math.round(state.percent)}%`;
  });
  protected readonly bufferPercent = computed(() => {
    const state = this.state();
    return state.buffer === null ? null : (state.buffer / state.max) * 100;
  });
  protected readonly classes = computed(() =>
    [
      this.names.daisyUi('progress'),
      ...(this.color() ? [this.names.daisyUi(`progress-${this.color()}`)] : []),
    ].join(' '),
  );
}
