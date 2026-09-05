import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdStackVerticalAlignment = 'top' | 'bottom';
export type ZdStackHorizontalAlignment = 'start' | 'end';

@Directive({ selector: '[zdStack]', host: { '[class]': 'hostClasses()' } })
export class ZdStack {
  readonly verticalAlignment = input<ZdStackVerticalAlignment | undefined>(undefined);
  readonly horizontalAlignment = input<ZdStackHorizontalAlignment | undefined>(undefined);

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('stack'),
      this.verticalAlignment() && this.classNames.daisyUi(`stack-${this.verticalAlignment()}`),
      this.horizontalAlignment() && this.classNames.daisyUi(`stack-${this.horizontalAlignment()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
