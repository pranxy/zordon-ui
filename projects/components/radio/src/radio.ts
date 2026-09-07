import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdRadioColor =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';
export type ZdRadioSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Directive({
  selector: 'input[type="radio"][zdRadio]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdRadio {
  readonly color = input<ZdRadioColor | undefined>();
  readonly size = input<ZdRadioSize | undefined>();

  private readonly classNames = inject(ZdClassNames);

  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('radio'),
      this.color() && this.classNames.daisyUi(`radio-${this.color()}`),
      this.size() && this.classNames.daisyUi(`radio-${this.size()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
