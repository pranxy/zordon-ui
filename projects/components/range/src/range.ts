import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdRangeColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdRangeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Directive({ selector: 'input[type="range"][zdRange]', host: { '[class]': 'hostClasses()' } })
export class ZdRange {
  readonly color = input<ZdRangeColor | undefined>();
  readonly size = input<ZdRangeSize | undefined>();
  readonly vertical = input(false, { transform: booleanAttribute });
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('range'),
      this.color() && this.classNames.daisyUi(`range-${this.color()}`),
      this.size() && this.classNames.daisyUi(`range-${this.size()}`),
      this.vertical() && this.classNames.daisyUi('range-vertical'),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
