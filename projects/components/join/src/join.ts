import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdJoinDirection = 'horizontal' | 'vertical';

@Directive({ selector: '[zdJoin]', host: { '[class]': 'hostClasses()' } })
export class ZdJoin {
  readonly direction = input<ZdJoinDirection | undefined>(undefined);

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('join'),
      this.direction() && this.classNames.daisyUi(`join-${this.direction()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

@Directive({ selector: '[zdJoinItem]', host: { '[class]': 'hostClass' } })
export class ZdJoinItem {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('join-item');
}
