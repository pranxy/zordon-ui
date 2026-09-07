import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdFilterColor =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';
export type ZdFilterSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdFilterStyle = 'outline' | 'dash' | 'soft' | 'ghost' | 'link';

@Directive({ selector: '[zdFilter]', host: { '[class]': 'hostClass' } })
export class ZdFilter {
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClass = this.classNames.daisyUi('filter');
}

@Directive({
  selector: 'input[type="radio"][zdFilterItem], input[type="checkbox"][zdFilterItem], input[type="reset"][zdFilterItem]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdFilterItem {
  readonly color = input<ZdFilterColor | undefined>();
  readonly size = input<ZdFilterSize | undefined>();
  readonly style = input<ZdFilterStyle | undefined>();

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('btn'),
      this.color() && this.classNames.daisyUi(`btn-${this.color()}`),
      this.size() && this.classNames.daisyUi(`btn-${this.size()}`),
      this.style() && this.classNames.daisyUi(`btn-${this.style()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

@Directive({
  selector: 'input[type="radio"][zdFilterReset]',
  host: { '[class]': 'hostClass' },
})
export class ZdFilterReset {
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClass = this.classNames.daisyUi('filter-reset');
}
