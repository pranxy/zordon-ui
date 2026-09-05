import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdIndicatorHorizontalPlacement = 'start' | 'center' | 'end';
export type ZdIndicatorVerticalPlacement = 'top' | 'middle' | 'bottom';

@Directive({ selector: '[zdIndicator]', host: { '[class]': 'hostClass' } })
export class ZdIndicator {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('indicator');
}

@Directive({ selector: '[zdIndicatorItem]', host: { '[class]': 'hostClasses()' } })
export class ZdIndicatorItem {
  readonly horizontalPlacement = input<ZdIndicatorHorizontalPlacement | undefined>(undefined);
  readonly verticalPlacement = input<ZdIndicatorVerticalPlacement | undefined>(undefined);

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('indicator-item'),
      this.horizontalPlacement() &&
        this.classNames.daisyUi(`indicator-${this.horizontalPlacement()}`),
      this.verticalPlacement() && this.classNames.daisyUi(`indicator-${this.verticalPlacement()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
