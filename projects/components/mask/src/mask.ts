import { computed, Directive, inject, input } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdMaskShape =
  | 'squircle'
  | 'decagon'
  | 'diamond'
  | 'heart'
  | 'hexagon'
  | 'hexagon-2'
  | 'circle'
  | 'pentagon'
  | 'star'
  | 'star-2'
  | 'triangle'
  | 'triangle-2'
  | 'triangle-3'
  | 'triangle-4';
export type ZdMaskHalf = 'half-1' | 'half-2';

@Directive({ selector: '[zdMask]', host: { '[class]': 'hostClasses()' } })
export class ZdMask {
  readonly shape = input<ZdMaskShape | undefined>(undefined);
  readonly half = input<ZdMaskHalf | undefined>(undefined);
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('mask'),
      this.shape() && this.classNames.daisyUi(`mask-${this.shape()}`),
      this.half() && this.classNames.daisyUi(`mask-${this.half()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
