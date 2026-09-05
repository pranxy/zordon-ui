import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdFooterDirection = 'horizontal' | 'vertical';

@Directive({ selector: '[zdFooter]', host: { '[class]': 'hostClasses()' } })
export class ZdFooter {
  readonly direction = input<ZdFooterDirection | undefined>(undefined);
  readonly center = input(false, { transform: booleanAttribute });

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('footer'),
      this.direction() && this.classNames.daisyUi(`footer-${this.direction()}`),
      this.center() && this.classNames.daisyUi('footer-center'),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

@Directive({ selector: '[zdFooterTitle]', host: { '[class]': 'hostClass' } })
export class ZdFooterTitle {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('footer-title');
}
